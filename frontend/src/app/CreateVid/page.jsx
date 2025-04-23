"use client"
import React, { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerateVideo = () => {
    if (!file) {
      alert("Please upload a document first!");
    } else {
      alert("Video generation initiated!");
      // Handle the video generation logic here
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-400">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl text-center font-bold text-emerald-600 mb-6">Generate Video from Document</h1>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf, .docx"
            className="w-full p-4 border-2 border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleGenerateVideo}
            className="w-64 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-md shadow-md hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
          >
            Generate Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
