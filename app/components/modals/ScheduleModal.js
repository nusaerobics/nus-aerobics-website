import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Chip, Spinner, Tooltip } from "@nextui-org/react";
import { chipClassNames, chipTypes, modalClassNames } from "../utils/ClassNames";
import {
  MdCheckCircleOutline,
  MdOutlineCalendarMonth,
  MdOutlineCancel,
  MdOutlineLocationOn,
  MdPersonOutline
} from "react-icons/md";
import { format } from "date-fns";
import { SectionTitle } from "../utils/Titles";
import { useEffect, useState } from "react";

export default function ScheduleModal({
                                        selectedClass,
                                        userId,
                                        isOpen,
                                        onOpen,
                                        onOpenChange,
                                      }) {
  const [modalType, setModalType] = useState("view"); // Either: "view", "loading", or "result"
  const [result, setResult] = useState({}); // {  isSuccess: boolean, header: string, message: string }
  const [isWaitlist, setIsWaitlist] = useState(false);  // TRUE when user is already on the class' waitlist

  useEffect(() => {
    setModalType("view");
  }, [isOpen]);
  useEffect(() => {
    const fetchWaitlists = async () => {
      const res = await fetch(`/api/waitlists?userId=${ userId }`);
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`Unable to get waitlists for user ${ userId }: ${ response }`)
      }
      const waitlists = await res.json();
      for (let i = 0; i < waitlists.length; i++) {
        const waitlist = waitlists[i];
        if (selectedClass.id === waitlist.class.id) {
          setIsWaitlist(true);
        }
      }
    };
    if (selectedClass.bookedCapacity >= selectedClass.maxCapacity) {
      fetchWaitlists();
    }
  }, [onOpenChange]);

  async function bookClass() {
    setModalType("loading");
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
        message: `Your booking for ${ selectedClass.name } on ${ format(selectedClass.date, "d/MM/y HH:mm (EEE)") } has been confirmed.`,
      });
      setModalType("result");
    } catch (error) {
      console.log(error);
      setResult({
        isSuccess: false,
        header: "Unable to book class",
        message: `We are unable to make your booking at the moment: ${ error.message }`,
      });
      setModalType("result");
    }
  }

  async function joinWaitlist() {
    setModalType("loading");
    try {
      const res = await fetch("/api/waitlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass.id, userId: userId }),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.error }`);
      }
      setResult({
        isSuccess: true,
        header: "Joined waitlist",
        message: `Your spot on the waitlist for ${ selectedClass.name } on ${ format(selectedClass.date, "d/MM/y HH:mm (EEE)") } has been confirmed. An email will be sent to you if a vacancy opens.`,
      });
      setModalType("result");
    } catch (error) {
      console.log(error);
      setResult({
        isSuccess: false,
        header: "Unable to join waitlist",
        message: `We are unable to add you to the waitlist at the moment: ${ error.message }`,
      });
      setModalType("result");
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
                      <p className="text-a-navy">{ selectedClass.name }</p>
                      <Chip
                        classNames={
                          chipClassNames[selectedClass.bookedCapacity >= selectedClass.maxCapacity ? "full" : "open"]
                        }
                      >
                        {
                          chipTypes[selectedClass.bookedCapacity >= selectedClass.maxCapacity ? "full" : "open"].message
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
                      { selectedClass.bookedCapacity < selectedClass.maxCapacity && (
                        <button
                          onClick={ bookClass }
                          className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-navy text-white cursor-pointer"
                        >
                          Book class
                        </button>
                      ) }
                      { selectedClass.bookedCapacity >= selectedClass.maxCapacity && !isWaitlist && (
                        <button
                          onClick={ joinWaitlist }
                          className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-navy text-white cursor-pointer"
                        >
                          Join waitlist
                        </button>
                      ) }
                      { selectedClass.bookedCapacity >= selectedClass.maxCapacity && isWaitlist && (
                        <Tooltip
                          content="You are already on the waitlist."
                        >
                          <button
                            className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-navy/10 text-a-navy cursor-not-allowed"
                            disabled
                          >
                            Join waitlist
                          </button>
                        </Tooltip>
                      ) }
                    </div>
                  </ModalFooter>
                </>
              ) }
              { (modalType === "loading") && (
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                    <Spinner color="primary" size="lg"/>
                    <p className="text-a-black text-sm md:text-base">Booking your class...</p>
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
                    <p className="text-a-black text-sm md:text-base text-center">
                      { result.message }
                    </p>
                  </div>
                </ModalBody>
              ) }
            </>
          );
        } }
      </ModalContent>
    </Modal>
  )
}
