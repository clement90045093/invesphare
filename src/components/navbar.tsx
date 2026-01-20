"use client";

import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { useAuthStore } from "@/store/AuthStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const  {user, logout, authState}  =  useAuthStore((state)=>state)
  
useEffect(()=>{

authState();

  }, [])

console.log(user)
  const links = [
    { name: "Portfolio", href: "/dashboard" },
    { name: "Learn", href: "#" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ===== Logo Section ===== */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <FaChartLine className="text-white text-lg" />
          </div>
          <span className="text-lg md:text-xl font-semibold text-gray-800">
            InvestSphere
          </span>
        </Link>

        {/* ===== Desktop Links ===== */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
            <div className="">
          {user ? <button onClick={()=>{logout()}}>Logout</button> : <button><a href="/login">Login</a></button>}
        </div>
        </div>

        {/* ===== Mobile Menu Button ===== */}
        <button
          className="md:hidden text-2xl text-gray-700 hover:text-emerald-600 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* ===== Mobile Menu ===== */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-3 space-y-3 text-[15px] font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="">
          {user ? <button onClick={()=>logout()}>Logout</button> : <button><a href="/login">Login</a></button>}
        </div>
      </div>
    </nav>
  );
}
