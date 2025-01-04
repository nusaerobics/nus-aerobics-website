"use client";

import { format } from "date-fns";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdList, MdOpenInNew, MdOutlineFilterAlt } from "react-icons/md";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useDisclosure } from "@nextui-org/modal";
import { Chip, Input, Tabs, Tab, Pagination } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
  tabsClassNames,
} from "../utils/ClassNames";
import { PageTitle } from "../utils/Titles";
import ScheduleModal from "../classes/modals/ScheduleModal";
import Toast from "../Toast";
import BookedModal from "../classes/modals/BookedModal";

export default function UserClassLandingPage({ userId }) {
  const scheduleModal = useDisclosure();
  const bookedModal = useDisclosure();

  const [tab, setTab] = useState("schedule");
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedBooking, setSelectedBooking] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});
  const toggleShowToast = () => {
    setShowToast(!showToast);
  };
  const [classQuery, setClassQuery] = useState("");
  const [bookingQ, setBookingQ] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState(
    tab == "schedule"
      ? {
        column: "date",
        direction: "ascending",
      }
      : { column: "bookingDate", direction: "ascending" }
  );
  const [filters, setFilters] = useState(new Set(["open"]));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(
            `Unable to get bookings for user ${ userId }: ${ res.status }`
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
    const fetchClasses = async () => {
      try {
        const res = await fetch(`/api/classes?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get classes: ${ res.status }`);
        }
        const classes = await res.json();
        setClasses(classes);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get classes",
          message: `Unable to get classes. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchClasses();
  }, [bookedModal.isOpen, scheduleModal.isOpen]);
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  function handleScheduleSelect(rowData) {
    setSelectedClass(rowData);
    scheduleModal.onOpen();
  }

  function handleBookedSelect(rowData) {
    setSelectedBooking(rowData);
    setSelectedClass(rowData.class);
    bookedModal.onOpen();
  }

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const onClassQueryChange = useCallback((value) => {
    setClassQuery(value);
    setPage(1);
  });
  const onBookingQChange = useCallback((value) => {
    setBookingQ(value);
    setPage(1);
  });

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const compare = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction == "descending" ? -compare : compare;
    });
  }, [sortDescriptor, classes]);
  const classPages = useMemo(() => {
    const filteredClasses = sortedClasses
      .filter((c) => {
        const className = c.name.toLowerCase();
        const searchName = classQuery.toLowerCase();
        return className.includes(searchName);
      })
      .filter((c) => {
        if (filters.has("open")) {
          const isFull = c.bookedCapacity == c.maxCapacity;
          const classStatus = c.status.toLowerCase();
          return !isFull && classStatus == "open";
        }
        return true;
      })
    return Math.ceil(filteredClasses.length / rowsPerPage);
  }, [sortedClasses, classQuery, filters]);
  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const filteredClasses = sortedClasses
      .filter((c) => {
        const className = c.name.toLowerCase();
        const searchName = classQuery.toLowerCase();
        return className.includes(searchName);
      })
      .filter((c) => {
        if (filters.has("open")) {
          const isFull = c.bookedCapacity == c.maxCapacity;
          const classStatus = c.status.toLowerCase();
          return !isFull && classStatus == "open";
        }
        return true;
      })
    return filteredClasses.slice(start, end);
  }, [page, sortedClasses, classQuery, filters]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      let first;
      let second;
      if (sortDescriptor.column == "bookingDate") {
        first = a["createdAt"];
        second = b["createdAt"];
      } else if (sortDescriptor.column == "classDate") {
        first = a.class["date"];
        second = b.class["date"];
      }
      const compare = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction == "descending" ? -compare : compare;
    });
  }, [sortDescriptor, bookings]);
  const bookingPages = useMemo(() => {
    if (bookingQ != "") {
      const bookingsSearch = sortedBookings.filter((booking) => {
        const bookingName = booking.class.name.toLowerCase();
        const searchName = bookingQ.toLowerCase();
        return bookingName.includes(searchName);
      });
      return Math.ceil(bookingsSearch.length / rowsPerPage);
    }
    return Math.ceil(sortedBookings.length / rowsPerPage);
  }, [sortedBookings, bookingQ]);
  const bookingItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (bookingQ != "") {
      const bookingsSearch = sortedBookings.filter((booking) => {
        const bookingName = booking.class.name.toLowerCase();
        const searchName = bookingQ.toLowerCase();
        return bookingName.includes(searchName);
      });
      return bookingsSearch.slice(start, end);
    }
    return sortedBookings.slice(start, end);
  }, [page, sortedBookings, bookingQ]);

  const handleTabChange = () => {
    if (tab == "schedule") {
      setTab("booked");
      setPage(1);
    } else {
      setTab("schedule");
      setPage(1);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
        <PageTitle title="Classes"/>
        <div className="w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
          <Tabs
            variant={ "underlined" }
            selectedKey={ tab }
            onSelectionChange={ handleTabChange }
            classNames={ tabsClassNames }
            fullWidth
          >
            <Tab
              key="schedule"
              title={
                <div className="flex flex-row items-center gap-x-2">
                  <MdList/>
                  <p className="text-sm md:text-base">Class schedule</p>
                </div>
              }
            >
              <div className="md:h-full md:w-full flex flex-col p-2.5 gap-y-5">
                <div className="flex flex-row justify-end items-center gap-x-2.5">
                  <Dropdown>
                    <DropdownTrigger>
                      <button className="cursor-pointer text-lg">
                        <MdOutlineFilterAlt color="#393E46"/>
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Filter classes"
                      variant="flat"
                      closeOnSelect={ false }
                      selectionMode="multiple"
                      selectedKeys={ filters }
                      onSelectionChange={ setFilters }
                    >
                      <DropdownSection title="Filter classes">
                        <DropdownItem key="open">Open for booking</DropdownItem>
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>
                  <div className="self-end md:w-1/4">
                    <Input
                      placeholder="Search"
                      value={ classQuery }
                      onValueChange={ onClassQueryChange }
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
                      <TableColumn>Status</TableColumn>
                      <TableColumn key="date" allowsSorting>
                        Date
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      { classItems.map((c) => {
                        return (
                          <TableRow key={ c.id }>
                            <TableCell>{ c.name }</TableCell>
                            <TableCell>
                              <button
                                className="cursor-pointer text-base md:text-lg"
                                onClick={ () => handleScheduleSelect(c) }
                              >
                                <MdOpenInNew color="#393E46"/>
                              </button>
                            </TableCell>
                            <TableCell>
                              <Chip classNames={ chipClassNames[c.status] }>
                                { chipTypes[c.status].message }
                              </Chip>
                            </TableCell>
                            <TableCell>
                              { format(c.date, "d/MM/y HH:mm (EEE)") }
                            </TableCell>
                          </TableRow>
                        );
                      }) }
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-row justify-center">
                  <Pagination
                    showControls
                    isCompact
                    color="primary"
                    size="sm"
                    loop={ true }
                    page={ page }
                    total={ classPages }
                    onChange={ (page) => setPage(page) }
                  />
                </div>
              </div>
              <ScheduleModal
                selectedClass={ selectedClass }
                userId={ userId }
                isOpen={ scheduleModal.isOpen }
                onOpen={ scheduleModal.onOpen }
                onOpenChange={ scheduleModal.onOpenChange }
              />
            </Tab>
            <Tab
              key="booked"
              title={
                <div className="flex flex-row items-center gap-x-2">
                  <MdList/>
                  <p className="text-sm md:text-base">Booked classes</p>
                </div>
              }
            >
              <div className="md:h-full md:w-full flex flex-col p-2.5 gap-y-5 overflow-x-scroll">
                <div className="self-end md:w-1/4">
                  <Input
                    placeholder="Search"
                    value={ bookingQ }
                    onValueChange={ onBookingQChange }
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
                    <TableColumn>Status</TableColumn>
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
                              onClick={ () => handleBookedSelect(booking) }
                            >
                              <MdOpenInNew color="#393E46"/>
                            </button>
                          </TableCell>
                          <TableCell>
                            <Chip classNames={ chipClassNames["booked"] }>
                              { chipTypes["booked"].message }
                            </Chip>
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
              <BookedModal

                selectedBooking={ selectedBooking }
                selectedClass={ selectedClass }
                userId={ userId }
                isOpen={ bookedModal.isOpen }
                onOpen={ bookedModal.onOpen }
                onOpenChange={ bookedModal.onOpenChange }
              />
            </Tab>
          </Tabs>
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

UserClassLandingPage.propTypes = {
  userId: PropTypes.number,
  classes: PropTypes.array,
  bookings: PropTypes.array,
};
