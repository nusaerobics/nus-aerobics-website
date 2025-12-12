import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import { Pagination } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { MdChevronLeft, MdMoreVert } from "react-icons/md";
import { PageTitle, SectionTitle } from "../utils/Titles";
import { inputClassNames, tableClassNames } from "../utils/ClassNames";
import Toast from "../Toast";

export default function UsersViewPage({ userId }) {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [creditsSpent, setCreditsSpent] = useState(0);

  const [selectedBooking, setSelectedBooking] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  const [bookingPage, setBookingPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);

  useEffect(() => {
    // getUser
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${ userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get user ${ userId }: ${ res.status }`);
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get user",
          message: `Unable to get user ${ userId } Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchUser();

    // getBookingsByUser
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(
            `Unable to get bookings for user ${ userId }: ${ res.status }`
          );
        }
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get bookings",
          message: `Unable to get bookings for user ${ userId }. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchBookings();

    // getTransactionsByUser
    const fetchTransactions = async () => {
      const res = await fetch(`/api/transactions?userId=${ userId }`);
      if (!res.ok) {
        throw new Error(
          `Unable to get transactions for user ${ userId }: ${ res.status }`
        );
      }
      const data = await res.json();
      setTransactions(data);
    };
    fetchTransactions();

    // getCreditsSpent
    const countCreditsSpent = async () => {
      try {
        const res = await fetch(
          `/api/transactions?isCreditsSpent=${ userId }`
        );
        if (!res.ok) {
          throw new Error(
            `Unable to count credits spent for user ${ userId }.`
          );
        }
        const data = await res.json();
        setCreditsSpent(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to count credits spent",
          message: `Unable to count credits spent for user ${ userId }. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    countCreditsSpent();
  }, []);

  const rowsPerPage = 10;
  const bookingPages = Math.ceil(bookings.length / rowsPerPage);
  const bookingItems = useMemo(() => {
    const start = (bookingPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return bookings.slice(start, end);
  }, [bookingPage, bookings]);

  const transactionPages = Math.ceil(transactions.length / rowsPerPage);
  const transactionItems = useMemo(() => {
    const start = (transactionPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return transactions.slice(start, end);
  }, [transactionPage, transactions]);

  const transactionTypes = {
    "book": "Booking",
    "refund": "Refund",
    "deposit": "Deposit"
  };

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

  const selectRow = async (rowData) => {
    setSelectedBooking(rowData);
  };
  const handleDropdown = async (key) => {
    if (key == "unbook") {
      try {
        const res = await fetch("/api/bookings", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: selectedBooking.id, classId: selectedBooking.class.id, userId: userId }),
        });
        if (!res.ok) {
          throw new Error(`Unable to delete booking ${ selectedBooking.id }`);
        }

        // update bookings list
        const updatedBookings = bookings.filter((originalBooking) => {
          return originalBooking.id != selectedBooking.id;
        });
        setBookings(updatedBookings);

        setToast({
          isSuccess: true,
          header: "Unbooked user",
          message: `Successfully unbooked ${ user.name } from ${ selectedBooking.class.name }.`,
        });
        setShowToast(true);
      } catch (error) {
        console.log(error);
        setToast({
          isSuccess: false,
          header: "Unable to unbook user",
          message: `Unable to unbook ${ user.name } from ${ selectedBooking.class.name }. Try again later.`,
        });
        setShowToast(true);
      }
    }
  };

  // TODO: Add in showing the balance + credits spent as in the user's Wallet Page
  return (
    <>
      <div className="h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
        <div className="flex flex-row items-center gap-x-5">
          <button onClick={ () => router.back() } className="cursor-pointer">
            <MdChevronLeft color="#1F4776" size={ 42 }/>
          </button>
          <PageTitle title="View user"/>
        </div>
        <div className="flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between">
            <SectionTitle title="User details"/>
          </div>
          <div className="flex flex-col md:flex-row gap-y-5 md:gap-x-5">
            <div className="flex flex-col gap-y-2.5 w-[265px]">
              <p className="text-a-black/50 text-sm">Full name</p>
              <Input
                value={ user.name }
                isDisabled
                variant="bordered"
                size="xs"
                classNames={ inputClassNames }
              />
            </div>
            <div className="flex flex-col gap-y-2.5 w-[265px]">
              <p className="text-a-black/50 text-sm">Email</p>
              <Input
                value={ user.email }
                isDisabled
                variant="bordered"
                size="xs"
                classNames={ inputClassNames }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-x-5">
          <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
            <p className="font-poppins font-bold text-lg md:text-xl text-a-navy">
              { user.balance }
            </p>
            <p className="font-poppins text-a-black text-sm md:text-lg">
              credits remaining
            </p>
          </div>
          <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
            <p className="font-poppins font-bold text-lg md:text-xl text-a-navy">
              { creditsSpent }
            </p>
            <p className="font-poppins text-a-black text-sm md:text-lg">
              credits spent
            </p>
          </div>
        </div>
        <div className="flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <SectionTitle title="Bookings"/>
          <div className="overflow-x-scroll">
            <Table removeWrapper classNames={ tableClassNames }>
              <TableHeader>
                <TableColumn>Class</TableColumn>
                <TableColumn>Attendance</TableColumn>
                <TableColumn>Class date</TableColumn>
                <TableColumn>Booking date</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody>
                { bookingItems.map((booking) => {
                  return (
                    <TableRow key={ booking.id }>
                      <TableCell>{ booking.class.name }</TableCell>
                      <TableCell>{ booking.attendance }</TableCell>
                      <TableCell>
                        { format(booking.class.date, "d/MM/y HH:mm (EEE)") }
                      </TableCell>
                      <TableCell>
                        { format(booking.createdAt, "d/MM/y HH:mm") }
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <button
                              className="cursor-pointer"
                              onClick={ () => selectRow(booking) }
                            >
                              <MdMoreVert size={ 24 }/>
                            </button>
                          </DropdownTrigger>
                          <DropdownMenu onAction={ (key) => handleDropdown(key) }>
                            <DropdownItem key="unbook">
                              Unbook user
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  );
                }) }
                ;
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row justify-center">
            { bookingPages > 1 && (
              <Pagination
                showControls
                isCompact
                color="primary"
                size="sm"
                loop={ true }
                page={ bookingPage }
                total={ bookingPages }
                onChange={ (page) => setBookingPage(page) }
              />) }
          </div>
        </div>
        <div className="flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <SectionTitle title="Transactions"/>
          <div className="overflow-x-scroll">
            <Table
              removeWrapper
              classNames={ tableClassNames }
              // sortDescriptor={ sortDescriptor }
              // onSortChange={ setSortDescriptor }
            >
              <TableHeader>
                <TableColumn key="createdAt">
                  Date
                </TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Description</TableColumn>
              </TableHeader>
              <TableBody>
                { transactionItems.map((transaction) => {
                  return (
                    <TableRow key={ transaction.id }>
                      <TableCell>
                        { format(transaction.createdAt, "d/MM/y HH:mm") }
                      </TableCell>
                      <TableCell>{ transaction.amount }</TableCell>
                      <TableCell>{ transactionTypes[transaction.type] }</TableCell>
                      <TableCell>{ transaction.description }</TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row justify-center">
            { transactionPages > 1 && (
              <Pagination
                showControls
                isCompact
                color="primary"
                size="sm"
                loop={ true }
                page={ transactionPage }
                total={ transactionPages }
                onChange={ (page) => setTransactionPage(page) }
              />) }
          </div>
        </div>
      </div>
      { showToast ? (
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div>
      ) : (
        <></>
      ) }
    </>
  );
}

UsersViewPage.propTypes = {
  userId: PropTypes.number,
};
