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
        const res = await fetch(`/api/users?id=${ userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get user ${ userId }: ${ res.status }`);
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get user",
          message: `Unable to get user ${ userId }. Try again later.`,
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
    const res = await fetch(`/api/bookings?userId=${ userId }`);
    if (!res.ok) {
      const response = await res.json();
      throw new Error(
        `Unable to get bookings for user ${ userId }: ${ response.message }`
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
    setModalType("loading");
    if (user.balance <= 0) {
      setModalType("result");
      setResult({
        isSuccess: false,
        header: "Booking unsuccessful",
        message:
          "Unable to book class due to insufficient credits. Please purchase more credits first.",
      });
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            classId: selectedClass.id,
            userId: userId,
            isForced: false,
          }),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.message }`)
      }

      setResult({
        isSuccess: true,
        header: "Booking successful",
        message: `Your booking for ${ selectedClass.name } has been confirmed.`,
      });
      setModalType("result");
    } catch (error) {
      console.log(error);
      setResult({
        isSuccess: false,
        header: "Booking unsuccessful",
        message: `Unable to book ${ selectedClass.name }: ${ error.message }`,
      });
      setModalType("result");
    }
  }

  async function unbookClass() {
    setModalType("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          classId: selectedClass.id,
          userId: userId,
        }),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.message }`)
      }
      setModalType("result");
      setResult({
        isSuccess: true,
        header: "Cancellation successful",
        message: `Your booking for ${ selectedClass.name } has been cancelled.`,
      });
    } catch (error) {
      console.log(error);
      setModalType("result");
      setResult({
        isSuccess: false,
        header: "Cancellation unsuccessful",
        message: `Unable to cancel booking for ${ selectedClass.name }: ${ error.message }`,
      });
    }
  }

  return (
    <>
      <Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        size="2xl"
        backdrop="opaque"
        classNames={ modalClassNames }
      >
        <ModalContent>
          { (onClose) => {
            return (
              <>
                { modalType == "view" ? (
                  <>
                    <ModalHeader>
                      <div className="flex flex-row gap-x-5">
                        <p className="text-a-navy">{ selectedClass.name }</p>
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
                          <MdOutlineCalendarMonth size={ 24 } color={ "#1F4776" }/>
                          <p className="text-a-black text-sm md:text-base">
                            { format(selectedClass.date, "d/MM/y HH:mm (EEE)") }
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2.5">
                          <MdOutlineLocationOn size={ 24 } color={ "#1F4776" }/>
                          <p className="text-a-black text-sm md:text-base">
                            UTown Gym Aerobics Studio
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2.5">
                          <MdPersonOutline size={ 24 } color={ "#1F4776" }/>
                          <p className="text-a-black text-sm md:text-base">
                            Alpha Fitness
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-a-black text-sm md:text-base">
                          { selectedClass.description }
                        </p>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <div className="flex justify-end">
                        { tab == "schedule" ? (
                          <>
                            { !isBooked && selectedClass.status == "open" ? (
                              <button
                                onClick={ bookClass }
                                className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-navy text-white cursor-pointer"
                              >
                                Book class
                              </button>
                            ) : (
                              <></>
                            ) }
                          </>
                        ) : (
                          <Tooltip
                            content="Classes can only be cancelled 12 hours before"
                            isDisabled={ isCancel }
                          >
                            <button
                              onClick={ unbookClass }
                              disabled={ !isCancel }
                              className={ clsx(
                                "rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm",
                                {
                                  "bg-a-red text-white cursor-pointer":
                                  isCancel,
                                  "bg-a-red/10 text-a-red cursor-not-allowed":
                                    !isCancel,
                                }
                              ) }
                            >
                              Unbook class
                            </button>
                          </Tooltip>
                        ) }
                      </div>
                    </ModalFooter>
                  </>
                ) : (
                  <></>
                ) }
                { modalType == "loading" ? (
                  <ModalBody>
                    <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                      <Spinner color="primary" size="lg"/>
                      <p className="text-a-black text-sm md:text-base">
                        { tab == "schedule"
                          ? "Booking your class..."
                          : "Cancelling your booking..." }
                      </p>
                    </div>
                  </ModalBody>
                ) : (
                  <></>
                ) }
                { modalType == "result" ? (
                  <ModalBody>
                    <div className="flex flex-col items-center justify-center gap-y-2.5 p-5 md:p-10">
                      { result.isSuccess ? (
                        <MdCheckCircleOutline size={ 84 } color={ "#2A9E2F" }/>
                      ) : (
                        <MdOutlineCancel size={ 84 } color={ "#9E2A2A" }/>
                      ) }
                      <SectionTitle title={ result.header }/>
                      <p className="text-a-black text-sm md:text-base">
                        { result.message }
                      </p>
                    </div>
                  </ModalBody>
                ) : (
                  <></>
                ) }
              </>
            );
          } }
        </ModalContent>
      </Modal>
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

ClassDetailsModal.propTypes = {
  selectedClass: PropTypes.object,
  selectedBooking: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  tab: PropTypes.string,
  userId: PropTypes.number,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onOpenChange: PropTypes.func,
};
