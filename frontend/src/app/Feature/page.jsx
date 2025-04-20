"use client"; // Ensures this runs only on the client-side

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  { title: "AI-Powered Video Creation", description: "Generate stunning videos from text input effortlessly.", icon: <CheckCircle size={40} /> },
  { title: "Customizable Templates", description: "Choose from a variety of sleek and professional templates.", icon: <CheckCircle size={40} /> },
  { title: "•	Easy Sharing & Downloading", description: "Download videos in multiple resolutions, including 4K.", icon: <CheckCircle size={40} /> },
  { title: "Real-time Editing", description: "Edit and preview changes instantly before finalizing.", icon: <CheckCircle size={40} /> },
  { title: "Automated Voice Narration", description: "Convert text into natural-sounding speech.", icon: <CheckCircle size={40} /> },
  { title: "Fast Rendering Speed", description: "Experience lightning-fast video rendering using AI.", icon: <CheckCircle size={40} /> },
];

const Features = () => {
  return (
    <div className="w-full min-h-screen bg-emerald-300 text-white py-20 px-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.2 }} 
        className="text-4xl font-bold text-center mb-12 text-emerald-800"
      >
        Our Features
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ amount: 0.2 }}
            className="p-6 bg-emerald-800 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="text-emerald-300 mb-4">{feature.icon}</div>
            <h2 className="text-2xl font-semibold">{feature.title}</h2>
            <p className="text-gray-200 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
