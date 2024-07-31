import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import {
  chipClassNames,
  chipTypes,
  modalClassNames,
} from "../utils/ClassNames";
import { Chip, Tooltip } from "@nextui-org/react";
import {
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
  MdPersonOutline,
} from "react-icons/md";

import { format } from "date-fns";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export default function ClassDetailsModal({
  selectedClass,
  selectedBooking,
  selected,
  userId,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const [isCancel, setIsCancel] = useState(true);
  const [status, setStatus] = useState(selectedClass.status);

  useEffect(() => {
    console.log("selected:", selected);
    if (selected == "schedule") {
      // Checks if selectedClass has already been booked by user
      // TODO: Add a catch
      checkIsBooked(selectedClass).then((result) => {
        if (result) {
          setStatus("booked");
        } else if (selectedClass.bookedCapacity == selectedClass.maxCapacity) {
          setStatus("full");
        } else {
          setStatus(selectedClass.status);
        }
      });
    } else {
      // Checks if booked selectedClass can be cancelled
      const result = isAllowedCancel(selectedClass);
      setIsCancel(result);
      setStatus("booked");
    }
  });

  async function checkIsBooked(selectedClass) {
    // For a user's bookings, check if there's a booking where the classId = selectedClass.id
    const res = await fetch(`/api/bookings?userId=${userId}`);
    if (!res.ok) {
      throw new Error(
        `Unable to get bookings for user ${userId}: ${res.status}`
      );
    }
    const data = await res.json();
    const hasBooking = data.filter((booking) => {
      return booking.class.id == selectedClass.id;
    });
    return hasBooking.length > 0;
  }

  function isAllowedCancel(selectedClass) {
    const utcDate = fromZonedTime(selectedClass.date, "Asia/Singapore");
    const sgDate = toZonedTime(utcDate, "Asia/Singapore");
    const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    const cancelDeadline = new Date(sgDate.getTime() + 12 * 60 * 60 * 1000);
    return sgCurrentDate < cancelDeadline;
  }

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

  function test() {
    console.log("testing button");
  }

  async function unbookClass() {
    console.log("here");
    /**
     * When user unbooks class,
     * 1. Check if current time is more than 12 hours before class
     * 1. Delete booking
     * 2. Update class bookedCapacity -= 1
     * 3. Create new transaction of unbooked - "refund"
     */
    try {
      const newBookedCapacity = selectedBooking.class.bookedCapacity - 1;
      console.log(newBookedCapacity);
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
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="opaque"
      classNames={modalClassNames}
    >
      <ModalContent>
        {(onClose) => {
          return (
            <>
              <ModalHeader>
                <div className="flex flex-row gap-x-5">
                  <p className="text-a-navy">{selectedClass.name}</p>
                  {/* TODO: Add in check for when class is fully booked, or booked by user */}
                  <Chip classNames={chipClassNames[status]}>
                    {chipTypes[status].message}
                  </Chip>
                </div>
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
                  {selected == "schedule" ? (
                    <>
                      {status == "open" ? (
                        <button
                          onClick={bookClass}
                          className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
                        >
                          Book class
                        </button>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <Tooltip
                      content="Classes can only be cancelled 12 hours before"
                      isDisabled={isCancel}
                    >
                      <button
                        onClick={unbookClass}
                        disabled={!isCancel}
                        className={clsx("rounded-[30px] px-[20px] py-[10px]", {
                          "bg-a-red text-white cursor-pointer": isCancel,
                          "bg-a-red/10 text-a-red cursor-not-allowed":
                            !isCancel,
                        })}
                      >
                        Unbook class
                      </button>
                    </Tooltip>
                  )}
                </div>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}

ClassDetailsModal.propTypes = {
  selectedClass: PropTypes.object,
  selectedBooking: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  selected: PropTypes.string,
  userId: PropTypes.number,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onOpenChange: PropTypes.func,
};
