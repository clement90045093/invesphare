"use client";

import Image from "next/image";
import Link from "next/link";

export default function Reset() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Logo & Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-emerald-500 rounded-full p-4 mb-3 shadow-lg">
          {/* Use the public path for images (no import). Put the PNG in /public */}
          <Image
            src="/ChatGPT_Image_Oct_17__2025__01_22_02_PM-removebg-preview.png"
            alt="InvestSphere Logo"
            width={40}
            height={40}
            priority
          />
        </div>

        <h1 className="text-3xl font-bold">InvestSphere</h1>
        <p className="text-gray-400 text-sm">Smart Investing Simplified</p>
      </div>

      {/* Reset Password Card */}
      <div className="bg-[#0f1623] shadow-2xl rounded-2xl w-[90%] sm:w-[400px] p-8 transition duration-300 hover:shadow-emerald-500/10">
        <h2 className="text-2xl font-semibold mb-2">Password Reset</h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter your registered email or username and we’ll send you instructions
          to reset your password.
        </p>

        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email address / Username
          </label>
          <input
            type="text"
            placeholder="Your E-mail or Username"
            className="w-full bg-[#1b2433] text-gray-200 placeholder-gray-500 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
          />
        </div>

        {/* Send Button */}
        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-md transition duration-200">
          Send Reset Link
        </button>

        {/* Back to Login Link */}
        <p className="text-sm text-center text-gray-400 mt-5">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-emerald-500 hover:text-emerald-400 hover:underline transition"
          >
            Log In
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="text-xs text-gray-600 mt-10 text-center">
        © 2025 BEATUS VTU. All rights reserved.
      </footer>
    </div>
  );
}
