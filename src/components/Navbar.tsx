import type { NavItem } from "../type/type";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { CircleUserRound } from "lucide-react";

export default function Navbar({ navLinks }: { navLinks: NavItem[] }) {
  return (
    <div className="sticky w-full flex justify-center top-0 z-1">
      <div className="w-full flex flex-row justify-between items-center p-2 shadow-2xl">
        <div className="flex flex-row items-center p-2 gap-2">
          <PawPrint size={50} className="text-[#0c381b]" />
          <span className="text-[#0c381b] text-3xl">Happy Paws</span>
        </div>

        <nav className="flex flex-row items-center justify-center gap-4">
          {navLinks.map((link, key) => (
            <Link
              to={link.link}
              key={key}
              className="hover:border-b-4 border-b-[#7CA982]"
            >
              <p className="text-md">{link.title}</p>
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-center gap-10">
          <div className="flex items-center justify-center relative">
            <ShoppingCart size={30} />
            <p className="absolute -top-1 -right-1 text-xs border rounded-full px-1 bg-[#6F9B75] text-white">
              1
            </p>
          </div>
          <CircleUserRound size={30} />
        </div>
      </div>
    </div>
  );
}
