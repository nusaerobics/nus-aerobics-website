"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button
} from "@heroui/react";
import { useState } from "react";

export default function MobileSideBar() {
  const [ isMenuOpen, setIsMenuOpen ] = useState(true);
  const menuItems = [
    "Dashboard",
    "Classes",
    "Wallet",
    "Profile",
    "Log out"
  ];

  return (
    <Navbar onMenuOpenChange={ setIsMenuOpen }>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={ isMenuOpen ? "Close menu" : "Open menu" }
          className="sm:hidden"
        />
        <NavbarBrand>
          <img
            src="/images/logo.png"
            alt="NUS Aerobics"
            width="189"
            height="81"
            className="self-center"
          />
          <p className="font-bold text-inherit">NUS Aerobics</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={ Link } color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        { menuItems.map((item, index) => (
          <NavbarMenuItem key={ `${ item }-${ index }` }>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              { item }
            </Link>
          </NavbarMenuItem>
        )) }
      </NavbarMenu>
    </Navbar>
  );
}
