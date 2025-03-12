import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Chip, Spinner } from "@heroui/react";
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

export default function WaitlistModal({
                                        selectedWaitlist,
                                        selectedClass,
                                        userId,
                                        isOpen,
                                        onOpen,
                                        onOpenChange,
                                      }) {
  const [modalType, setModalType] = useState("view"); // Either: "view", "loading", or "result"
  const [result, setResult] = useState({}); // {  isSuccess: boolean, header: string, message: string }

  useEffect(() => {
    setModalType("view");
  }, [isOpen]);

  async function leaveWaitlist() {
    setModalType("loading");
    try {
      const res = await fetch(`/api/waitlists/${ selectedWaitlist.id }`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.error }`);
      }
      setModalType("result");
      setResult({
        isSuccess: true,
        header: "Left waitlist",
        message: `You have been removed from the waitlist for ${ selectedClass.name }. You will not receive an email when a slot becomes available.`
      })
    } catch (error) {
      console.log(error);
      setModalType("result");
      setResult({
        isSuccess: false,
        header: "Unable to leave waitlist",
        message: `We are unable to remove you from the waitlist for ${ selectedClass.name } at the moment: ${ error.message }`,
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
                      <p className="text-a-navy">{ selectedClass.name }</p>
                      <Chip
                        classNames={
                          chipClassNames["waitlisted"]
                        }
                      >
                        {
                          chipTypes["waitlisted"].message
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
                    <button
                      onClick={ leaveWaitlist }
                      className="rounded-[30px] px-[10px] md:px-[20px] py-[10px] text-xs md:text-sm bg-a-red text-white cursor-pointer">
                      Leave waitlist
                    </button>
                  </ModalFooter>
                </>
              ) }
              { (modalType === "loading") && (
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                    <Spinner color="primary" size="lg"/>
                    <p className="text-a-black text-sm md:text-base">Leaving the waitlist...</p>
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
