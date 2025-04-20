"use client";

import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="w-full min-h-screen py-20 px-8 bg-emerald-100 text-gray-900">
      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="text-5xl font-bold text-center mb-12"
      >
        About 
      </motion.h1>

      {/* Who We Are Section */}
      <div className="max-w-5xl mx-auto mb-16 border-b border-gray-300 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-3xl font-semibold text-center mb-6 text-emerald-400"
        >
          Who We Are
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-lg text-center text-gray-700 max-w-4xl mx-auto leading-relaxed"
        >
          At <span className="text-emerald-600 font-semibold">Verbavid</span>, we are redefining video creation through AI. Our tools empower businesses, creators, and educators to produce high-quality videos effortlessly—no technical skills required.
        </motion.p>
      </div>

      {/* Our Purpose Section */}
      <div className="max-w-5xl mx-auto mb-16 border-b border-gray-300 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-3xl font-semibold text-center mb-6 text-emerald-400"
        >
          Our Purpose
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-lg text-center text-gray-700 max-w-3xl mx-auto"
        >
          We believe in <span className="font-semibold text-gray-900">simplifying content creation</span> through AI. Our goal is to <span className="font-semibold text-gray-900">make video production accessible</span> for everyone, enabling powerful storytelling with minimal effort.
        </motion.p>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-5xl mx-auto mb-16 border-b border-gray-300 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-3xl font-semibold text-center mb-6 text-emerald-400"
        >
          Why Choose Us?
        </motion.h2>
        <motion.ul
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-lg text-center text-gray-700 max-w-3xl mx-auto space-y-2"
        >
          <li>✅ AI-powered video creation</li>
          <li>✅ High-quality 4K exports</li>
          <li>✅ Instant editing with live preview functionality</li>
          <li>✅ Convert Text in to natural sounding speech</li>
          <li>✅ Customizable templates & themes</li>
        </motion.ul>
      </div>

      {/* Call to Action Section */}
      <div className="text-center">
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: false, amount: 0.2 }}
          href="/Feature"
          className="px-6 py-3 bg-emerald-600 rounded-lg text-white text-lg font-semibold hover:bg-emerald-700 transition duration-300"
        >
          Explore Our Features
        </motion.a>
      </div>
    </section>
  );
};

export default About;
