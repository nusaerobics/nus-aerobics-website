import clsx from "clsx";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Chip, Input, Pagination, Spinner } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  MdChevronLeft,
  MdMoreVert,
  MdCheckCircleOutline,
  MdOutlineCancel,
} from "react-icons/md";
import ClassDetails from "../classes/ClassDetails";
import ClassForm from "../classes/ClassForm";
import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  modalClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { PageTitle, SectionTitle } from "../utils/Titles";
import Toast from "../Toast";

export default function AdminClassViewPage({ classId }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedClass, setSelectedClass] = useState({
    name: "",
    description: "",
    date: "2024-01-01 00:00",
    maxCapacity: 19,
    bookedCapacity: 0,
    status: "open",
  });
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [modalType, setModalType] = useState("view"); // Either: "view", "loading", or "result"
  const [result, setResult] = useState({}); // {  isSuccess: boolean, header: string, message: string }
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log(classId);

    // getClass
    const fetchClass = async () => {
      try {
        const res = await fetch(`/api/classes?id=${classId}`);
        if (!res.ok) {
          throw new Error(`Unable to get class ${classId}: ${res.status}`);
        }
        const data = await res.json();
        setSelectedClass(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get class",
          message: `Unable to get class ${classId}. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchClass();

    // getBookingsByClass
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?classId=${classId}`);
        if (!res.ok) {
          throw new Error(
            `Unable to get bookings for class ${classId}: ${res.status}`
          );
        }
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get bookings for class",
          message: `Unable to get bookings for class ${classId}. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchBookings();
  }, []);

  const rowsPerPage = 10;
  const bookingPages = Math.ceil(bookings.length / rowsPerPage);
  const bookingItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return bookings.slice(start, end);
  }, [page, bookings]);

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const selectRow = (rowData) => {
    setSelectedBooking(rowData);
  };
  const handleDropdown = (key) => {
    switch (key) {
      case "mark":
        markPresent(selectedBooking);
        return;
      case "unbook":
        unbookUser(selectedBooking);
        return;
    }
  };
  const onCloseModal = () => {
    setModalType("view");
    onOpenChange();
  };
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };
  const validateEmail = (email) => {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const isInvalidEmail = useMemo(() => {
    if (email != "") {
      return !validateEmail(email);
    }
    return false;
  });

  async function bookUser() {
    setModalType("loading");
    try {
      // 1. Find user by email
      const res1 = await fetch(`/api/users?email=${email}`);
      if (!res1.ok) {
        setResult({
          isSuccess: false,
          header: "User not found",
          message: `No user exists for ${email}. Try again with a registered email.`,
        });
        setModalType("result");
        return;
        // throw new Error(`Unable to find user by ${email}: ${res1.status}`);
      }
      const user = await res1.json();

      // 2. Create new booking for user
      const res2 = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass.id, userId: user.id }),
      });
      if (!res2.ok) {
        throw new Error("Unable to create booking");
      }

      // 3. Update user's balance
      const res3 = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, balance: user.balance - 1 }),
      });
      if (!res3.ok) {
        throw new Error("Unable to update user");
      }

      // 4. Create new transaction
      const newTransaction = {
        userId: user.id,
        amount: -1,
        type: "book",
        description: `Booked '${selectedClass.name}'`,
      };
      const res4 = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res4.ok) {
        throw new Error("Unable to create transaction");
      }

      // Update bookings
      const fetchBookings = async () => {
        try {
          const res = await fetch(`/api/bookings?classId=${classId}`);
          if (!res.ok) {
            throw new Error(
              `Unable to get updated bookings for class ${classId}: ${res.status}`
            );
          }
          const data = await res.json();
          setBookings(data);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to get updated bookings for class",
            message: `Unable to get updated bookings for class ${classId}. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      fetchBookings();

      setResult({
        isSuccess: true,
        header: "Booking successful",
        message: `${user.name} has been successfully booked for ${selectedClass.name}.`,
      });
      setModalType("result");
    } catch (error) {
      setResult({
        isSuccess: false,
        header: "Booking unsuccessful",
        message: `An error occurred while trying to book ${selectedClass.name}. Try again later.`,
      });
      setModalType("result");
      console.log(error);
    }
  }

  async function unbookUser(booking) {
    try {
      const newBookedCapacity = selectedClass.bookedCapacity - 1;

      // 1. Delete booking
      const res1 = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id }),
      });
      if (!res1.ok) {
        throw new Error(`Unable to delete booking ${booking.id}`);
      }

      // 2. Update class bookedCapacity
      const updatedClass = {
        id: selectedClass.id,
        name: selectedClass.name,
        description: selectedClass.description,
        date: selectedClass.date,
        maxCapacity: selectedClass.maxCapacity,
        bookedCapacity: newBookedCapacity,
        status: newBookedCapacity < selectedClass.maxCapacity ? "open" : "full",
      };
      const res2 = await fetch("/api/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      if (!res2.ok) {
        throw new Error(`Unable to update class ${selectedClass.id}`);
      }

      // 3. Update user's balance
      const newBalance = selectedBooking.user.balance + 1;
      const res3 = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBooking.userId,
          balance: newBalance,
        }),
      });
      if (!res3.ok) {
        throw new Error(
          `Unable to update user ${selectedBooking.userId}'s balance`
        );
      }

      // 4. Create new transaction
      const newTransaction = {
        userId: booking.userId,
        amount: 1,
        type: "refund",
        description: `Refunded '${selectedClass.name}'`,
      };
      const res4 = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res4.ok) {
        throw new Error("Unable to create transaction");
      }

      // Update bookings
      const updatedBookings = bookings.filter((originalBooking) => {
        return originalBooking.id != booking.id;
      });
      setBookings(updatedBookings);

      setToast({
        isSuccess: true,
        header: "Cancelled booking",
        message: `Successfully cancelled booking of ${selectedClass.name} for ${selectedBooking.user.name}.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to cancel booking",
        message: `Unable to cancel booking for ${selectedClass.name}. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  async function markPresent(booking) {
    try {
      const updatedBooking = { id: booking.id, attendance: "present" };
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });
      if (!res.ok) {
        throw new Error("Unable to update booking");
      }

      // Update bookings
      const updatedBookings = bookings.map((originalBooking) => {
        if (originalBooking.id == booking.id) {
          return { ...originalBooking, attendance: "present" };
        }
        return originalBooking;
      });
      setBookings(updatedBookings);

      setToast({
        isSuccess: true,
        header: "Marked present",
        message: `Successfully marked ${selectedBooking.user.name} as present in ${selectedClass.name}.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to mark present",
        message: `Unable to mark ${selectedBooking.user.name} as present in ${selectedClass.name}. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
        <div className="flex flex-row items-center gap-x-2.5">
          <button onClick={() => router.back()} className="cursor-pointer">
            <MdChevronLeft color="#1F4776" size={42} />
          </button>
          <PageTitle title={selectedClass.name} />
          <Chip classNames={chipClassNames[selectedClass.status]}>
            {chipTypes[selectedClass.status].message}
          </Chip>
        </div>

        <div className="h-full w-full flex flex-col gap-y-5 p-5 rounded-[20px] border border-a-black/10 bg-white">
          {isEdit ? (
            <ClassForm
              isCreate={false}
              selectedClass={selectedClass}
              toggleIsEdit={toggleIsEdit}
            />
          ) : (
            <ClassDetails
              selectedClass={selectedClass}
              toggleIsEdit={toggleIsEdit}
            />
          )}
        </div>
        <div className="md:h-full w-full flex flex-col p-5 rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between">
            <SectionTitle title="Participants" />
            <button
              onClick={onOpen}
              disabled={isEdit}
              className={clsx("h-[36px] rounded-[30px] px-[20px] text-sm", {
                "bg-a-navy text-white cursor-pointer": !isEdit,
                "bg-a-navy/20 text-white cursor-not-allowed": isEdit,
              })}
            >
              Add participant
            </button>
          </div>
          <div className="overflow-x-scroll">
          <Table removeWrapper classNames={tableClassNames}>
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Attendance</TableColumn>
              <TableColumn>Booking date</TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              {bookingItems.map((booking) => {
                return (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>{booking.user.email}</TableCell>
                    <TableCell>{booking.attendance}</TableCell>
                    <TableCell>
                      {format(booking.createdAt, "d/MM/y HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <button
                            className="cursor-pointer"
                            onClick={() => selectRow(booking)}
                          >
                            <MdMoreVert size={24} />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={(key) => handleDropdown(key)}>
                          <DropdownItem key="mark">Mark present</DropdownItem>
                          <DropdownItem key="unbook">Unbook user</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
          <div className="flex flex-row justify-center">
            <Pagination
              showControls
              isCompact
              color="primary"
              size="sm"
              loop={true}
              page={page}
              total={bookingPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onCloseModal}
        size="md"
        backdrop="opaque"
        classNames={modalClassNames}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {modalType == "view" ? (
                <>
                  <ModalHeader>
                    <p className="text-a-navy">Add participant</p>
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      label="Email"
                      value={email}
                      onValueChange={setEmail}
                      isInvalid={isInvalidEmail}
                      errorMessage="Please enter a valid email"
                      isRequired
                      variant="bordered"
                      size="sm"
                      classNames={inputClassNames}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <button
                      onClick={bookUser}
                      className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer"
                    >
                      Book user
                    </button>
                  </ModalFooter>
                </>
              ) : (
                <></>
              )}
              {modalType == "loading" ? (
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                    <Spinner color="primary" size="lg" />
                    <p className="text-a-black">Booking user...</p>
                  </div>
                </ModalBody>
              ) : (
                <></>
              )}
              {modalType == "result" ? (
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-2.5 p-5 md:p-10">
                    {result.isSuccess ? (
                      <MdCheckCircleOutline size={84} color={"#2A9E2F"} />
                    ) : (
                      <MdOutlineCancel size={84} color={"#9E2A2A"} />
                    )}
                    <SectionTitle title={result.header} />
                    <p className="text-a-black">{result.message}</p>
                  </div>
                </ModalBody>
              ) : (
                <></>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
      {showToast ? (
        <div onClick={toggleShowToast}>
          <Toast
            isSuccess={toast.isSuccess}
            header={toast.header}
            message={toast.message}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

AdminClassViewPage.propTypes = {
  classId: PropTypes.number,
};
