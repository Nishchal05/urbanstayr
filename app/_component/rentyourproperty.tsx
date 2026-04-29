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
    { id: "search", label: "Search Property", icon: <SearchIcon />, desc: "Find your dream property from thousands of listings", link: "/Rent/search" },
    { id: "sell",   label: "Sell Property",   icon: <HomeIcon />,    desc: "List your property and reach thousands of buyers",  link: "/Rent/sell"   },
    { id: "buy",    label: "Buy Property",    icon: <BuildingIcon />,desc: "Browse verified properties ready for purchase",      link: "/Rent/buy"    },
    { id: "pg",     label: "PG / Hostel",     icon: <MapPinIcon />,  desc: "Discover or list PG accommodations near you",       link: "/Rent/pg"     },
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

      {/* Hero */}
     

      {/* Cards */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MAIN_OPTIONS.map((opt) => (
            <Link
              key={opt.id}
              href={opt.link}
              onClick={() => setMainOption(opt.id)}
              className="group flex flex-col gap-4 rounded-2xl p-6 no-underline transition-all duration-300 bg-white"
              style={{
                border: "1px solid #e8f0da",
                borderRadius: 20,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#639922";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(99,153,34,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e8f0da";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{ background: "#f0f7e6", color: "#639922", borderRadius: 14 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#639922";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
              >
                {opt.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#0f1a06", letterSpacing: "-0.01em" }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: 14, color: "#888780", lineHeight: 1.5 }}>
                  {opt.desc}
                </span>
              </div>

              {/* Arrow */}
              <div
                className="self-end w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mt-4 group-hover:bg-[#639922] group-hover:text-white group-hover:border-[#639922]"
                style={{ border: "1px solid #e8f0da", color: "#c0dd97" }}
              >
                <ChevronIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>

      
    </div>
  );
}