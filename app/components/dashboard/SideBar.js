"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdClass,
  MdGridView,
  MdLogout,
  MdPerson,
  MdWallet,
  MdGroup,
} from "react-icons/md";
import clsx from "clsx";
import { useEffect, useState } from "react";

const userLinks = [
  { name: "Dashboard", href: "/dashboard", icon: MdGridView },
  {
    name: "Classes",
    href: "/dashboard/classes",
    icon: MdClass,
  },
  { name: "Wallet", href: "/dashboard/wallet", icon: MdWallet },
  { name: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

const adminLinks = [
  { name: "Dashboard", href: "/dashboard", icon: MdGridView },
  {
    name: "Classes",
    href: "/dashboard/classes",
    icon: MdClass,
  },
  { name: "Users", href: "/dashboard/users", icon: MdGroup },
  { name: "Wallet", href: "/dashboard/wallet", icon: MdWallet },
  { name: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

export default function SideBar({ user }) {
  const router = useRouter();

  useEffect(() => {
    const permission = user.permission;
    setIsAdmin(permission == "admin");
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.push("/");
        // router.push("/login");
        return;
      }
      throw new Error("Unable to logout");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {isAdmin ? (
        <div className="h-full flex flex-col py-10 px-5 gap-y-10 md:px-2">
          <img
            src="/images/logo.png"
            alt="NUS Aerobics"
            width="189"
            height="81"
            className="self-center"
          />
          <div className="flex flex-row grow justify-between md:flex-col md:space-x-0 md:space-y-2">
            <div className="flex flex-row md:flex-col gap-y-2.5">
              {adminLinks.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      // TODO: Fix the MD versions - for phones
                      "flex flex-row justify-center items-center gap-x-2.5 h-[50px] rounded-[10px] text-[#393E46] bg-white p-2.5 hover:bg-[#1F477610] hover:text-[#1F4776] md:flex-none md:justify-start md:p-2 md:px-3",
                      {
                        "bg-[#1F477620] text-[#1F4776]": pathname === link.href,
                      }
                    )}
                    style={{ textDecoration: "none" }}
                  >
                    <LinkIcon
                      className={clsx("w-[24px]", {
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
              href="/"
              // href="/login"
              className="flex flex-row justify-center items-center gap-x-2.5 h-[50px] rounded-[10px] text-[#393E46] bg-white p-2.5 hover:bg-red-200 hover:text-red-500 md:flex-none md:justify-start md:p-2 md:px-3"
              style={{ textDecoration: "none" }}
              onClick={handleLogout}
            >
              <MdLogout className="w-[24px]" />
              <p className="hidden md:block">Log out</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col py-10 px-5 gap-y-10 md:px-2">
          <img
            src="/images/logo.png"
            alt="NUS Aerobics"
            width="189"
            height="81"
            className="self-center"
          />
          <div className="flex flex-row grow justify-between md:flex-col md:space-x-0 md:space-y-2">
            <div className="flex flex-row md:flex-col gap-y-2.5">
              {userLinks.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      // TODO: Fix the MD versions - for phones
                      "flex flex-row justify-center items-center gap-x-2.5 h-[50px] rounded-[10px] text-[#393E46] bg-white p-2.5 hover:bg-[#1F477610] hover:text-[#1F4776] md:flex-none md:justify-start md:p-2 md:px-3",
                      {
                        "bg-[#1F477620] text-[#1F4776]": pathname === link.href,
                      }
                    )}
                    style={{ textDecoration: "none" }}
                  >
                    <LinkIcon
                      className={clsx("w-[24px]", {
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
              href="/"
              // href="/login"
              className="flex flex-row justify-center items-center gap-x-2.5 h-[50px] rounded-[10px] text-[#393E46] bg-white p-2.5 hover:bg-red-200 hover:text-red-500 md:flex-none md:justify-start md:p-2 md:px-3"
              style={{ textDecoration: "none" }}
              onClick={handleLogout}
            >
              <MdLogout className="w-[24px]" />
              <p className="hidden md:block">Log out</p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
