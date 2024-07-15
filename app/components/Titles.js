export const PageTitle = ({ title }) => {
  return (
    <p className="font-poppins font-bold text-[40px] text-[#1F4776]">{title}</p>
  );
}

export const SectionTitle = ({ title }) => {
  return (
    // NOTE: Changed the font to 20px from 24px
    <p className="font-poppins font-bold text-xl text-[#1F4776]">{title}</p>
  );
}
