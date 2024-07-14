import { PrimaryButton } from "../Buttons";

export default function ClassCard({ name, date }) {
  return (
    <div className="flex flex-col gap-y-2.5 p-2.5 rounded-[20px] border-l-[4px] border-l-[#1F4776] bg-[#1F477610] text-[#393E46]">
      <div className="flex flex-col">
        <p className="font-bold text-base">{name ? name : "Class name"}</p>
        <p className="text-sm">{date ? date : "Day, DD Month YYYY"}</p>
        <p className="text-sm">NUS UTown Gym</p>
      </div>
      <div className="flex justify-end">
        {/* TODO: On clicking button, open modal similar to one in Classes with the details */}
        <PrimaryButton label="View details" />
      </div>
    </div>
  );
}
