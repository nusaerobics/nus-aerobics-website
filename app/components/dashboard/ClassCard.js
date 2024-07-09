import PrimaryButton from "../PrimaryButton";

export default function ClassCard({ name, date }) {
  return (
    <div className="flex flex-col gap-y-2.5 p-2.5 rounded-[20px] border-l-[4px] border-l-[#1F4776] bg-[#1F477610] text-[#393E46]">
      <div className="flex flex-col">
        <p className="font-bold">{name ? name : "Class name"}</p>
        <p>{date ? date : "Day, DD Month YYYY"}</p>
        <p>NUS UTown Gym</p>
      </div>
      <div className="flex justify-end">
        <PrimaryButton label="View details" />
      </div>
    </div>
  );
}
