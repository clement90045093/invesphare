"use client";

import React from "react";
import Link from "next/link";

export default function Subbody() {
  return (
    <section className="bg-white py-20 px-6 flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
      {/* Left Section - Text */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Smart Investing{" "}
          <span className="text-green-600 block md:inline">Simplified</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Build your wealth with our curated investment platform. Access global
          markets, cryptocurrencies, and personalized portfolios in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            href="/signup"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Start Investing
          </Link>
          <button className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Explore Markets
          </button>
        </div>

        <div className="flex items-center gap-3 mt-8 justify-center md:justify-start">
          {/* Crypto Icons (Placeholder circles) */}
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold">
              ₿
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold">
              Ξ
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold">
              ₮
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            <span className="text-green-600 font-semibold">50+</span> cryptocurrencies supported
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/images/invest-illustration.png"
          alt="Investment illustration"
          className="w-full max-w-md rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
