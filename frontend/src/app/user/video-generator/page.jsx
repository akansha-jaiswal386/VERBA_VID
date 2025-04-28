"use client";
import { useState } from "react";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [previewMode, setPreviewMode] = useState(false); // 👉 for full screen preview

  const handleClear = () => {
    setPrompt("");
    setDocumentFile(null);
    setVideoPath("");
    setError("");
    setUploadStatus("");
    setCloudinaryUrl("");
    setPreviewMode(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !documentFile) {
      setError("Please enter a prompt or upload a document!");
      return;
    }

    setLoading(true);
    setError("");
    setVideoPath("");
    setCloudinaryUrl("");
    setUploadStatus("");

    try {
      let response;
      if (documentFile) {
        const formData = new FormData();
        formData.append("document", documentFile);

        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/render-video-document`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/render-video`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userPrompt: prompt }),
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

      // 👉 Automatically start upload after video is ready
      await uploadToCloudinary(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.outputPath}`);
      
    } catch (err) {
      console.error("Error generating video:", err);
      setError(err.message || "Failed to generate video. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (videoUrl) => {
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status}`);
      }
      const blob = await response.blob();

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
      } else {
        throw new Error("No secure_url returned from Cloudinary");
      }
    } catch (err) {
      console.error("Error during Cloudinary upload:", err);
      setUploadStatus("error");
      setError("Failed to upload video to Cloudinary");
    }
  };

  const handleDownload = () => {
    if (cloudinaryUrl) {
      const link = document.createElement("a");
      link.href = cloudinaryUrl;
      link.download = "generated_video.mp4";
      link.target = "_blank";
      link.click();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      {!previewMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Left Section */}
          <div>
            <h1 className="text-3xl font-bold text-black">Create Videos with Gemini AI</h1>
            <p className="text-gray-600 mt-2">Generate captivating videos based on your prompts or document uploads.</p>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here (optional if document is uploaded)"
              className="w-full mt-4 p-2 border rounded text-purple-400"
            />

            <input
              type="file"
              onChange={(e) => setDocumentFile(e.target.files[0])}
              className="w-full mt-4 p-2 text-amber-400 border rounded"
            />

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="mt-4 flex gap-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-black hover:bg-red-300 duration-150 border rounded"
              >
                Clear
              </button>
              <button
                onClick={handleGenerate}
                className={`px-4 py-2 text-white rounded ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
                disabled={loading}
              >
                {loading ? "⏳ Generating..." : "🎬 Create Video"}
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-gray-200 w-full h-64 flex items-center justify-center rounded">
            {cloudinaryUrl ? (
              <div className="w-full flex flex-col items-center">
                <video controls width="100%" className="rounded">
                  <source src={cloudinaryUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                  >
                    ⬇️ Download Video
                  </button>

                  <button
                    onClick={() => setPreviewMode(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                  >
                    🎥 Preview Fullscreen
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">
                {loading ? "Processing..." : "Video will appear here"}
              </span>
            )}
          </div>
        </div>
      ) : (
        // 👉 Preview Mode
        <div className="flex flex-col items-center justify-center w-full">
          <video
            src={cloudinaryUrl}
            controls
            autoPlay
            className="w-[80vw] max-w-6xl h-[auto] rounded shadow-lg"
          />
          <button
            onClick={() => setPreviewMode(false)}
            className="mt-4 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 absolute top-4 left-4"
          >
            🔙 Back
          </button>
        </div>
      )}
    </div>
  );
}
