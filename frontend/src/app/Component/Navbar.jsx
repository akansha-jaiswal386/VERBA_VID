"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";




export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Or use cookies if preferred
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token or session data
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <div className="flex flex-col justify-center bg-black w-full z-10 fixed">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 opacity-80 w-full"></div>

      <nav className="relative bg-gradient-to-r from-black to-gray-800 text-white p-4 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-[35px] font-bold">Verbavid</Link>

          <ul className="hidden md:flex space-x-6">
            <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link href="/Ab" className="hover:text-gray-400">About</Link></li>
            <li><Link href="Features" className="hover:text-gray-400">Features</Link></li>
            <li><Link href="Contact" className="hover:text-gray-400">Contact</Link></li>
          </ul>

          <div className="hidden md:flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">Profile</button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">Sign Up</button>
                </Link>
                <Link href="/login">
                  <button className="border border-emerald-500 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-white">Login</button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden z-10" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <ul className="md:hidden flex flex-col items-center space-y-4 mt-4">
            <li><Link href="/" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link href="/About" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>About</Link></li>
            <li><Link href="/Features" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>Features</Link></li>
            <li><Link href="/Contact" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>Contact</Link></li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/profile">
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600" onClick={() => setIsOpen(false)}>Profile</button>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signup">
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600" onClick={() => setIsOpen(false)}>Sign Up</button>
                  </Link>
                </li>
                <li>
                  <Link href="/Login">
                    <button className="border border-emerald-500 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-white" onClick={() => setIsOpen(false)}>Login</button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
    </div>
  );
}
