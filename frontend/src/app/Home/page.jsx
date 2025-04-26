"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, File, FilePlus, FileEdit, FileSearch, 
  FileInput, FileOutput, FileCode, FileImage, FileArchive 
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const texts = useMemo(() => ["Generate Video Reports", "Automate Your Content", "Transform Reports into Visuals"], []);
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef(null);

  // Document configurations
  const documentIcons = [
    { icon: FileText, size: 24, color: "text-emerald-300" },
    { icon: File, size: 28, color: "text-emerald-400" },
    { icon: FilePlus, size: 32, color: "text-emerald-500" },
    { icon: FileEdit, size: 26, color: "text-emerald-300" },
    { icon: FileSearch, size: 30, color: "text-emerald-400" },
    { icon: FileInput, size: 22, color: "text-emerald-200" },
    { icon: FileOutput, size: 28, color: "text-emerald-400" },
    { icon: FileCode, size: 26, color: "text-emerald-300" },
    { icon: FileImage, size: 30, color: "text-emerald-500" },
    { icon: FileArchive, size: 24, color: "text-emerald-400" }
  ];

  const [documents, setDocuments] = useState([]);

  // Initialize documents with random positions
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      const initialDocs = Array(12).fill().map((_, i) => ({
        id: i,
        icon: documentIcons[i % documentIcons.length],
        x: Math.random() * (containerWidth - 100),
        y: Math.random() * (containerHeight - 100),
        rotation: Math.random() * 360,
        xSpeed: (Math.random() - 0.5) * 2,
        ySpeed: (Math.random() - 0.5) * 2,
        rotationSpeed: (Math.random() - 0.5) * 2
      }));
      
      setDocuments(initialDocs);
    }
  }, []);

  // Fixed typing effect with proper cleanup
  useEffect(() => {
    let timeoutId;
    const currentText = texts[index];

    if (charIndex < currentText.length) {
      timeoutId = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100);
    } else {
      timeoutId = setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % texts.length);
        setCharIndex(0);
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, index, texts]);

  // Animation loop for documents (unchanged)
  useEffect(() => {
    if (documents.length === 0 || !containerRef.current) return;

    let animationId;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    function animate() {
      setDocuments(prevDocs => 
        prevDocs.map(doc => {
          let newX = doc.x + doc.xSpeed;
          let newY = doc.y + doc.ySpeed;
          
          if (newX <= 0 || newX >= containerWidth - 50) {
            newX = Math.max(0, Math.min(newX, containerWidth - 50));
            return { ...doc, x: newX, y: newY, xSpeed: -doc.xSpeed, rotation: doc.rotation + doc.rotationSpeed };
          }
          
          if (newY <= 0 || newY >= containerHeight - 50) {
            newY = Math.max(0, Math.min(newY, containerHeight - 50));
            return { ...doc, x: newX, y: newY, ySpeed: -doc.ySpeed, rotation: doc.rotation + doc.rotationSpeed };
          }
          
          return { ...doc, x: newX, y: newY, rotation: doc.rotation + doc.rotationSpeed };
        })
      );
      
      animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [documents.length]);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-black overflow-hidden" ref={containerRef}>
      {/* Background Effects */}
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
          <div className="w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </motion.div>

        {/* Floating Documents */}
        {documents.map((doc) => {
          const IconComponent = doc.icon.icon;
          return (
            <div
              key={doc.id}
              className={`absolute ${doc.icon.color} opacity-70 transition-transform duration-300`}
              style={{
                left: `${doc.x}px`,
                top: `${doc.y}px`,
                transform: `rotate(${doc.rotation}deg)`,
                width: `${doc.icon.size}px`,
                height: `${doc.icon.size}px`,
              }}
            >
              <IconComponent size={doc.icon.size} />
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="relative text-center text-white z-10 px-4">
        <h1 
          aria-live="polite"
          className="text-4xl md:text-6xl font-bold mb-4 min-h-[4rem] md:min-h-[6rem]"
        >
          {displayedText}
          <span className="animate-blink">|</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8">
          Turn your reports into engaging videos effortlessly.
        </p>
        <button 
          className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300"
          onClick={() => router.push("/CreateVid")}
          aria-label="Get started with video creation"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}