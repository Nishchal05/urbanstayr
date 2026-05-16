"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function RentYourProperty() {
  type MainOption = "search" | "sell" | "buy" | "pg";
  const [mainOption, setMainOption] = useState<MainOption | null>(null);

  const SearchIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
  const HomeIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
  const BuildingIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16M3 21h18M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
    </svg>
  );
  const MapPinIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
  const ChevronIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
    </svg>
  );
  const ShieldIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );

  const MAIN_OPTIONS: {
    id: MainOption;
    label: string;
    icon: React.ReactElement;
    desc: string;
    link: string;
  }[] = [
    { id: "sell",   label: "Sell Property",   icon: <HomeIcon />,    desc: "List your property and reach thousands of buyers",  link: "/rent/sell"   },
    { id: "buy",    label: "Buy Property",    icon: <BuildingIcon />,desc: "Browse verified properties ready for purchase",      link: "/rent/buy"    },
    { id: "pg",     label: "PG / Hostel",     icon: <MapPinIcon />,  desc: "Discover or list PG accommodations near you",       link: "/rent/pg"     },
  ];

  const stats = [
    { num: "12k+", label: "Properties listed" },
    { num: "98%",  label: "Verified owners"   },
    { num: "50+",  label: "Cities covered"    },
  ];

  return (
    <div
      className="bg-white relative overflow-hidden py-16 sm:py-24"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "#f0f7e6", filter: "blur(60px)", opacity: 0.6 }} />
      <div className="absolute bottom-10 -left-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "#f0f7e6", filter: "blur(60px)", opacity: 0.4 }} />

      

      {/* Cards */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {MAIN_OPTIONS.map((opt) => (
            <Link
              key={opt.id}
              href={opt.link}
              onClick={() => setMainOption(opt.id)}
              className="group flex flex-col items-center text-center gap-4 rounded-[24px] p-8 transition-all duration-300 bg-white border border-[#e8f0da] hover:border-[#639922] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,153,34,0.12)]"
            >
              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-300 bg-[#f0f8e8] text-[#639922] group-hover:bg-[#639922] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#639922]/30 mb-2">
                <div className="scale-125">{opt.icon}</div>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[20px] font-bold text-[#0f1a06] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {opt.label}
                </h3>
                <p className="text-[14px] text-[#7a9460] leading-relaxed px-2">
                  {opt.desc}
                </p>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mt-4 border border-[#e8f0da] text-[#97c459] group-hover:bg-[#639922] group-hover:text-white group-hover:border-[#639922] group-hover:scale-110">
                <ChevronIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>

      
    </div>
  );
}