"use client";

import { useState } from "react";
import {
  MdCalendarMonth,
  MdList,
  MdOpenInNew,
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
  MdPersonOutline,
} from "react-icons/md";
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
  useDisclosure,
} from "@nextui-org/modal";
import { Chip, Input, Tabs, Tab } from "@nextui-org/react";
import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  modalClassNames,
  tableClassNames,
  tabsClassNames,
} from "../ClassNames";
import { PageTitle, SectionTitle } from "../Titles";
import { format } from "date-fns";

export default function UserClassLandingPage({ classes, userBookings }) {
  const [selected, setSelected] = useState("schedule");
  const [searchInput, setSearchInput] = useState("");
  const [selectedClass, setSelectedClass] = useState({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // NOTE: Might be able to use useState and handlers instead?

  const handleClick = (rowData) => {
    setSelectedClass(rowData);
    onOpen();
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-5">
      <PageTitle title="Classes" />
      <div className="h-full w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
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
                <MdCalendarMonth />
                <p className="text-base">Class schedule</p>
              </div>
            }
          >
            <div className="w-full flex flex-col p-5 pt-0 items-end gap-y-5">
              {/* TODO: Link Search to the Classes array, search based on name */}
              {/* TODO: Add in filtering for Classes */}
              <Input
                placeholder="Search"
                value={searchInput}
                onValueChange={setSearchInput}
                variant="bordered"
                size="xs"
                classNames={inputClassNames}
              />
              {/* TODO: Later change mapping of table to use COLUMNS and ITEMS */}
              {/* TODO: Add in sort on the date */}
              {/* TODO: Add in paginations */}
              <Table removeWrapper classNames={tableClassNames}>
                <TableHeader>
                  <TableColumn>Class</TableColumn>
                  <TableColumn></TableColumn>
                  <TableColumn allowsSorting>Status</TableColumn>
                  <TableColumn allowsSorting>Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {classes.map((c) => {
                    return (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>
                          <button onClick={() => handleClick(c)}>
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
            <div className="w-full flex flex-col items-end gap-y-5">
              {/* TODO: Link Search to the Bookings array, search based on name */}
              {/* TODO: Add in filtering for Bookings */}
              <div className="w-1/4">
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
              {/* TODO: Add in Booking logic */}
              {/* <Table removeWrapper classNames={tableClassNames}>
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
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>
                          <button onClick={() => handleClick(booking)}>
                            <MdOpenInNew />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Chip classNames={chipClassNames["booked"]}>
                            {chipTypes["booked"].message}
                          </Chip>
                        </TableCell>
                        <TableCell>{format(c.date, "d/MM/y HH:mm")}</TableCell>
                        <TableCell>{format(c.date, "d/MM/y HH:mm")}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table> */}
            </div>
          </Tab>
        </Tabs>
      </div>
      {/* TODO: Change size of modal to only occupy area of Classes section not including NavBar */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        backdrop="opaque"
        classNames={modalClassNames}
      >
        <ModalContent>
          {(
            onClose // TODO: What's the onClose?
          ) => (
            <>
              <ModalHeader>
                <div className="flex flex-row items-center gap-x-2.5">
                  <SectionTitle title={selectedClass.name} />
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-y-2.5">
                  <div className="flex flex-row items-center gap-2.5">
                    <MdOutlineCalendarMonth />
                    <p>{format(selectedClass.date, "d/MM/y HH:mm")}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2.5">
                    <MdOutlineLocationOn />
                    <p>UTown Gym Aerobics Studio</p>
                  </div>
                  <div className="flex flex-row items-center gap-2.5">
                    <MdPersonOutline />
                    <p>Alpha Fitness</p>
                  </div>
                </div>
                <div>
                  <p>{selectedClass.description}</p>
                </div>
                <div className="flex justify-end">
                  <button className="rounded-[30px] px-[20px] py-[10px] bg-[#1F4776] text-white">
                    Book class
                  </button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
