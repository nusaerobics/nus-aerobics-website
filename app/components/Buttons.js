export const PrimaryButton = ({ label }) => {
  return (
    <button className="rounded-[30px] px-[20px] py-[10px] bg-[#1F4776] text-white">
      {label}
    </button>
  );
}

export const SecondaryButton = ({ label }) => {
  return (
    <button className="rounded-[30px] px-[20px] py-[10px] bg-[#1F477610] text-[#1F4776]">
      {label}
    </button>
  );
}
