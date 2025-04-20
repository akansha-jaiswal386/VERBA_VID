"use client"
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-emerald-900 text-white py-10 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ amount: 0.2 }}
        >
          <h2 className="text-2xl font-semibold">About Us</h2>
          <p className="text-gray-300 mt-2">
            We provide AI-powered video creation solutions to help people produce high-quality videos effortlessly.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }} 
          viewport={{ amount: 0.2 }}
        >
          <h2 className="text-2xl font-semibold">Quick Links</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="hover:text-emerald-300 transition">Home</a></li>
            <li><a href="/about" className="hover:text-emerald-300 transition">About</a></li>
            <li><a href="/Feature" className="hover:text-emerald-300 transition">Features</a></li>
            <li><a href="/Contact" className="hover:text-emerald-300 transition">Contact</a></li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }} 
          viewport={{ amount: 0.2 }}
        >
          <h2 className="text-2xl font-semibold">Follow Us</h2>
          <div className="flex justify-center md:justify-start gap-4 mt-3">
            <a href="#" className="hover:text-emerald-300 transition"><Facebook size={24} /></a>
            <a href="#" className="hover:text-emerald-300 transition"><Twitter size={24} /></a>
            <a href="#" className="hover:text-emerald-300 transition"><Instagram size={24} /></a>
            <a href="#" className="hover:text-emerald-300 transition"><Linkedin size={24} /></a>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Verbavid. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
