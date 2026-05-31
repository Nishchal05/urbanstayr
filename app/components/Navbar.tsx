"use client";

import {
  Bell,
  CircleQuestionMark,
  Home,
  LayoutDashboardIcon,
  Mail,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PlacesInput from "@/app/components/PlacesInput";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setrole] = useState("");
  const [displaydashboard, setdisplaydashboard] = useState(false);
  const [location, setLocation] = useState("");
  const [id,setid]=useState("");
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(false);
      router.push("/login");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const getuserrole = async () => {
    try {
      const res = await axios.get("/api/auth/userrole");
      setrole(res.data.role);
      setid(res.data.userId);
      console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch role:", error);
    }
  };

  useEffect(() => {
    getuserrole();
  }, []);

  return (
    <>
      <nav className="w-[90%] max-w-[950px] mx-auto my-5 bg-white/70 backdrop-blur-lg border border-green-700/20 rounded-full flex justify-between items-center pl-6 pr-6 py-2 shadow-sm relative z-50">
        {/* Brand & Search */}
        <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-green-800 rounded-full flex items-center justify-center">
              <Home size={16} color="white" />
            </div>

            <span className="font-serif text-xl font-semibold text-green-900 tracking-tight hidden sm:block">
              urban <span className="text-green-600">s</span>tayr
            </span>
          </Link>

          <div className="flex flex-1 max-w-[320px] items-center bg-white/50 border border-green-700/30 hover:border-green-800 rounded-full px-3 py-1 transition-colors min-w-0">
            <svg
              className="text-green-800 shrink-0 hidden sm:block mr-2"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9L12 15L18 9" />
            </svg>

            <div className="flex-1">
              <PlacesInput
                value={location}
                onChange={setLocation}
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { icon: <Bell size={18} />, label: "Notifications" },
            { icon: <Mail size={18} />, label: "Messages" },
            { icon: <CircleQuestionMark size={18} />, label: "Help" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="relative group text-sm text-gray-600 hover:text-green-900 hover:bg-green-600/10 px-4 py-1.5 rounded-full transition-colors"
            >
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-green-800 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>

              {icon}
            </button>
          ))}

          {role === "partner" && (
            <div
              className="relative"
              onMouseEnter={() => setdisplaydashboard(true)}
              onMouseLeave={() => setdisplaydashboard(false)}
            >
              <Link
                href={`/partner/dashboard?id=${id}`}
                className="text-sm font-medium text-green-800 border border-green-700/40 hover:bg-green-600/10 px-4 py-2 rounded-full ml-1 flex items-center justify-center"
              >
                <LayoutDashboardIcon size={18} />
              </Link>

              {displaydashboard && (
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-green-800 px-3 py-1.5 text-xs text-white">
                  Dashboard
                </span>
              )}
            </div>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 border border-red-700/40 hover:bg-red-600/10 px-5 py-1.5 rounded-full ml-1"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/Login"
                className="text-sm font-medium text-green-800 border border-green-700/40 hover:bg-green-600/10 px-5 py-1.5 rounded-full ml-1"
              >
                Login
              </Link>

              <Link
                href="/Signup"
                className="text-sm font-medium text-white bg-green-800 hover:bg-green-900 px-5 py-1.5 rounded-full ml-0.5"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-1 pr-1 shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-green-100"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden w-[90%] max-w-[900px] mx-auto -mt-3 bg-white/90 border rounded-2xl shadow-md">
          <div className="flex flex-col px-5 py-4 gap-3">
            {role === "partner" && (
              <Link
                href="/partner/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <LayoutDashboardIcon size={18} />
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-white bg-red-600 px-5 py-2.5 rounded-full"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/Login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/Signup" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}