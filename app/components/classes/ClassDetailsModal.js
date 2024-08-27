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
import { Chip, Spinner, Tooltip } from "@nextui-org/react";
import {
  MdOutlineCancel,
  MdCheckCircleOutline,
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
  MdPersonOutline,
} from "react-icons/md";

import { format } from "date-fns";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { SectionTitle } from "../utils/Titles";
import Toast from "../Toast";
export default function ClassDetailsModal({
  selectedClass,
  selectedBooking,
  tab,
  userId,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const [user, setUser] = useState({});
  const [isCancel, setIsCancel] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [modalType, setModalType] = useState("view"); // Either: "view", "loading", or "result"
  const [result, setResult] = useState({}); // {  isSuccess: boolean, header: string, message: string }
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

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

  useEffect(() => {
    // getUser
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?id=${userId}`);
        if (!res.ok) {
          throw new Error(`Unable to get user ${userId}: ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get user",
          message: `Unable to get user ${userId}. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (tab == "schedule") {
      // Checks if selectedClass has already been booked by user
      checkIsBooked(selectedClass).then((result) => {
        setIsBooked(result);
        // TODO: Add a catch
      });
    } else {
      // Checks if booked selectedClass can be cancelled
      const result = isAllowedCancel(selectedClass);
      setIsCancel(result);
      setIsBooked(true);
    }
  });

  useEffect(() => {
    setModalType("view");
  }, [isOpen]);

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
    const cancelDeadline = new Date(sgDate.getTime() - 12 * 60 * 60 * 1000);
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
    setModalType("loading");
    if (user.balance <= 0) {
      setModalType("result");
      setResult({
        isSuccess: false,
        header: "Booking unsuccessful",
        message:
          "Unable to book class due to insufficient credits. Purchase more credits first.",
      });
      return;
    }

    try {
      const classRes = await fetch(`/api/classes?id=${selectedClass.id}`);
      if (!classRes.ok) {
        throw new Error("Unable to get latest class");
      }
      const latestSelectedClass = await classRes.json();
      console.log(latestSelectedClass);
      if (latestSelectedClass.bookedCapacity >= 19) {
        setModalType("result");
        setResult({
          isSuccess: false,
          header: "Booking unsuccessful",
          message:
            "Unable to book class because it is full. Try booking a different class.",
        });
        return;
      }

      const newBookedCapacity = latestSelectedClass.bookedCapacity + 1;

      // 2. Update class bookedCapacity
      const updatedClass = {
        id: latestSelectedClass.id,
        name: latestSelectedClass.name,
        description: latestSelectedClass.description,
        date: latestSelectedClass.date,
        maxCapacity: latestSelectedClass.maxCapacity,
        bookedCapacity: newBookedCapacity,
        status:
          newBookedCapacity == latestSelectedClass.maxCapacity
            ? "full"
            : latestSelectedClass.status,
      };
      const res1 = await fetch("/api/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      if (!res1.ok) {
        throw new Error(`Unable to update class ${latestSelectedClass.id}`);
      }
      console.log(updatedClass);

      // 3. Create new booking
      const newBooking = { classId: latestSelectedClass.id, userId: userId };
      const res2 = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });
      if (!res2.ok) {
        // TODO: Revert 2. Update class bookedCapacity back to original selectedClass
        const revert1 = await fetch("/api/classes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(latestSelectedClass),
        });
        if (!revert1.ok) {
          throw new Error("Unable to revert previous class update");
        }
        throw new Error("Unable to create booking");
      }

      // 3. Update user's balance
      const userRes = await fetch(`/api/users?id=${userId}`);
      if (!userRes.ok) {
        // TODO: Revert
        throw new Error("Unable to get user");
      }
      const latestUser = await userRes.json();
      const res3 = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, balance: latestUser.balance - 1 }),
      });
      if (!res3.ok) {
        throw new Error("Unable to update user");
      }

      // 4. Create new transaction
      const newTransaction = {
        userId: userId,
        amount: -1,
        type: "book",
        description: `Booked '${selectedClass.name}'`,
      };
      const res4 = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res4.ok) {
        // Revert 2. Update class bookedCapacity back to original selectedClass
        const revert1 = await fetch("/api/classes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedClass),
        });
        if (!revert1.ok) {
          throw new Error("Unable to revert previous class update");
        }

        // Revert 3. Create new booking by deleting created booking
        const revert2 = await fetch("/api/bookings", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: res2.id }),
        });
        if (!revert2.ok) {
          throw new Error("Unable to revert previous created booking");
        }
        throw new Error("Unable to create transaction");
      }

      setResult({
        isSuccess: true,
        header: "Booking successful",
        message: "Your booking has been successful.",
      });
      setModalType("result");
    } catch (error) {
      setResult({
        isSuccess: false,
        header: "Booking unsuccessful",
        message: `${error.message}`,
        // "An error occurred while trying to book this class. Try again later.",
      });
      setModalType("result");
      console.log(error);
    }
  }

  async function unbookClass() {
    /**
     * When user unbooks class,
     * 0. (User) Check if current time is more than 12 hours before class
     * 1. Delete booking
     * 2. Update class bookedCapacity -= 1
     * 3. Create new transaction of unbooked - "refund"
     */
    // TODO: Based on reverts, should I do delete last?
    setModalType("loading");
    try {
      const classRes = await fetch(`/api/classes?id=${selectedClass.id}`);
      if (!classRes.ok) {
        throw new Error("Unable to get latest class");
      }
      const latestSelectedClass = await classRes.json();
      const newBookedCapacity = latestSelectedClass.bookedCapacity - 1;

      // 1. Delete booking
      const res1 = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedBooking.id }),
      });
      if (!res1.ok) {
        throw new Error(`Unable to delete booking ${latestSelectedClass.id}`);
      }

      // 2. Update class bookedCapacity
      const updatedClass = {
        id: latestSelectedClass.id,
        name: latestSelectedClass.name,
        description: latestSelectedClass.description,
        date: latestSelectedClass.date,
        maxCapacity: latestSelectedClass.maxCapacity,
        bookedCapacity: newBookedCapacity,
        status:
          newBookedCapacity < latestSelectedClass.maxCapacity ? "open" : "full", // NOTE: Don't know when unbooking a class would make it still full?
      };
      const res2 = await fetch("/api/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      if (!res2.ok) {
        // TODO: Handle reverts - Putting back the booking after being deleted
        throw new Error(`Unable to update class ${latestSelectedClass.id}`);
      }

      // 3. Update user's balance
      const userRes = await fetch(`/api/users?id=${userId}`);
      if (!userRes.ok) {
        // TODO: Revert
        throw new Error("Unable to get user");
      }
      const latestUser = await userRes.json();
      const res3 = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, balance: latestUser.balance + 1 }),
      });
      if (!res3.ok) {
        throw new Error("Unable to update user");
      }

      // 4. Create new transaction
      const newTransaction = {
        userId: selectedBooking.userId,
        amount: 1,
        type: "refund",
        description: `Refunded '${latestSelectedClass.name}'`,
      };
      const res4 = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res4.ok) {
        // TODO: Handle reverts - Reverting updates and putting back booking
        throw new Error("Unable to create transaction");
      }
      setModalType("result");
      setResult({
        isSuccess: true,
        header: "Cancellation successful",
        message: "Your booking has been successfully cancelled.",
      });
    } catch (error) {
      setModalType("result");
      setResult({
        isSuccess: false,
        header: "Cancellation unsuccessful",
        message:
          "An error occurred while trying to cancel this class. Try again later.",
      });
      console.log(error);
    }
  }

  return (
    <>
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
                {modalType == "view" ? (
                  <>
                    <ModalHeader>
                      <div className="flex flex-row gap-x-5">
                        <p className="text-a-navy">{selectedClass.name}</p>
                        <Chip
                          classNames={
                            chipClassNames[
                              isBooked ? "booked" : selectedClass.status
                            ]
                          }
                        >
                          {
                            chipTypes[
                              isBooked ? "booked" : selectedClass.status
                            ].message
                          }
                        </Chip>
                      </div>
                    </ModalHeader>
                    <ModalBody>
                      <div className="flex flex-col gap-y-2.5">
                        <div className="flex flex-row items-center gap-2.5">
                          <MdOutlineCalendarMonth size={24} color={"#1F4776"} />
                          <p className="text-a-black text-sm md:text-base">
                            {format(selectedClass.date, "d/MM/y HH:mm (EEE)")}
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2.5">
                          <MdOutlineLocationOn size={24} color={"#1F4776"} />
                          <p className="text-a-black text-sm md:text-base">
                            UTown Gym Aerobics Studio
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2.5">
                          <MdPersonOutline size={24} color={"#1F4776"} />
                          <p className="text-a-black text-sm md:text-base">
                            Alpha Fitness
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-a-black text-sm md:text-base">
                          {selectedClass.description}
                        </p>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <div className="flex justify-end">
                        {tab == "schedule" ? (
                          <>
                            {!isBooked && selectedClass.status == "open" ? (
                              <button
                                onClick={bookClass}
                                className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-navy text-white cursor-pointer"
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
                              className={clsx(
                                "rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm",
                                {
                                  "bg-a-red text-white cursor-pointer":
                                    isCancel,
                                  "bg-a-red/10 text-a-red cursor-not-allowed":
                                    !isCancel,
                                }
                              )}
                            >
                              Unbook class
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </ModalFooter>
                  </>
                ) : (
                  <></>
                )}
                {modalType == "loading" ? (
                  <ModalBody>
                    <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                      <Spinner color="primary" size="lg" />
                      <p className="text-a-black text-sm md:text-base">
                        {tab == "schedule"
                          ? "Booking your class..."
                          : "Cancelling your booking..."}
                      </p>
                    </div>
                  </ModalBody>
                ) : (
                  <></>
                )}
                {modalType == "result" ? (
                  <ModalBody>
                    <div className="flex flex-col items-center justify-center gap-y-2.5 p-5 md:p-10">
                      {result.isSuccess ? (
                        <MdCheckCircleOutline size={84} color={"#2A9E2F"} />
                      ) : (
                        <MdOutlineCancel size={84} color={"#9E2A2A"} />
                      )}
                      <SectionTitle title={result.header} />
                      <p className="text-a-black text-sm md:text-base">
                        {result.message}
                      </p>
                    </div>
                  </ModalBody>
                ) : (
                  <></>
                )}
              </>
            );
          }}
        </ModalContent>
      </Modal>
      {showToast ? (
        <div onClick={toggleShowToast}>
          <Toast
            isSuccess={toast.isSuccess}
            header={toast.header}
            message={toast.message}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

ClassDetailsModal.propTypes = {
  selectedClass: PropTypes.object,
  selectedBooking: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  tab: PropTypes.string,
  userId: PropTypes.number,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onOpenChange: PropTypes.func,
};
