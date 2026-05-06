import { useState } from "react";
import type { NavItem } from "../type/type";
import { Link } from "react-router-dom";
import { PawPrint, ShoppingCart, CircleUserRound, Menu, X } from "lucide-react";

export default function Navbar({ navLinks }: { navLinks: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-2xl">
      <div className="w-full flex justify-between items-center p-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <PawPrint size={45} className="text-[#0c381b]" />
          <span className="text-[#0c381b] text-2xl font-semibold">
            Happy Paws
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Right Icons (Desktop only) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={28} />
            <p className="absolute -top-1 -right-2 text-xs border rounded-full px-1 bg-[#6F9B75] text-white">
              1
            </p>
          </Link>

          {/* Login */}
          <Link to="/login">
            <CircleUserRound size={28} />
          </Link>
        </div>

        {/* Burger Menu (Mobile only) */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col items-center gap-4 py-5 border-t bg-white">
          {/* Nav Links */}
          {navLinks.map((link, key) => (
            <Link
              to={link.link}
              key={key}
              onClick={() => setOpen(false)}
              className="text-lg hover:text-[#7CA982]"
            >
              {link.title}
            </Link>
          ))}

          {/* Cart (Mobile) */}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-lg"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
          </Link>

          {/* Login (Mobile) */}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-lg"
          >
            <CircleUserRound size={20} />
            <span>Login</span>
          </Link>
        </div>
      )}
    </div>
  );
}
