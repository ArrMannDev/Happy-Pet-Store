import { useState } from "react";
import type { NavItem } from "../type/type";
import { Link, NavLink } from "react-router-dom";
import {
  PawPrint,
  ShoppingCart,
  CircleUserRound,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { supabase } from "../superbase-client";

export default function Navbar({ navLinks }: { navLinks: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();

  const profileImage =
    session?.user?.user_metadata?.avatar_url ||
    session?.user?.user_metadata?.picture;

  const isAdmin = session?.user?.user_metadata?.account_type === "admin";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-full bg-[#E8F3EA] p-2">
            <PawPrint size={32} className="text-[#0c381b]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0c381b]">
            Happy Paws
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.link}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#0c381b] text-white"
                    : "text-gray-700 hover:bg-[#E8F3EA] hover:text-[#0c381b]"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-gray-700 transition hover:bg-[#E8F3EA] hover:text-[#0c381b]"
          >
            <ShoppingCart size={24} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#6F9B75] text-xs font-semibold text-white">
              1
            </span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-full bg-[#0c381b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#14532d]"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-3">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full border-2 border-[#7CA982] object-cover"
                />
              )}

              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-gray-700 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={23} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full p-2 text-gray-700 transition hover:bg-[#E8F3EA] hover:text-[#0c381b]"
            >
              <CircleUserRound size={25} />
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="rounded-lg p-2 text-[#0c381b] transition hover:bg-[#E8F3EA] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-white px-5 py-5 shadow-md md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.link}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium transition ${
                    isActive
                      ? "bg-[#0c381b] text-white"
                      : "text-gray-700 hover:bg-[#E8F3EA] hover:text-[#0c381b]"
                  }`
                }
              >
                {link.title}
              </NavLink>
            ))}

            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-[#E8F3EA] hover:text-[#0c381b]"
            >
              <ShoppingCart size={20} />
              Cart
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-[#E8F3EA] hover:text-[#0c381b]"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            )}

            <div className="mt-3 border-t pt-4">
              {session ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-medium text-red-600 hover:bg-red-100"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0c381b] px-4 py-3 font-medium text-white"
                >
                  <CircleUserRound size={20} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}