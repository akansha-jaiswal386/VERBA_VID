"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center w-full z-10 fixed bg-black">
      <nav className="relative bg-gradient-to-r from-black to-gray-900 text-white px-6 py-4 w-full shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo with updated color */}
          <Link href="/" className="text-[35px] font-bold text-indigo-400">
            Verbavid
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-lg">
            <li>
              <Link href="/" className="hover:text-indigo-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/About" className="hover:text-indigo-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/Feature" className="hover:text-indigo-400 transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="/Contact" className="hover:text-indigo-400 transition">
                Contact
              </Link>
            </li>
          </ul>

          {/* Desktop Buttons with updated color */}
          <div className="hidden md:flex space-x-4">
            <Link href="/signup">
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden z-10 text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <ul className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-gray-900 rounded-b-lg py-4">
            <li>
              <Link href="/" className="hover:text-indigo-400" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/About" className="hover:text-indigo-400" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/Feature" className="hover:text-indigo-400" onClick={() => setIsOpen(false)}>
                Features
              </Link>
            </li>
            <li>
              <Link href="/Contact" className="hover:text-indigo-400" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </button>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <button
                  className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </button>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
