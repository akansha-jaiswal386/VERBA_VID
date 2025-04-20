import React from "react";

const createvid = () => {
  return (
    <div className="min-h-screen bg-green-200 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6 transition-all duration-300 ease-in-out transform hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-center text-green-700">Upload Your Document</h2>

        {/* Document Upload */}
        <div>
          <label className="block mb-2 font-medium">Choose Document:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
            Create Video
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
            Add Image
          </button>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
            Reset
          </button>
          <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default createvid;
