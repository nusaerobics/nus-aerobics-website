"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdClass,
  MdGridView,
  MdLogout,
  MdPerson,
  MdWallet,
} from "react-icons/md";
import clsx from "clsx";
import Logo from "../Logo";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: MdGridView },
  {
    name: "Classes",
    href: "/dashboard/classes",
    icon: MdClass,
  },
  { name: "Wallet", href: "/dashboard/wallet", icon: MdWallet },
  { name: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

export default function NavBar() {
  const pathname = usePathname();
  const handleLogout = () => {
    // TODO: Handle authentication, session, etc. here on logout
    return;
  };

  return (
    <div className="h-full flex flex-col py-10 px-5 gap-y-10 md:px-2">
      <Logo />
      <div className="flex flex-row grow justify-between md:flex-col md:space-x-0 md:space-y-2">
        <div className="flex flex-row md:flex-col gap-y-2.5">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  // TODO: Fix the MD versions
                  "flex flex-row justify-center items-center gap-x-2.5 h-[50px] rounded-[10px] text-[#393E46] bg-white p-2.5 hover:bg-[#1F477610] hover:text-[#1F4776] md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-[#1F477620] text-[#1F4776]": pathname === link.href,
                  }
                )}
                style={{ textDecoration: "none" }}
              >
                <LinkIcon
                  className={clsx("w-[30px]", {
                    "text-[#1F4776]": pathname === link.href,
                  })}
                />
                <p
                  className={clsx("font-poppins hidden md:block", {
                    "font-bold text-[#1F4776]": pathname === link.href,
                  })}
                  style={{ cursor: "auto" }}
                >
                  {link.name}
                </p>
              </Link>
            );
          })}
        </div>
        <Link
          href="/login"
          className="flex flex-row justify-center items-center gap-x-2.5 h-[50px] rounded-[10px] text-[#393E46] bg-white p-2.5 hover:bg-red-200 hover:text-red-500 md:flex-none md:justify-start md:p-2 md:px-3"
          style={{ textDecoration: "none" }}
          onClick={handleLogout}
        >
          <MdLogout className="w-[30px]" />
          <p className="font-poppins hidden md:block">Log out</p>
        </Link>
      </div>
    </div>
  );
}
