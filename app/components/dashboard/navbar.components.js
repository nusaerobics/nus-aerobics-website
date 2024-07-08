import { Icon } from "@chakra-ui/react";
import { MdClass, MdGridView, MdPerson, MdWallet } from "react-icons/md";
// import { Link } from "react-router-dom";
// import styles from "./styles/navbar.module.css";

const NavBar = () => {
  return (
    <div className="h-screen w-1/4 flex flex-col p-5 border border-[#393E4610]">
      <p>NUS Aerobics</p>
      <div>
        <Icon as={MdGridView} />
        {/* TODO: Change this to changing what's being displayed rather than new page */}
        {/* <Link to="/" className="font-poppins">
          Dashboard
        </Link> */}
      </div>
      <div className="flex flex-row items-center gap-x-2.5">
        <Icon as={MdClass} />
        {/* <Link to="/classes" className="font-poppins">
          Classes
        </Link> */}
      </div>
      <div className="flex flex-row items-center gap-x-2.5">
        <Icon as={MdWallet} />
        {/* <Link to="/wallet" className="font-poppins">
          Wallet
        </Link> */}
      </div>
      <div className="flex flex-row items-center gap-x-2.5">
        <Icon as={MdPerson} />
        {/* <Link to="/profile" className="font-poppins">
          narasmith
        </Link> */}
      </div>
    </div>
  );
};

export default NavBar;
