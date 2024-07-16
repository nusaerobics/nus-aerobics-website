import PropTypes from "prop-types";
import { MdOutlineCalendarMonth, MdOutlineLocationOn, MdPersonOutline } from "react-icons/md";

export default function AdminClassDetails({
  selectedClass
}) {
  return (
    <>
    <div className="flex flex-col gap-y-2.5">
        <div className="flex flex-row items-center gap-2.5">
          <MdOutlineCalendarMonth size={24} color={"#1F4776"} />
          <p>{selectedClass.date}</p>
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
};

AdminClassDetails.propTypes = {
  selectedClass: PropTypes.object,
};
