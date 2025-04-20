"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section className="w-full min-h-screen bg-emerald-400 py-20 px-6 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        {/* Section Title */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-gray-900"
        >
          Contact Us
        </motion.h1>

        {/* Contact Info */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-center text-gray-700"
        >
          We’d love to hear from you! Feel free to reach out.
        </motion.p>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-col md:flex-row justify-around text-gray-800"
        >
          <div className="flex items-center space-x-3">
            <Mail size={24} />
            <p>verbavid386@gmail.com</p>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={24} />
            <p>+91 1234567890</p>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin size={24} />
            <p>BBD University, Lucknow, India</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition duration-300"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
