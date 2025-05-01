"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      // Replace with real login API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Login to Your Account</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 text-white py-3 rounded-lg transition duration-300 hover:bg-emerald-700 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-emerald-400 hover:underline font-semibold">
              Sign Up
            </a>
          </p>
          <p className="mt-2">
            <a href="/forgot-password" className="text-emerald-400 hover:underline font-semibold">
              Forgot Password?
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
