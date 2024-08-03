"use client";

import { format } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { MdList, MdOpenInNew } from "react-icons/md";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useDisclosure } from "@nextui-org/modal";
import { Chip, Input, Tabs, Tab, Pagination } from "@nextui-org/react";

import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
  tabsClassNames,
} from "../utils/ClassNames";
import { PageTitle } from "../utils/Titles";
import ClassDetailsModal from "../classes/ClassDetailsModal";

export default function UserClassLandingPage({ userId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [tab, setTab] = useState("schedule");
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [classQ, setClassQ] = useState("");
  const [bookingQ, setBookingQ] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedBooking, setSelectedBooking] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        if (!res.ok) {
          throw new Error(`Unable to get classes: ${res.status}`);
        }
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        // TODO: Add toast notification
        console.log(error);
      }
    };
    fetchClasses();

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
        // TODO: Add toast notification
        console.log(error);
      }
    };
    fetchBookings();
  }, [isOpen]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const classPages = useMemo(() => {
    if (classQ != "") {
      const classesSearch = classes.filter((c) => {
        const className = c.name.toLowerCase();
        const searchName = classQ.toLowerCase();
        return className.includes(searchName);
      });
      return Math.ceil(classesSearch.length / rowsPerPage);
    }
    return Math.ceil(classes.length / rowsPerPage);
  }, [classes, classQ]);

  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (classQ != "") {
      const classesSearch = classes.filter((c) => {
        const className = c.name.toLowerCase();
        const searchName = classQ.toLowerCase();
        return className.includes(searchName);
      });
      return classesSearch.slice(start, end);
    }
    return classes.slice(start, end);
  }, [page, classes, classQ]);

  const bookingPages = useMemo(() => {
    if (bookingQ != "") {
      const bookingsSearch = bookings.filter((booking) => {
        const bookingName = booking.class.name.toLowerCase();
        const searchName = bookingQ.toLowerCase();
        return bookingName.includes(searchName);
      });
      return Math.ceil(bookingsSearch.length / rowsPerPage);
    }
    return Math.ceil(bookings.length / rowsPerPage);
  }, [bookings, bookingQ]);

  const bookingItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (bookingQ != "") {
      const bookingsSearch = bookings.filter((booking) => {
        const bookingName = booking.class.name.toLowerCase();
        const searchName = bookingQ.toLowerCase();
        return bookingName.includes(searchName);
      });
      return bookingsSearch.slice(start, end);
    }
    return bookings.slice(start, end);
  }, [page, bookings, bookingQ]);

  const handleTabChange = () => {
    if (tab == "schedule") {
      setTab("booked");
      setPage(1);
    } else {
      setTab("schedule");
      setPage(1);
    }
  };

  const selectRow = (rowData) => {
    if (tab == "schedule") {
      setSelectedClass(rowData);
    } else {
      setSelectedClass(rowData.class);
      setSelectedBooking(rowData);
    }
    onOpen();
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
      <PageTitle title="Classes" />
      <div className="w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        <Tabs
          variant={"underlined"}
          selectedKey={tab}
          onSelectionChange={handleTabChange}
          classNames={tabsClassNames}
        >
          <Tab
            key="schedule"
            title={
              <div className="flex flex-row items-center gap-x-2">
                <MdList />
                <p className="text-base">Class schedule</p>
              </div>
            }
          >
            <div className="h-full w-full flex flex-col p-2.5 gap-y-5">
              {/* TODO: Add in filtering for Bookings */}
              <div className="self-end w-1/4">
                <Input
                  placeholder="Search"
                  value={classQ}
                  onValueChange={setClassQ}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
              {/* TODO: Add in sort on the date */}
              <Table removeWrapper classNames={tableClassNames}>
                <TableHeader>
                  <TableColumn>Class</TableColumn>
                  <TableColumn></TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn allowsSorting>Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {classItems.map((c) => {
                    return (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>
                          <button
                            className="cursor-pointer"
                            onClick={() => selectRow(c)}
                          >
                            <MdOpenInNew />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Chip classNames={chipClassNames[c.status]}>
                            {chipTypes[c.status].message}
                          </Chip>
                        </TableCell>
                        <TableCell>{format(c.date, "d/MM/y HH:mm")}</TableCell>
                      </TableRow>
                    );
                  })}
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
                  total={classPages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            </div>
          </Tab>
          <Tab
            key="booked"
            title={
              <div className="flex flex-row items-center gap-x-2">
                <MdList />
                <p className="text-base">Booked classes</p>
              </div>
            }
          >
            <div className="w-full flex flex-col p-2.5 gap-y-5">
              {/* TODO: Add in filtering for Bookings */}
              <div className="self-end w-1/4">
                <Input
                  placeholder="Search"
                  value={bookingQ}
                  onValueChange={setBookingQ}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
              {/* TODO: Add in sort on the date */}
              <Table removeWrapper classNames={tableClassNames}>
                <TableHeader>
                  <TableColumn>Class</TableColumn>
                  <TableColumn></TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn allowsSorting>Class date</TableColumn>
                  <TableColumn allowsSorting>Booking date</TableColumn>
                </TableHeader>
                <TableBody>
                  {bookingItems.map((booking) => {
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.class.name}</TableCell>
                        <TableCell>
                          <button
                            className="cursor-pointer"
                            onClick={() => selectRow(booking)}
                          >
                            <MdOpenInNew />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Chip classNames={chipClassNames["booked"]}>
                            {chipTypes["booked"].message}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {format(booking.class.date, "d/MM/y HH:mm")}
                        </TableCell>
                        <TableCell>
                          {format(booking.createdAt, "d/MM/y HH:mm")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
          </Tab>
        </Tabs>
      </div>
      <ClassDetailsModal
        selectedClass={selectedClass}
        selectedBooking={tab == "schedule" ? {} : selectedBooking}
        tab={tab}
        userId={userId}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}

UserClassLandingPage.propTypes = {
  userId: PropTypes.number,
  classes: PropTypes.array,
  bookings: PropTypes.array,
};
