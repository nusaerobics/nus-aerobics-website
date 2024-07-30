"use client";

import { useState } from "react";
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
import { Chip, Input, Tabs, Tab } from "@nextui-org/react";
import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
  tabsClassNames,
} from "../utils/ClassNames";
import { PageTitle } from "../utils/Titles";
import { format } from "date-fns";
import ClassDetailsModal from "../classes/ClassDetailsModal";

export default function UserClassLandingPage({
  userId,
  classes,
  userBookings,
}) {
  // console.log(userId, classes, userBookings);
  const [selected, setSelected] = useState("schedule");
  const [searchInput, setSearchInput] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedBooking, setSelectedBooking] = useState({});
  // const [isCancel, setIsCancel] = useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // NOTE: Might be able to use useState and handlers instead?

  const handleClick = (rowData) => {
    if (selected == "schedule") {
      setSelectedClass(rowData);
    } else {
      setSelectedClass(rowData.class);
      setSelectedBooking(rowData);
      // const result = isAllowedCancel(rowData.class);
      // setIsCancel(result);
    }
    onOpen();
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-5">
      <PageTitle title="Classes" />
      <div className="w-full h-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        {/* NOTE: Might be complicated to make calendar view of calsses */}
        <Tabs
          variant={"underlined"}
          selectedKey={selected}
          onSelectionChange={setSelected}
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
              {/* TODO: Add in paginations */}
              <Table removeWrapper classNames={tableClassNames}>
                <TableHeader>
                  <TableColumn>Class</TableColumn>
                  <TableColumn></TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn allowsSorting>Date</TableColumn>
                  {/* <TableColumn allowsSorting>Booking date</TableColumn> */}
                </TableHeader>
                <TableBody>
                  {classes.map((c) => {
                    return (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>
                          <button
                            className="cursor-pointer"
                            onClick={() => handleClick(c)}
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
              {/* TODO: Add in paginations */}
              <Table removeWrapper classNames={tableClassNames}>
                <TableHeader>
                  <TableColumn>Class</TableColumn>
                  <TableColumn></TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn allowsSorting>Class date</TableColumn>
                  <TableColumn allowsSorting>Booking date</TableColumn>
                </TableHeader>
                <TableBody>
                  {userBookings.map((booking) => {
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.class.name}</TableCell>
                        <TableCell>
                          <button
                            className="cursor-pointer"
                            onClick={() => handleClick(booking)}
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
            </div>
          </Tab>
        </Tabs>
      </div>
      <ClassDetailsModal
        selectedClass={selectedClass}
        selectedBooking={selectedBooking}
        selected={selected}
        userId={userId}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
