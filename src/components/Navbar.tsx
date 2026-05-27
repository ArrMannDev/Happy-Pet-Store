import { useState } from "react";
import type { NavItem } from "../type/type";
import { Link } from "react-router-dom";
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
    <div className="sticky top-0 z-50 w-full bg-white shadow-2xl">
      <div className="w-full flex justify-between items-center p-5">
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

        {/* Right Icons Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/cart" className="relative">
            <ShoppingCart size={28} />
            <p className="absolute -top-1 -right-2 text-xs border rounded-full px-1 bg-[#6F9B75] text-white">
              1
            </p>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-3">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
              )}

              <LogOut size={28} onClick={handleLogout} />
            </div>
          ) : (
            <Link to="/login">
              <CircleUserRound size={28} />
            </Link>
          )}
        </div>

        {/* Burger Menu Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col items-center gap-4 py-5 border-t bg-white">
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

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-lg"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
          </Link>

          {session ? (
            <div className="flex flex-col items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-lg hover:text-[#7CA982]"
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
              )}

              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-lg hover:text-[#7CA982]"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              {session ? (
                <LogOut size={28} onClick={handleLogout} />
              ) : (
                <CircleUserRound size={28} />
              )}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
