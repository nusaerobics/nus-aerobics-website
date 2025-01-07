import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Chip, Spinner, Tooltip } from "@nextui-org/react";
import { chipClassNames, chipTypes, modalClassNames } from "../../utils/ClassNames";
import {
  MdCheckCircleOutline,
  MdOutlineCalendarMonth,
  MdOutlineCancel,
  MdOutlineLocationOn,
  MdPersonOutline
} from "react-icons/md";
import { format } from "date-fns";
import { SectionTitle } from "../../utils/Titles";
import Toast from "../../Toast";
import { useEffect, useMemo, useState } from "react";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export default function BookingModal({
                                       selectedBooking,
                                       selectedClass,
                                       userId,
                                       isOpen,
                                       onOpen,
                                       onOpenChange,
                                     }) {
  const [isCancel, setIsCancel] = useState(true);
  const [modalType, setModalType] = useState("view"); // Either: "view", "loading", or "result"
  const [result, setResult] = useState({}); // {  isSuccess: boolean, header: string, message: string }
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});
  const toggleShowToast = () => {
    setShowToast(!showToast);
  }

  useEffect(() => {
    const result = isAllowedCancel(selectedClass);
    setIsCancel(result);
  })
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
    setModalType("view");
  }, [isOpen]);

  const isAllowedCancel = (selectedClass) => {
    const utcDate = fromZonedTime(selectedClass.date, "Asia/Singapore");
    const sgDate = toZonedTime(utcDate, "Asia/Singapore");
    const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    const cancelDeadline = new Date(sgDate.getTime() - 12 * 60 * 60 * 1000);
    return sgCurrentDate < cancelDeadline;
  }

  async function unbookClass() {
    setModalType("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          classId: selectedBooking.class.id,
          userId: userId,
        }),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.error }`)
      }
      setModalType("result");
      setResult({
        isSuccess: true,
        header: "Unbooked class",
        message: `Your booking for ${ selectedBooking.class.name } has been cancelled.`,  // TODO: Add in class time
      });
    } catch (error) {
      console.log(error);
      setModalType("result");
      setResult({
        isSuccess: false,
        header: "Cancellation unsuccessful",
        message: `Unable to cancel booking for ${ selectedBooking.class.name }: ${ error.message }`,
      });
    }
  }

  return (
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
              { (modalType === "view") && (
                <>
                  <ModalHeader>
                    <div className="flex flex-row gap-x-5">
                      <p className="text-a-navy">{ selectedBooking.class.name }</p>
                      <Chip
                        classNames={
                          chipClassNames["booked"]
                        }
                      >
                        {
                          chipTypes["booked"].message
                        }
                      </Chip>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-y-2.5">
                      <div className="flex flex-row items-center gap-2.5">
                        <MdOutlineCalendarMonth size={ 24 } color={ "#1F4776" }/>
                        <p className="text-a-black text-sm md:text-base">
                          { format(selectedBooking.class.date, "d/MM/y HH:mm (EEE)") }
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
                        { selectedBooking.class.description }
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    { isCancel && (
                      <button
                        onClick={ unbookClass }
                        className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-red text-white cursor-pointer">
                        Unbook class
                      </button>) }
                    { !isCancel && (
                      <Tooltip
                        content="Classes can only be cancelled 12 hours before"
                      >
                        <button
                          disabled
                          className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-red/10 text-a-red cursor-not-allowed"
                        >
                          Unbook class
                        </button>
                      </Tooltip>) }
                  </ModalFooter>
                </>
              ) }
              { (modalType === "loading") && (
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                    <Spinner color="primary" size="lg"/>
                    <p className="text-a-black text-sm md:text-base">Unbooking your class...</p>
                  </div>
                </ModalBody>
              ) }
              { (modalType === "result") && (
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
              ) }
            </>
          );
        } }
      </ModalContent>
      { showToast &&
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div> }
    </Modal>
  )
}
