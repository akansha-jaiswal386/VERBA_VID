"use client";

import { motion } from "framer-motion";
import Signup from "../signup/page";

const Login = () => {
  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-emerald-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login to Your Account
        </h1>

        {/* Login Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-emerald-600 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            <a href="/forgot-password" className="text-emerald-600 font-semibold hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
