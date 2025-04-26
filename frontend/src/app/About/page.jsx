"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaBrain, FaFilm, FaDownload, FaUsers } from "react-icons/fa";

const About= () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Turn Words into Cinematic Magic
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl text-gray-300 mb-8"
        >
          Your imagination, our animation.
        </motion.p>
        <Button className="text-lg px-6 py-3">Try It Now</Button>
      </section>

      {/* What We Do */}
      <section className="py-16 px-6 bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-semibold mb-4">What is Text2Vidz?</h2>
          <p className="text-gray-400 text-lg">
            We turn your scripts into beautiful, AI-generated videos with just a few clicks.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {["Write", "Style", "Generate", "Download"].map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + index * 0.2 }}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">{step}</h3>
              <p className="text-gray-400 text-sm">
                {step === "Write" && "Type your script or idea."}
                {step === "Style" && "Choose a visual style you like."}
                {step === "Generate" && "Let AI create your video."}
                {step === "Download" && "Save and share with the world."}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { icon: <FaBrain />, label: "Smart AI" },
            { icon: <FaFilm />, label: "Creative Styles" },
            { icon: <FaDownload />, label: "Instant Export" },
            { icon: <FaUsers />, label: "Made for Everyone" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 + i * 0.2 }}
              className="bg-gray-800 p-6 rounded-2xl text-center shadow-md"
            >
              <div className="text-3xl mb-3 text-primary">{item.icon}</div>
              <h4 className="text-xl font-semibold text-white">{item.label}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Ready to Create?
        </motion.h2>
        <p className="text-gray-300 mb-6 text-lg">
          Contact us and let’s bring your vision to life.
        </p>
        <Button className="text-lg px-6 py-3">Contact Us</Button>
      </section>
    </div>
  );
};

export default About;