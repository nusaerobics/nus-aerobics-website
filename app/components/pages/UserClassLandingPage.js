"use client";

import { format } from "date-fns";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
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

export default function UserClassLandingPage({
  userId,
  classes,
  bookings,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selected, setSelected] = useState("schedule");
  const [searchInput, setSearchInput] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedBooking, setSelectedBooking] = useState({});

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const classPages = Math.ceil(classes.length / rowsPerPage);
  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return classes.slice(start, end);
  }, [page, classes]);

  const bookingPages = Math.ceil(bookings.length / rowsPerPage);
  const bookingItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return bookings.slice(start, end);
  }, [page, bookings]);

  const handleTabChange = () => {
    if (selected == "schedule") {
      setSelected("booked");
      setPage(1);
    } else {
      setSelected("schedule");
      setPage(1);
    }
  };

  const selectRow = (rowData) => {
    if (selected == "schedule") {
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
      <div className="w-full h-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        {/* NOTE: Might be complicated to make calendar view of calsses */}
        <Tabs
          variant={"underlined"}
          selectedKey={selected}
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
              {/* TODO: Link Search to the Bookings array, search based on name */}
              {/* TODO: Add in filtering for Bookings */}
              <div className="self-end w-1/4">
                <Input
                  placeholder="Search"
                  value={searchInput}
                  onValueChange={setSearchInput}
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
                  {/* <TableColumn allowsSorting>Booking date</TableColumn> */}
                </TableHeader>
                <TableBody>
                  {classItems.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <button
                            className="cursor-pointer"
                            onClick={() => selectRow(item)}
                          >
                            <MdOpenInNew />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Chip classNames={chipClassNames[item.status]}>
                            {chipTypes[item.status].message}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {format(item.date, "d/MM/y HH:mm")}
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
              {/* TODO: Link Search to the Bookings array, search based on name */}
              {/* TODO: Add in filtering for Bookings */}
              <div className="self-end w-1/4">
                <Input
                  placeholder="Search"
                  value={searchInput}
                  onValueChange={setSearchInput}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
              {/* TODO: Later change mapping of table to use COLUMNS and ITEMS */}
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
        selectedBooking={selected == "schedule" ? {} : selectedBooking}
        selected={selected}
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
