import PropTypes from "prop-types";
import {
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
  MdPersonOutline,
} from "react-icons/md";
import { format } from "date-fns";
import { SectionTitle } from "../Titles";

export default function AdminClassDetails({ selectedClass, toggleIsEdit }) {
  return (
    <>
      <div className="flex flex-row justify-between">
        <SectionTitle title="Class details" />
        <button
          onClick={toggleIsEdit}
          className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm" // PREVIOUSLY: py-[10px]
        >
          Edit class
        </button>
      </div>
      <div className="flex flex-col gap-y-2.5">
        <div className="flex flex-row items-center gap-2.5">
          <MdOutlineCalendarMonth size={24} color={"#1F4776"} />
          <p>{format(selectedClass.date, "d/MM/y HH:mm")}</p>
        </div>
        <div className="flex flex-row items-center gap-2.5">
          <MdOutlineLocationOn size={24} color={"#1F4776"} />
          <p>UTown Gym Aerobics Studio</p>
        </div>
        <div className="flex flex-row items-center gap-2.5">
          <MdPersonOutline size={24} color={"#1F4776"} />
          <p>Alpha Fitness</p>
        </div>
      </div>
      <p>{selectedClass.description}</p>
    </>
  );
}

AdminClassDetails.propTypes = {
  selectedClass: PropTypes.object,
};
