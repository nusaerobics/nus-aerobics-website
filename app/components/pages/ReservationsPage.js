"use client";

import { PageTitle } from "../utils/Titles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input, Pagination, Tab, Tabs } from "@nextui-org/react";
import { inputClassNames, tableClassNames, tabsClassNames } from "../utils/ClassNames";
import { MdAvTimer, MdCheckCircleOutline, MdOpenInNew, MdOutlineFilterAlt } from "react-icons/md";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { format } from "date-fns";
import { useDisclosure } from "@nextui-org/modal";
import BookingModal from "../classes/modals/BookingModal";

export default function ReservationsPage({ userId }) {
  const bookingModal = useDisclosure();
  const waitlistModal = useDisclosure();

  const [tab, setTab] = useState("schedule");
  const [bookings, setBookings] = useState([]);
  const [waitlists, setWaitlists] = useState([]);

  const [bookingQuery, setBookingQuery] = useState("");
  const [waitlistQuery, setWaitlistQuery] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState(
    {
      column: "classDate",
      direction: "ascending",
    }
  );
  const [filters, setFilters] = useState(new Set(["open"]));  // TODO: modify filters as needed

  const [selectedBooking, setSelectedBooking] = useState({});
  const [selectedWaitlist, setSelectedWaitlist] = useState({});
  const [selectedClass, setSelectedClass] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(
            `Unable to get booked classes for user ${ userId }: ${ res.status }`
          );
        }
        const bookings = await res.json();
        setBookings(bookings);
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

    const fetchWaitlists = async () => {
      try {
        const res = await fetch(`/api/waitlists?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get waitlisted classes for user ${ userId } : ${ res.status }`);
        }
        const waitlists = await res.json();
        setWaitlists(waitlists);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get waitlisted classes",
          message: `Unable to get waitlisted classes. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchWaitlists();
  }, [bookingModal.isOpen, waitlistModal.isOpen]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const onBookingQueryChange = useCallback((value) => {
    setBookingQuery(value);
    setPage(1);
  });
  const onWaitlistQueryChange = useCallback((value) => {
    setWaitlistQuery(value);
    setPage(1);
  });

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      let first, second;
      if (sortDescriptor.column === "bookingDate") {
        first = a["createdAt"];
        second = b["createdAt"];
      } else if (sortDescriptor.column === "classDate") {
        first = a.class["date"];
        second = b.class["date"];
      }
      const compare = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -compare : compare;
    });
  }, [sortDescriptor, bookings]);
  const bookingPages = useMemo(() => {
    if (bookingQuery !== "") {
      const bookingsSearch = sortedBookings
        .filter((booking) => {
          const className = booking.class.name.toLowerCase();
          const searchName = bookingQuery.toLowerCase();
          return className.includes(searchName);
        });
      return Math.ceil(bookingsSearch.length / rowsPerPage);
    }
    return Math.ceil(sortedBookings.length / rowsPerPage);
  }, [sortedBookings, bookingQuery]);
  const bookingItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (bookingQuery !== "") {
      const bookingsSearch = sortedBookings.filter((booking) => {
        const className = booking.class.name.toLowerCase();
        const searchName = bookingQuery.toLowerCase();
        return className.includes(searchName);
      });
      return bookingsSearch.slice(start, end);
    }
    return sortedBookings.slice(start, end);
  }, [page, sortedBookings, bookingQuery]);

  const sortedWaitlists = useMemo(() => {
    return [...waitlists].sort((a, b) => {
      let first, second;
      if (sortDescriptor.column === "waitlistDate") {
        first = a["createdAt"];
        second = b["createdAt"];
      } else if (sortDescriptor.column === "classDate") {
        first = a.class["date"];
        second = b.class["date"];
      }
      const compare = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -compare : compare;
    });
  }, [sortDescriptor, waitlists]);
  const waitlistPages = useMemo(() => {
    if (waitlistQuery !== "") {
      const waitlistsSearch = sortedWaitlists
        .filter((waitlist) => {
          const className = waitlist.class.name.toLowerCase();
          const searchName = waitlistQuery.toLowerCase();
          return className.includes(searchName);
        });
      return Math.ceil(waitlistsSearch.length / rowsPerPage);
    }
    return Math.ceil(sortedWaitlists.length / rowsPerPage);
  }, [sortedWaitlists, waitlistQuery]);
  const waitlistItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (waitlistQuery !== "") {
      const waitlistsSearch = sortedWaitlists
        .filter((waitlist) => {
          const className = waitlist.class.name.toLowerCase();
          const searchName = bookingQuery.toLowerCase();
          return className.includes(searchName);
        });
      return waitlistsSearch.slice(start, end);
    }
    return sortedWaitlists.slice(start, end);
  }, [page, sortedWaitlists, waitlistQuery]);

  // TODO: add in sorted, pages, and items for waitlist

  function handleBookingSelect(rowData) {
    setSelectedBooking(rowData);
    setSelectedClass(rowData.class);
    bookingModal.onOpen();
  }

  function handleWaitlistSelect(rowData) {
    setSelectedWaitlist(rowData);
    setSelectedClass(rowData.class);
    waitlistModal.onOpen();
  }

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
        <PageTitle title="Reservations"/>
        <div className="w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
          <Tabs
            variant={ "underlined" }
            selectedKey={ tab }
            onSelectionChange={ setTab }
            classNames={ tabsClassNames }
            fullWidth
          >
            <Tab
              key="bookings"
              title={
                <div className="flex flex-row items-center gap-x-2">
                  <MdCheckCircleOutline/>
                  <p className="text-sm md:text-base">Booked classes</p>
                </div>
              }
            >
              <div className="md:h-full md:w-full flex flex-col p-2.5 gap-y-5">
                <div className="self-end md:w-1/4">
                  <Input
                    placeholder="Search"
                    value={ bookingQuery }
                    onValueChange={ onBookingQueryChange }
                    variant="bordered"
                    size="xs"
                    classNames={ inputClassNames }
                  />
                </div>
                <Table
                  removeWrapper
                  classNames={ tableClassNames }
                  sortDescriptor={ sortDescriptor }
                  onSortChange={ setSortDescriptor }
                >
                  <TableHeader>
                    <TableColumn>Class</TableColumn>
                    <TableColumn></TableColumn>
                    <TableColumn key="classDate" allowsSorting>
                      Class date
                    </TableColumn>
                    <TableColumn key="bookingDate" allowsSorting>
                      Booking date
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    { bookingItems.map((booking) => {
                      return (
                        <TableRow key={ booking.id }>
                          <TableCell>{ booking.class.name }</TableCell>
                          <TableCell>
                            <button
                              className="cursor-pointer text-base md:text-lg"
                              onClick={ () => handleBookingSelect(booking) }
                            >
                              <MdOpenInNew color="#393E46"/>
                            </button>
                          </TableCell>
                          <TableCell>
                            { format(booking.class.date, "d/MM/y HH:mm (EEE)") }
                          </TableCell>
                          <TableCell>
                            { format(booking.createdAt, "d/MM/y HH:mm") }
                          </TableCell>
                        </TableRow>
                      );
                    }) }
                  </TableBody>
                </Table>
                <div className="flex flex-row justify-center">
                  <Pagination
                    showControls
                    isCompact
                    color="primary"
                    size="sm"
                    loop={ true }
                    page={ page }
                    total={ bookingPages }
                    onChange={ (page) => setPage(page) }
                  />
                </div>
              </div>
              <BookingModal
                selectedBooking={ selectedBooking }
                selectedClass={ selectedClass }
                userId={ userId }
                isOpen={ bookingModal.isOpen }
                onOpen={ bookingModal.onOpen }
                onOpenChange={ bookingModal.onOpenChange }
              />
            </Tab>
            <Tab
              key="waitlists"
              title={
                <div className="flex flex-row items-center gap-x-2">
                  <MdAvTimer/>
                  <p className="text-sm md:text-base">Waitlisted classes</p>
                </div>
              }
            >
              <div className="md:h-full md:w-full flex flex-col p-2.5 gap-y-5">
                <div className="self-end md:w-1/4">
                  <Input
                    placeholder="Search"
                    value={ waitlistQuery }
                    onValueChange={ onWaitlistQueryChange }
                    variant="bordered"
                    size="xs"
                    classNames={ inputClassNames }
                  />
                </div>
                <Table
                  removeWrapper
                  classNames={ tableClassNames }
                  sortDescriptor={ sortDescriptor }
                  onSortChange={ setSortDescriptor }
                >
                  <TableHeader>
                    <TableColumn>Class</TableColumn>
                    <TableColumn></TableColumn>
                    <TableColumn key="classDate" allowsSorting>
                      Class date
                    </TableColumn>
                    <TableColumn key="bookingDate" allowsSorting>
                      Waitlist date
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    { waitlistItems.map((waitlist) => {
                      return (
                        <TableRow key={ waitlist.id }>
                          <TableCell>{ waitlist.class.name }</TableCell>
                          <TableCell>
                            <button
                              className="cursor-pointer text-base md:text-lg"
                              onClick={ () => handleWaitlistSelect(waitlist) }
                            >
                              <MdOpenInNew color="#393E46"/>
                            </button>
                          </TableCell>
                          <TableCell>
                            { format(waitlist.class.date, "d/MM/y HH:mm (EEE)") }
                          </TableCell>
                          <TableCell>
                            { format(waitlist.createdAt, "d/MM/y HH:mm") }
                          </TableCell>
                        </TableRow>
                      );
                    }) }
                  </TableBody>
                </Table>
                <div className="flex flex-row justify-center">
                  <Pagination
                    showControls
                    isCompact
                    color="primary"
                    size="sm"
                    loop={ true }
                    page={ page }
                    total={ waitlistPages }
                    onChange={ (page) => setPage(page) }
                  />
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}
