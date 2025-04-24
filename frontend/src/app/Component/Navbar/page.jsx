"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center bg-black w-full z-10 fixed">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 opacity-80 w-full"></div>

      <nav className="relative bg-gradient-to-r from-black to-gray-800 text-white p-4 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-[35px] font-bold">Verbavid</Link>

          <ul className="hidden md:flex space-x-6">
            <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
            <li><a href="#about" className="hover:text-gray-400">About</a></li>
            <li><Link href="/Feature" className="hover:text-gray-400">Features</Link></li>
            <li><Link href="/Contact" className="hover:text-gray-400">Contact</Link></li>
          </ul>

          <div className="hidden md:flex space-x-4">
            <Link href="/signup">
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">Sign Up</button>
            </Link>
            <Link href="/login">
              <button className="border border-emerald-500 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-white">Login</button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden flex flex-col items-center space-y-4 mt-4">
            <li><Link href="/" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link href="/about" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>About</Link></li>
            <li><Link href="/features" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>Features</Link></li>
            <li><Link href="/contact" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>Contact</Link></li>
            <li>
              <Link href="/signup">
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600" onClick={() => setIsOpen(false)}>Sign Up</button>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <button className="border border-emerald-500 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-white" onClick={() => setIsOpen(false)}>Login</button>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
