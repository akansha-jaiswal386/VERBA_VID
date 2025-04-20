"use client";
import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const texts = ["Generate Video Reports", "Automate Your Content", "Transform Reports into Visuals"];
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < texts[index].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + texts[index][charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, 2000);
    }
  }, [charIndex, index, texts]);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-black ">
      
      {/* Background Effects - Wrap Inside a Div with Limited Height */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div 
          className="w-full h-full bg-gradient-to-r from-emerald-600 to-black opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute inset-0 flex justify-center items-center opacity-20"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <div className="w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
      
      <div className="relative text-center text-white z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{displayedText}|</h1>
        <p className="text-lg md:text-2xl text-gray-300">Turn your reports into engaging videos effortlessly.</p>
        <button className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
         onClick={() => router.push("/CreateVid")}>
          Get Started
        </button>
      </div>
      
      {/* Ensure Next Component Doesn't Overlap Blur */}
      <div className="relative w-full h-0"></div>
    </div>
  );
}
