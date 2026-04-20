"use client";

import { Bell, CircleQuestionMark, Home, Mail, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="w-[90%] max-w-[900px] mx-auto my-5 bg-white/70 backdrop-blur-lg border border-green-700/20 rounded-full flex justify-between items-center pl-6 pr-2 py-2 shadow-sm relative z-50">

        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <div className="w-9 h-9 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
            <Home size={16} color="white" />
          </div>
          <span className="font-serif text-xl font-semibold text-green-900 tracking-tight">
            urban <span className="text-green-600">s</span>tayr
          </span>
        </a>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { icon: <Bell size={18} />, label: "Notifications" },
            { icon: <Mail size={18} />, label: "Messages" },
            { icon: <CircleQuestionMark size={18} />, label: "Help" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="relative group text-sm text-gray-600 hover:text-green-900 hover:bg-green-600/10 px-4 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-green-800 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {label}
              </span>
              {icon}
            </button>
          ))}
          <button className="text-sm font-medium text-green-800 border border-green-700/40 hover:bg-green-600/10 px-5 py-1.5 rounded-full transition-colors ml-1 cursor-pointer">
            <Link href="/Rent">Rent</Link>
          </button>
          <button className="text-sm font-medium text-green-800 border border-green-700/40 hover:bg-green-600/10 px-5 py-1.5 rounded-full transition-colors ml-1 cursor-pointer">
            <Link href="/Login">Login</Link>
          </button>
          <button className="text-sm font-medium text-white bg-green-800 hover:bg-green-900 px-5 py-1.5 rounded-full transition-colors ml-0.5 cursor-pointer">
            <Link href="/Signup">Register</Link>
          </button>
        </div>

        {/* Mobile: icon buttons + hamburger */}
        <div className="flex md:hidden items-center gap-1 pr-1">
          <button className="relative group text-gray-600 hover:text-green-900 hover:bg-green-600/10 p-2 rounded-full transition-colors">
            <Bell size={18} />
          </button>
          <button className="relative group text-gray-600 hover:text-green-900 hover:bg-green-600/10 p-2 rounded-full transition-colors">
            <Mail size={18} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-800 hover:bg-green-600/10 p-2 rounded-full transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden w-[90%] max-w-[900px] mx-auto -mt-3 bg-white/90 backdrop-blur-lg border border-green-700/20 rounded-2xl shadow-md z-40 relative overflow-hidden">
          <div className="flex flex-col px-5 py-4 gap-2">
            <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-900 hover:bg-green-50 px-3 py-2.5 rounded-xl transition-colors text-left w-full">
              <CircleQuestionMark size={17} className="text-green-700" />
              <span>Help & Support</span>
            </button>

            <div className="h-px bg-gray-100 my-1" />

            <Link
              href="/Login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center text-sm font-medium text-green-800 border border-green-700/40 hover:bg-green-600/10 px-5 py-2.5 rounded-full transition-colors"
            >
              Login
            </Link>
            <Link
              href="/Signup"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center text-sm font-medium text-white bg-green-800 hover:bg-green-900 px-5 py-2.5 rounded-full transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  );
}