"use client";

import { PageTitle } from "../utils/Titles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input, Pagination, Tab, Tabs } from "@heroui/react";
import { inputClassNames, tableClassNames, tabsClassNames } from "../utils/ClassNames";
import { MdAvTimer, MdCheckCircleOutline, MdOpenInNew } from "react-icons/md";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { format } from "date-fns";
import { useDisclosure } from "@heroui/modal";
import BookingModal from "../modals/BookingModal";
import WaitlistModal from "../modals/WaitlistModal";
// import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/dropdown";
import Toast from "../Toast";

export default function ReservationsPage({ session }) {
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
  // const [bookingFilters, setBookingFilters] = useState(new Set("upcoming"));

  const [selectedBooking, setSelectedBooking] = useState({});
  const [selectedWaitlist, setSelectedWaitlist] = useState({});
  const [selectedClass, setSelectedClass] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${ session.userId }`);
        if (!res.ok) {
          throw new Error(
            `Unable to get booked classes for user ${ session.userId }: ${ res.status }`
          );
        }
        const bookings = await res.json();
        setBookings(bookings);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get bookings",
          message: `Unable to get bookings for user ${ session.userId }. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchBookings();

    const fetchWaitlists = async () => {
      try {
        const res = await fetch(`/api/waitlists?userId=${ session.userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get waitlisted classes for user ${ session.userId } : ${ res.status }`);
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
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

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
      if (sortDescriptor.column == "bookingDate") {
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
    const bookingsSearch = sortedBookings
      .filter((booking) => {
        const className = booking.class.name.toLowerCase();
        const searchName = bookingQuery.trim().toLowerCase();
        return className.includes(searchName);
      })
    // TODO: Fix filtering for upcoming and past bookings
    // .filter((booking) => {
    //   if (bookingFilters.has("upcoming")) {
    //     const bookedClass = booking.class;
    //     const utcClassDate = fromZonedTime(bookedClass.date, "Asia/Singapore");
    //     const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
    //     const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    //     return sgClassDate > sgCurrentDate;
    //   }
    //   return true;
    // })
    // .filter((booking) => {
    //   if (bookingFilters.has("closed")) {
    //     const bookedClass = booking.class;
    //     const utcClassDate = fromZonedTime(bookedClass.date, "Asia/Singapore");
    //     const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
    //     const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    //     return sgClassDate <= sgCurrentDate;
    //   }
    //   return true;
    // });
    return Math.ceil(bookingsSearch.length / rowsPerPage);
  }, [sortedBookings, bookingQuery]);
  const bookingItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const bookingsSearch = sortedBookings
      .filter((booking) => {
        const className = booking.class.name.toLowerCase();
        const searchName = bookingQuery.trim().toLowerCase();
        return className.includes(searchName);
      })
    // .filter((booking) => {
    //   if (bookingFilters.has("upcoming")) {
    //     const bookedClass = booking.class;
    //     const utcClassDate = fromZonedTime(bookedClass.date, "Asia/Singapore");
    //     const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
    //     const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    //     return sgClassDate > sgCurrentDate;
    //   }
    //   return true;
    // })
    // .filter((booking) => {
    //   if (bookingFilters.has("closed")) {
    //     const bookedClass = booking.class;
    //     const utcClassDate = fromZonedTime(bookedClass.date, "Asia/Singapore");
    //     const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
    //     const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    //     return sgClassDate <= sgCurrentDate;
    //   }
    //   return true;
    // });
    return bookingsSearch.slice(start, end);
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
    const waitlistsSearch = sortedWaitlists
      .filter((waitlist) => {
        const className = waitlist.class.name.toLowerCase();
        const searchName = waitlistQuery.trim().toLowerCase();
        return className.includes(searchName);
      });
    return Math.ceil(waitlistsSearch.length / rowsPerPage);
  }, [sortedWaitlists, waitlistQuery]);
  const waitlistItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const waitlistsSearch = sortedWaitlists
      .filter((waitlist) => {
        const className = waitlist.class.name.toLowerCase();
        const searchName = waitlistQuery.trim().toLowerCase();
        return className.includes(searchName);
      });
    return waitlistsSearch.slice(start, end);
  }, [page, sortedWaitlists, waitlistQuery]);

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
                <div className="flex flex-row justify-end items-center gap-x-2.5">
                  {/*<Dropdown>*/ }
                  {/*  <DropdownTrigger>*/ }
                  {/*    <button className="cursor-pointer text-lg">*/ }
                  {/*      <MdOutlineFilterAlt color="#393E46"/>*/ }
                  {/*    </button>*/ }
                  {/*  </DropdownTrigger>*/ }
                  {/*  <DropdownMenu*/ }
                  {/*    aria-label="Filter bookings"*/ }
                  {/*    variant="flat"*/ }
                  {/*    closeOnSelect={ false }*/ }
                  {/*    selectionMode="multiple"*/ }
                  {/*    selectedKeys={ bookingFilters }*/ }
                  {/*    onSelectionChange={ setBookingFilters }*/ }
                  {/*  >*/ }
                  {/*    <DropdownSection title="Filter bookings">*/ }
                  {/*      <DropdownItem key="upcoming">Upcoming bookings</DropdownItem>*/ }
                  {/*      <DropdownItem key="closed">Past bookings</DropdownItem>*/ }
                  {/*    </DropdownSection>*/ }
                  {/*  </DropdownMenu>*/ }
                  {/*</Dropdown>*/ }
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
                </div>
                <div className="overflow-x-scroll">
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
                    { bookingPages > 1 && (
                      <Pagination
                        showControls
                        isCompact
                        color="primary"
                        size="sm"
                        loop={ true }
                        page={ page }
                        total={ bookingPages }
                        onChange={ (page) => setPage(page) }
                      />) }
                  </div>
                </div>
                <BookingModal
                  selectedBooking={ selectedBooking }
                  selectedClass={ selectedClass }
                  userId={ session.userId }
                  isOpen={ bookingModal.isOpen }
                  onOpen={ bookingModal.onOpen }
                  onOpenChange={ bookingModal.onOpenChange }
                />
              </div>
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
              <WaitlistModal
                selectedWaitlist={ selectedWaitlist }
                selectedClass={ selectedClass }
                userId={ session.userId }
                isOpen={ waitlistModal.isOpen }
                onOpen={ waitlistModal.onOpen }
                onOpenChange={ waitlistModal.onOpenChange }
              />
            </Tab>
          </Tabs>
        </div>
      </div>
      { showToast && (
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div>) }
    </>
  );
}
