import PropTypes from "prop-types";
import { format } from "date-fns";
import { useDisclosure } from "@heroui/modal";
import BookingModal from "../modals/BookingModal";

export default function ClassCard({ booking }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex flex-col gap-y-2.5 p-2.5 rounded-[20px] border-l-[4px] border-l-a-navy bg-a-navy/10">
        <div className="flex flex-col">
          <p className="font-bold text-base">{booking.class.name}</p>
          <p>{format(booking.class.date, "d/MM/y HH:mm (EEE)")}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onOpen}
            className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
          >
            View details
          </button>
        </div>
      </div>
      <BookingModal
        selectedBooking={ booking }
        selectedClass={ booking.class }
        userId={ booking.userId }
        isOpen={ isOpen }
        onOpen={ onOpen }
        onOpenChange={ onOpenChange }
      />
    </>
  );
}

ClassCard.propTypes = {
  booking: PropTypes.object,
};
