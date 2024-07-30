import PropTypes from "prop-types";

import { Chip, Input } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

import { useMemo, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import clsx from "clsx";
import { format } from "date-fns";

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
import { z } from "zod";

export default function AdminClassViewPage({
  selectedClass,
  closeView,
  classBookings,
}) {
  const [title, setTitle] = useState(selectedClass.name);
  const [isEdit, setIsEdit] = useState(false);
  const [isManage, setIsManage] = useState(false);

  const toggleIsEdit = () => {
    setTitle("Edit class");
    setIsEdit(!isEdit);
  };
  const toggleIsManage = () => {
    setTitle("Manage class");
    setIsManage(!isManage);
  };
  const revert = () => {
    setTitle(selectedClass.name);
    setIsEdit(false);
    setIsManage(false);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isNoUser, setIsNoUser] = useState(false);
  const [email, setEmail] = useState("");
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
    try {
      console.log(email);
      // 1. Find user by email
      const res1 = await fetch(`/api/users?email=${email}`);
      if (!res1.ok) {
        setIsNoUser(false);
        throw new Error(`Unable to find user by ${email}: ${res1.status}`);
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
      onOpenChange();
    } catch (error) {
      setIsNoUser(false);
      console.log(error);
    }
  }

  // TODO: Add in a loading indicator
  // TODO: Refresh participants list after change
  async function unbookUser(rowData) {
    const classBooking = rowData;
    console.log(classBooking);
    try {
      console.log(selectedClass);
      const newBookedCapacity = selectedClass.bookedCapacity - 1;

      // 1. Delete booking
      const res1 = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: classBooking.id }),
      });
      if (!res1.ok) {
        throw new Error(`Unable to delete booking ${classBooking.id}`);
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

      // 3. Create new transaction
      const newTransaction = {
        userId: classBooking.userId,
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
    } catch (error) {
      console.log(error);
    }
  }

  async function markPresent(rowData) {
    try {
      const classBooking = rowData;
      console.log(classBooking);
      const updatedBooking = { id: classBooking.id, attendance: "present" };
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });
      if (!res.ok) {
        throw new Error("Unable to update booking");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-row items-center gap-x-2.5">
        {/* TODO: If isEdit or isManage, go back to Classes. Else, go to not isEdit and not isManage */}
        <button
          className="cursor-pointer"
          onClick={isEdit || isManage ? revert : closeView}
        >
          <MdChevronLeft color="#1F4776" size={42} />
        </button>
        <PageTitle title={title} />
        {!isEdit && !isManage ? (
          <Chip classNames={chipClassNames[selectedClass.status]}>
            {chipTypes[selectedClass.status].message}
          </Chip>
        ) : (
          <></>
        )}
      </div>

      {!isManage ? (
        <div className="h-full w-full flex flex-col gap-y-5 p-5 rounded-[20px] border border-a-black/10 bg-white">
          {isEdit ? (
            <ClassForm isCreate={false} selectedClass={selectedClass} />
          ) : (
            <ClassDetails
              selectedClass={selectedClass}
              toggleIsEdit={toggleIsEdit}
            />
          )}
        </div>
      ) : (
        <></>
      )}

      {!isEdit ? (
        <div className="h-full w-full flex flex-col p-5 rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between">
            <SectionTitle title="Participants" />
            {isManage ? (
              <button
                onClick={onOpen}
                className="h-[36px] rounded-[30px] px-[20px] bg-white border-1 border-a-navy text-a-navy text-sm cursor-pointer"
              >
                Add participant
              </button>
            ) : (
              <button
                onClick={toggleIsManage}
                className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer"
              >
                Manage class
              </button>
            )}
          </div>
          {isManage ? (
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Attendance</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody>
                {classBookings.map((classBooking) => {
                  return (
                    <TableRow key={classBooking.id}>
                      <TableCell>{classBooking.user.name}</TableCell>
                      <TableCell>{classBooking.user.email}</TableCell>
                      <TableCell>
                        {/* TODO: Change styling since it looks like the chip not a button */}
                        <button
                          onClick={() => markPresent(classBooking)}
                          disabled={classBooking.attendance == "present"}
                          className={clsx(
                            "rounded-[30px] px-[20px] py-[10px] text-sm cursor-pointer",
                            {
                              "bg-a-green/10 text-a-green":
                                classBooking.attendance == "absent",
                              "bg-a-black/10 text-a-black/50":
                                classBooking.attendance == "present",
                            }
                          )}
                        >
                          Mark present
                        </button>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => unbookUser(classBooking)}
                          className="rounded-[30px] px-[20px] py-[10px] bg-a-red text-white text-sm cursor-pointer"
                        >
                          Unbook
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Attendance</TableColumn>
                <TableColumn>Booking date</TableColumn>
              </TableHeader>
              <TableBody>
                {classBookings.map((classBooking) => {
                  return (
                    <TableRow key={classBooking.id}>
                      <TableCell>{classBooking.user.name}</TableCell>
                      <TableCell>{classBooking.user.email}</TableCell>
                      <TableCell>{classBooking.attendance}</TableCell>
                      <TableCell>
                        {format(classBooking.createdAt, "d/MM/y HH:mm")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        <></>
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        backdrop="opaque"
        classNames={modalClassNames}
      >
        <ModalContent>
          {(onClose) => (
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
                <p className="font-poppins text-a-red">
                  {isNoUser ? "No registered user" : ""}
                </p>
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
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

AdminClassViewPage.propTypes = {
  selectedClass: PropTypes.object,
  closeView: PropTypes.func,
  classBookings: PropTypes.array,
};
