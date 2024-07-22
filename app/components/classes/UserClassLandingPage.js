"use client";

import { useState } from "react";
import {
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
  ModalFooter,
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
import { PageTitle } from "../Titles";
import { format } from "date-fns";

export default function UserClassLandingPage({
  userId,
  classes,
  userBookings,
}) {
  console.log(userId, classes, userBookings);
  const [selected, setSelected] = useState("schedule");
  const [searchInput, setSearchInput] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedBooking, setSelectedBooking] = useState({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // NOTE: Might be able to use useState and handlers instead?

  const handleClick = (rowData) => {
    if (selected == "schedule") {
      setSelectedClass(rowData);
    } else {
      console.log(rowData);
      console.log(rowData.class);

      setSelectedClass(rowData.class);
      setSelectedBooking(rowData);
    }
    onOpen();
  };

  async function bookClass() {
    /**
     * When user books class request,
     * 1. Check if bookedCapacity < maxCapacity
     * 2. Update class bookedCapapcity += 1
     * 3. Create new booking
     * 4. Create new transaction
     */
    console.log(selectedClass);
    if (selectedClass.bookedCapacity < selectedClass.maxCapacity) {
      try {
        const newBookedCapacity = selectedClass.bookedCapacity + 1;

        // 2. Update class bookedCapacity
        const updatedClass = {
          id: selectedClass.id,
          name: selectedClass.name,
          description: selectedClass.description,
          date: selectedClass.date,
          maxCapacity: selectedClass.maxCapacity,
          bookedCapacity: newBookedCapacity,
          status:
            newBookedCapacity == selectedClass.maxCapacity
              ? "full"
              : selectedClass.status,
        };
        const res1 = await fetch("/api/classes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedClass),
        });
        if (!res1.ok) {
          throw new Error(`Unable to update class ${selectedClass.id}`);
        }

        // 3. Create new booking
        const newBooking = { classId: selectedClass.id, userId: userId };
        const res2 = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBooking),
        });
        if (!res2.ok) {
          throw new Error("Unable to create booking");
        }

        // 4. Create new transaction
        const newTransaction = {
          userId: userId,
          amount: -1,
          type: "book",
          description: `Booked '${selectedClass.name}'`,
        };
        const res3 = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTransaction),
        });
        if (!res3.ok) {
          throw new Error("Unable to create transaction");
        }
        onOpenChange();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Class is full");
    }
  }

  async function unbookClass() {
    /**
     * When user unbooks class,
     * 1. Delete booking
     * 2. Update class bookedCapacity -= 1
     * 3. Create new transaction of unbooked - "refund"
     */
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
        id: selectedClass.id,
        name: selectedClass.name,
        description: selectedClass.description,
        date: selectedClass.date,
        maxCapacity: selectedClass.maxCapacity,
        bookedCapacity: newBookedCapacity,
        status: newBookedCapacity < selectedClass.maxCapacity ? "open" : "full", // NOTE: Don't know when unbooking a class would make it still full?
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
        userId: selectedBooking.userId,
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
      onOpenChange();
    } catch (error) {
      console.log(error);
    }
  }

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
                          <button onClick={() => handleClick(booking)}>
                            <MdOpenInNew />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Chip classNames={chipClassNames["booked"]}>
                            {chipTypes["booked"].message}
                          </Chip>
                        </TableCell>
                        {/* <TableCell>{booking.class.date}</TableCell>
                        <TableCell>{booking.createdAt}</TableCell> */}
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
                <p className="text-a-navy">{selectedClass.name}</p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-y-2.5">
                  <div className="flex flex-row items-center gap-2.5">
                    <MdOutlineCalendarMonth size={24} color={"#1F4776"} />
                    <p className="text-a-black">
                      {format(selectedClass.date, "d/MM/y HH:mm")}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2.5">
                    <MdOutlineLocationOn size={24} color={"#1F4776"} />
                    <p className="text-a-black">UTown Gym Aerobics Studio</p>
                  </div>
                  <div className="flex flex-row items-center gap-2.5">
                    <MdPersonOutline size={24} color={"#1F4776"} />
                    <p className="text-a-black">Alpha Fitness</p>
                  </div>
                </div>
                <div>
                  <p className="text-a-black">{selectedClass.description}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end">
                  {/* TODO: Should check if the current user has a booking for the current class */}
                  {selected == "schedule" ? (
                    <button
                      onClick={() => bookClass()}
                      className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white"
                    >
                      Book class
                    </button>
                  ) : (
                    <button
                      onClick={() => unbookClass()}
                      className="rounded-[30px] px-[20px] py-[10px] bg-a-red text-white"
                    >
                      Unbook class
                    </button>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
