import { MdClass, MdGridView, MdPerson, MdWallet } from "react-icons/md";

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

export default function Links() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
