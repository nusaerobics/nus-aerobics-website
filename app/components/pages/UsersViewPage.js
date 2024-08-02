import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { MdChevronLeft, MdMoreVert } from "react-icons/md";
import { PageTitle, SectionTitle } from "../utils/Titles";
import { inputClassNames, tableClassNames } from "../utils/ClassNames";
import Toast from "../Toast";

export default function UsersViewPage({ userId }) {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [balance, setBalance] = useState();
  const [permission, setPermission] = useState(new Set([]));

  useEffect(() => {
    // getUser
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?id=${userId}`);
        if (!res.ok) {
          throw new Error(`Unable to get user ${userId}: ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();

    // getBookingsByUser
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${userId}`);
        if (!res.ok) {
          throw new Error(
            `Unable to get bookings for user ${userId}: ${res.status}`
          );
        }
        const data = await res.json();
        setBookings(data);
      } catch (error) {
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

  const permissions = [
    { key: "admin", label: "Admin" },
    { key: "normal", label: "Normal" },
  ];

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };
  const selectRow = async (rowData) => {
    setSelectedBooking(rowData);
  };
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleDropdown = async (key) => {
    if (key == "unbook") {
      // TODO: Handle restores after an error occurs
      try {
        const newBookedCapacity = selectedBooking.class.bookedCapacity - 1;

        // 1. Delete booking
        const res1 = await fetch("/api/bookings", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedBooking.id }),
        });
        if (!res1.ok) {
          throw new Error(`Unable to delete booking ${selectedBooking.id}`);
        }

        // 2. Update class bookedCapacity
        const updatedClass = {
          id: selectedBooking.class.id,
          name: selectedBooking.class.name,
          description: selectedBooking.class.description,
          date: selectedBooking.class.date,
          maxCapacity: selectedBooking.class.maxCapacity,
          bookedCapacity: newBookedCapacity,
          status:
            newBookedCapacity < selectedBooking.class.maxCapacity
              ? "open"
              : "full", // NOTE: Don't know when unbooking a class would make it still full?
        };
        const res2 = await fetch("/api/classes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedClass),
        });
        if (!res2.ok) {
          throw new Error(`Unable to update class ${selectedBooking.class.id}`);
        }

        // 3. Update user's balance
        const newBalance = user.balance + 1;
        const res3 = await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, balance: newBalance }),
        });
        if (!res3.ok) {
          throw new Error(`Unable to update user ${userId}'s balance`);
        }

        // 4. Create new transaction
        const newTransaction = {
          userId: selectedBooking.userId,
          amount: 1,
          type: "refund",
          description: `Refunded '${selectedBooking.class.name}'`,
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
          return originalBooking.id != selectedBooking.id;
        });
        setBookings(updatedBookings);
        console.log(selectedBooking);
        console.log(updatedBookings);

        setToast({
          isSuccess: true,
          header: "Unbooked user",
          message: `Successfully unbooked ${user.name} from ${selectedBooking.class.name}.`,
        });
        setShowToast(true);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to unbook user",
          message: `Unable to unbook ${user.name} from ${selectedBooking.class.name}. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    }
  };

  async function saveEdit() {
    try {
      // 1. Update user's account balance
      const updatedUser = { id: userId, balance: balance };
      const res1 = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res1.ok) {
        throw new Error(`Unable to update user ${userId}`);
      }

      // 2. Create new transaction of deposit
      const newTransaction = {
        userId: userId,
        amount: balance,
        type: "deposit",
        description: `Deposited ${balance} credit(s)`,
      };
      const res2 = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res2.ok) {
        throw new Error("Unable to create transaction");
      }
      toggleIsEdit();
      // TODO: Refresh users list in UsersPage
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
        <div className="flex flex-row items-center gap-x-5">
          <button onClick={() => router.back()} className="cursor-pointer">
            <MdChevronLeft color="#1F4776" size={42} />
          </button>
          <PageTitle title="View user" />
        </div>
        <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between">
            <SectionTitle title="User details" />
            <div className="flex flex-row gap-x-2.5">
              {isEdit ? (
                <button
                  onClick={toggleIsEdit}
                  className="h-[36px] rounded-[30px] px-[20px] bg-a-navy/10 text-a-navy text-sm cursor-pointer" // PREVIOUSLY: py-[10px]
                >
                  Cancel
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={isEdit ? saveEdit : toggleIsEdit}
                className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer" // PREVIOUSLY: py-[10px]
              >
                {isEdit ? "Save changes" : "Edit user"}
              </button>
            </div>
          </div>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-col gap-y-2.5 w-[265px]">
              <p className="text-a-black/50 text-sm">Full name</p>
              <Input
                value={user.name}
                isDisabled
                variant="bordered"
                size="xs"
                classNames={inputClassNames}
              />
            </div>
            <div className="flex flex-col gap-y-2.5 w-[265px]">
              <p className="text-a-black/50 text-sm">Email</p>
              <Input
                value={user.email}
                isDisabled
                variant="bordered"
                size="xs"
                classNames={inputClassNames}
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-col gap-y-2.5 w-[265px]">
              <p className="text-a-black/50 text-sm">Balance</p>
              <Input
                type="number"
                value={balance}
                onValueChange={setBalance}
                isDisabled={!isEdit}
                variant="bordered"
                size="xs"
                classNames={inputClassNames}
              />
            </div>
            {/* TODO: Fix the status handling */}
            <div className="flex flex-col gap-y-2.5 w-[265px]">
              <p className="text-a-black/50 text-sm">Status</p>
              <Select
                isDisabled={!isEdit}
                selectedKeys={permission}
                onSelectionChange={setPermission}
                defaultSelectedKeys={[user.permission]}
              >
                {permissions.map((permission) => {
                  <SelectItem key={permission.key}>
                    {permission.label}
                  </SelectItem>;
                })}
              </Select>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <SectionTitle title="Bookings" />
          <Table removeWrapper classNames={tableClassNames}>
            <TableHeader>
              <TableColumn>Class</TableColumn>
              <TableColumn>Attendance</TableColumn>
              <TableColumn>Class date</TableColumn>
              <TableColumn>Booking date</TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              {bookingItems.map((booking) => {
                return (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.class.name}</TableCell>
                    <TableCell>{booking.attendance}</TableCell>
                    <TableCell>
                      {format(booking.class.date, "d/MM/y HH:mm")}
                    </TableCell>
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
                          <DropdownItem key="unbook">Unbook user</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              })}
              ;
            </TableBody>
          </Table>
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

UsersViewPage.propTypes = {
  userId: PropTypes.number,
};
