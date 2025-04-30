"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UploadCloud, Download, X, Maximize, Minimize, FileText, Sparkles } from "lucide-react";
import toast from 'react-hot-toast';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleClear = () => {
    setPrompt("");
    setDocumentFile(null);
    setVideoPath("");
    setError("");
    setUploadStatus("");
    setCloudinaryUrl("");
    setPreviewMode(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !documentFile) {
      setError("Please enter a prompt or upload a document!");
      toast.error("Input required!");
      return;
    }

    setLoading(true);
    setError("");
    setVideoPath("");
    setCloudinaryUrl("");
    setUploadStatus("");
    setProgress(0);

    try {
      let response;
      const controller = new AbortController();
      const signal = controller.signal;

      if (documentFile) {
        const formData = new FormData();
        formData.append("document", documentFile);

        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/render-video-document`, {
          method: "POST",
          body: formData,
          signal
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/render-video`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userPrompt: prompt }),
          signal
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "API request failed");
      }

      const data = await response.json();
      if (!data.outputPath) {
        throw new Error("No output path returned by backend");
      }

      setVideoPath(data.outputPath);
      toast.success("Video generated successfully!");
      
      await uploadToCloudinary(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.outputPath}`);
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Error generating video:", err);
        setError(err.message || "Failed to generate video.");
        toast.error(err.message || "Generation failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (videoUrl) => {
    try {
      setUploadStatus("fetching");
      setProgress(10);
      
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status}`);
      }
      
      const contentLength = response.headers.get('content-length');
      const reader = response.body.getReader();
      let receivedLength = 0;
      let chunks = [];
      
      while(true) {
        const {done, value} = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        if (contentLength) {
          setProgress(Math.round((receivedLength / contentLength) * 90) + 10);
        }
      }
      
      const blob = new Blob(chunks);
      setProgress(95);

      setUploadStatus("uploading");
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error?.message || "Cloudinary upload failed");
      }

      if (uploadResult.secure_url) {
        setCloudinaryUrl(uploadResult.secure_url);
        setUploadStatus("success");
        setProgress(100);
        toast.success("Video uploaded successfully!");
      } else {
        throw new Error("No secure_url returned from Cloudinary");
      }
    } catch (err) {
      console.error("Error during Cloudinary upload:", err);
      setUploadStatus("error");
      setError("Failed to upload video to Cloudinary");
      toast.error("Upload failed!");
    }
  };

  const handleDownload = async () => {
    if (!cloudinaryUrl) return;

    try {
      toast.loading("Preparing download...");
      const response = await fetch(cloudinaryUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `generated_video_${new Date().getTime()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.dismiss();
      toast.success("Download started!");
    } catch (err) {
      console.error("Download failed", err);
      setError("Failed to download video.");
      toast.error("Download failed!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setDocumentFile(file);
      toast.success("Document uploaded!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
      <AnimatePresence>
        {previewMode ? (
          // Fullscreen Preview Mode
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setPreviewMode(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
            >
              <X size={24} />
            </button>
            
            {cloudinaryUrl ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-full max-w-6xl"
              >
                <video
                  src={cloudinaryUrl}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[90vh] rounded-lg shadow-xl"
                />
              </motion.div>
            ) : (
              <div className="text-white text-xl">No video available</div>
            )}
          </motion.div>
        ) : (
          // Main Content
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Section - Input */}
              <motion.div 
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-purple-400" size={28} />
                  <h1 className="text-3xl font-bold text-white">AI Video Generator</h1>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Transform your ideas into stunning videos with Gemini AI. Enter a prompt or upload a document to get started.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Your Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the video you want to create..."
                      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px] placeholder-gray-400"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Or Upload Document
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        documentFile ? 'border-green-500 bg-gray-700' : 'border-gray-600 hover:border-purple-400 bg-gray-700'
                      }`}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <UploadCloud className={`mx-auto mb-2 ${documentFile ? 'text-green-400' : 'text-gray-400'}`} size={32} />
                      <p className={`${documentFile ? 'text-green-400' : 'text-gray-400'}`}>
                        {documentFile ? (
                          <>
                            <span className="font-medium">{documentFile.name}</span> selected
                          </>
                        ) : (
                          "Click to upload PDF, DOC, or TXT"
                        )}
                      </p>
                      {documentFile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocumentFile(null);
                            fileInputRef.current.value = "";
                          }}
                          className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center justify-center gap-1"
                        >
                          <X size={16} /> Remove file
                        </button>
                      )}
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={handleClear}
                      className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-500 rounded-lg"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-2"
                    >
                      {loading && <Loader2 className="animate-spin" size={18} />}
                      Generate Video
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Section - Output */}
              <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="text-purple-400" size={28} />
                  <h1 className="text-3xl font-bold text-white">Video Preview</h1>
                </div>

                <div className="space-y-6">
                  {cloudinaryUrl && !loading && (
                    <div className="relative">
                      <div className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 opacity-75 hover:opacity-100 transition duration-300 cursor-pointer" onClick={() => setPreviewMode(true)}>
                        <Maximize size={18} className="text-white" />
                      </div>
                      <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-gray-700">
                        <video
                          src={cloudinaryUrl}
                          controls
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                  {uploadStatus === "uploading" && (
                    <div className="text-yellow-400 text-sm">Uploading video to Cloudinary...</div>
                  )}
                  {uploadStatus === "fetching" && (
                    <div className="text-yellow-400 text-sm">Fetching video...</div>
                  )}
                  {uploadStatus === "success" && (
                    <div className="text-green-400 text-sm">Upload successful!</div>
                  )}

                  {cloudinaryUrl && !loading && (
                    <div className="flex gap-4">
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 text-white bg-green-600 hover:bg-green-500 rounded-lg"
                      >
                        <Download className="inline mr-2" />
                        Download Video
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
