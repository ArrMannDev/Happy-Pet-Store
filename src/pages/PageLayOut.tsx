import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import type { NavItem } from "../type/type";

export default function PageLayOut() {
  const navLinks: NavItem[] = [
    { title: "Home", link: "/" },
    { title: "Categories", link: "/categories" },
    { title: "Deals", link: "/deals" },
    { title: "About", link: "/about" },
  ];
  return (
    <div>
      <Navbar navLinks={navLinks} />
      <Outlet />
    </div>
  );
}
