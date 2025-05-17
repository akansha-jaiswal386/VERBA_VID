"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, FileText, Wand2, Download, Star, Youtube, Instagram, Facebook, Share2, Twitter, Music } from "lucide-react";

// Constants
const TEMPLATES = [
  { id: "modern", name: "Modern", description: "Clean, modern look with animations", icon: "✨" },
  { id: "minimal", name: "Minimal", description: "Simple, elegant design", icon: "🎨" },
  { id: "vibrant", name: "Vibrant", description: "Colorful and energetic style", icon: "🎭" }
];

const ORIENTATIONS = [
  { id: "portrait", name: "Portrait", description: "Vertical 9:16", icon: "📱" },
  { id: "landscape", name: "Landscape", description: "Horizontal 16:9", icon: "🖥️" },
  { id: "square", name: "Square", description: "1:1 Ratio", icon: "📐" }
];

const VIDEO_LENGTHS = [
  { id: "short", name: "Short", description: "~2 seconds per caption", icon: "⏱️" },
  { id: "medium", name: "Medium", description: "~2.5 seconds per caption", icon: "⏲️" },
  { id: "long", name: "Long", description: "~3 seconds per caption", icon: "🕰️" }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// MAIN COMPONENT
export default function TikTokVideoGenerator() {
  const { user, token } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [captions, setCaptions] = useState([]);
  
  const [videoDuration, setVideoDuration] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedOrientation, setSelectedOrientation] = useState("portrait");
  const [selectedLength, setSelectedLength] = useState("medium");
  const [videoKey, setVideoKey] = useState(Date.now());
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [rating, setRating] = useState(0);

  const videoRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const speechEndTimeRef = useRef(null);

  // Setup speech synthesis
  useEffect(() => {
    if ("speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      if (!videoElement) return;
      const timeLeft = videoElement.duration - videoElement.currentTime;
      if ((timeLeft < 1) || (speechEndTimeRef.current && videoElement.currentTime >= speechEndTimeRef.current)) {
        speechSynthesisRef.current?.cancel();
      }
    };

    videoElement?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoPath]);

  const handleVideoPlay = () => {
    if (!captions.length || !speechSynthesisRef.current || !videoRef.current) return;
    speechSynthesisRef.current.cancel();

    const duration = videoRef.current.duration || 0;
    speechEndTimeRef.current = duration * 0.95;

    const text = captions.join(". ");
    const totalChars = text.length;
    const estimatedSeconds = totalChars / 15;
    const availableTime = duration - 1;
    let rate = 1;

    if (estimatedSeconds > availableTime) {
      rate = Math.min(2.0, Math.max(0.8, estimatedSeconds / availableTime));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    speechSynthesisRef.current.speak(utterance);
  };

  const handleVideoPause = () => {
    speechSynthesisRef.current?.pause();
  };

  const handleVideoEnded = () => {
    speechSynthesisRef.current?.cancel();
  };

  const handleVideoError = () => {
    console.error("Video playback error");
    setVideoKey(Date.now());
    setTimeout(() => videoRef.current?.load(), 500);
  };

  const handleVideoMetadata = () => {
    const duration = videoRef.current?.duration || 0;
    setVideoDuration(duration);
  };

  const handleClear = () => {
    setPrompt("");
    setDocumentFile(null);
    setVideoPath("");
    setCaptions([]);
    setError("");
    setNotification("");
    speechSynthesisRef.current?.cancel();
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !documentFile) {
      setError("Please enter a prompt or upload a document!");
      return;
    }

    setLoading(true);
    setError("");
    setVideoPath("");
    setNotification("");
    setCaptions([]);
    setShowRatingPopup(false);  // Hide rating popup before generating

    try {
      let response;
      if (documentFile) {
        const formData = new FormData();
        formData.append("document", documentFile);
        formData.append("template", selectedTemplate);
        formData.append("orientation", selectedOrientation);
        formData.append("videoLength", selectedLength);

        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/render-video-document`, {
          method: "POST",
          body: formData
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/render-video`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userPrompt: prompt, 
            template: selectedTemplate, 
            orientation: selectedOrientation, 
            videoLength: selectedLength 
          })
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API request failed");

      setVideoPath(data.outputPath + `?t=${Date.now()}`);
      setVideoKey(Date.now());

      if (data.note) setNotification(data.note);

      const propsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/props.json?t=${Date.now()}`);
      const propsData = await propsRes.json();
      if (propsData.textForSpeech) {
        setCaptions(propsData.textForSpeech);
      } else if (propsData.promptText) {
        setCaptions(propsData.promptText.split("\n").filter(line => line.trim() !== ""));
      }

      // Show rating popup after video generated
      setShowRatingPopup(true);
    } catch (err) {
      console.error("Error generating video:", err);
      setError("Failed to generate video. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const url = cloudinaryUrl || `${process.env.NEXT_PUBLIC_BACKEND_URL}${videoPath}`;
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    // Use a filename - you can customize it
    link.download = 'generated_video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (platform) => {
    if (!videoPath && !cloudinaryUrl) return;
    
    const videoUrl = cloudinaryUrl || `${process.env.NEXT_PUBLIC_BACKEND_URL}${videoPath}`;
    const shareText = 'Check out this amazing video I created with AI!';
    
    switch (platform) {
      case 'youtube':
        window.open('https://www.youtube.com/upload', '_blank');
        break;
      case 'instagram':
        window.open('https://www.instagram.com/create/story', '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(videoUrl)}`, '_blank');
        break;
      case 'tiktok':
        window.open('https://www.tiktok.com/upload', '_blank');
        break;
      default:
        // Generic share
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'My Generated Video',
              text: shareText,
              url: videoUrl
            });
          } catch (err) {
            console.error('Error sharing:', err);
          }
        }
    }
  };

  const handleRatingSubmit = async () => {
    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token from useAuth or context
        },
        body: JSON.stringify({
          rating: Number(rating),  // ensure it's a number
          comment: "",             // optional, add if you have comment field
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save rating");
      }

      alert("Thanks for your feedback!");
      setShowRatingPopup(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to save rating. Please try again later.");
    }
  };

  // Handle closing rating popup without rating
  const handleRatingCancel = () => {
    setShowRatingPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-4 sm:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="text-yellow-400 mr-2" size={32} />
            <span className="text-lg font-medium text-yellow-400">AI Video Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
            Create Amazing Videos
          </h1>
          <p className="text-xl text-gray-400">
            Transform your ideas into stunning videos with AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Enter your prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your video idea..."
                    className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="relative">
                  <label className="block text-gray-300 mb-2">Or upload a document</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setDocumentFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Options Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              {[
                ["Video Template", TEMPLATES, selectedTemplate, setSelectedTemplate],
                ["Video Orientation", ORIENTATIONS, selectedOrientation, setSelectedOrientation],
                ["Video Length", VIDEO_LENGTHS, selectedLength, setSelectedLength]
              ].map(([label, options, selected, setSelected]) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">{label}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {options.map(({ id, name, description, icon }) => (
                      <motion.button
                        key={id}
                        onClick={() => setSelected(id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border transition-all ${
                          selected === id
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="text-2xl mb-2">{icon}</div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm opacity-75">{description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClear}
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Clear
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-xl text-white transition-colors ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Wand2 className="animate-spin mr-2" size={20} />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Wand2 className="mr-2" size={20} />
                    Generate Video
                  </span>
                )}
              </motion.button>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-900/50 text-red-200 rounded-xl border border-red-800"
              >
                {error}
              </motion.div>
            )}

            {notification && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-900/50 text-blue-200 rounded-xl border border-blue-800"
              >
                {notification}
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel: Video Preview */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Video Preview</h3>
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
                {videoPath ? (
                  <video
                    key={videoKey}
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    onLoadedMetadata={handleVideoMetadata}
                  >
                    <source src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${videoPath}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-center text-gray-400">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <Wand2 className="animate-spin mb-4" size={40} />
                        <p>Processing your video...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="mb-4" size={40} />
                        <p>Your video will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {videoDuration > 0 && (
                <div className="mt-4 text-sm text-gray-400">
                  Duration: {Math.floor(videoDuration / 60)}m {Math.floor(videoDuration % 60)}s
                </div>
              )}

              {(videoPath || cloudinaryUrl) && (
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-colors flex items-center justify-center"
                  >
                    <Download className="mr-2" size={20} />
                    Download Video
                  </motion.button>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-300 font-medium">Share to Social Media</h4>
                      <Share2 className="text-gray-400" size={20} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare('youtube')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Youtube size={20} />
                        <span>YouTube</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare('instagram')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                      >
                        <Instagram size={20} />
                        <span>Instagram</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare('facebook')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Facebook size={20} />
                        <span>Facebook</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Rating Popup */}
      <AnimatePresence>
        {showRatingPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Rate Your Experience</h2>
              <div className="flex justify-center mb-6 space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    className={`text-4xl ${
                      rating >= star ? "text-yellow-400" : "text-gray-600"
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="fill-current" />
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRatingCancel}
                  className="px-6 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Skip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className={`px-6 py-2 rounded-xl text-white transition-colors ${
                    rating === 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
