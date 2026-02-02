'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import CryptoTicker from './crptoshowcase';
import Image from 'next/image';
import coin from "../../public/35e3685c45acce00fa182b68792d9fa8-removebg-preview.png"

export default function Subbody() {
  return (
    <>
      {/* 🔥 Moving Crypto Ticker */}
      <CryptoTicker/>

      <section className="bg-[#0B132B] py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Section - Text */}
            <div className="space-y-6">
              <div>
                <p className="text-emerald-500 text-sm uppercase font-semibold tracking-widest mb-3">
                  Investment Platform
                </p>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Smart Investing{' '}
                  <span className="block text-emerald-500">Simplified</span>
                </h1>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed">
                Build your wealth with our secure investment platform. Access global
                markets, cryptocurrencies, and personalized portfolios all in one place.
                Designed for traders of all experience levels.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm">Secure & Verified</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm">Lightning Fast</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/login"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  Start Investing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="border border-gray-700 hover:border-emerald-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition">
                  Explore Markets
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="border-l border-gray-700 pl-4">
                  <p className="text-emerald-500 text-2xl font-bold">50+</p>
                  <p className="text-gray-500 text-xs uppercase">Cryptos</p>
                </div>
                <div className="border-l border-gray-700 pl-4">
                  <p className="text-emerald-500 text-2xl font-bold">24/7</p>
                  <p className="text-gray-500 text-xs uppercase">Trading</p>
                </div>
                <div className="border-l border-gray-700 pl-4">
                  <p className="text-emerald-500 text-2xl font-bold">0%</p>
                  <p className="text-gray-500 text-xs uppercase">Hidden Fees</p>
                </div>
              </div>
            </div>

            {/* Right Section - Visual Element */}
{/* Right Section - Coin Hero */}
<div className="relative h-80 md:h-[420px] flex items-center justify-center">
  {/* Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl blur-2xl" />

  {/* Coin Image */}
  <Image
    src={coin}
    alt="Crypto Coin"
    priority
    className="relative z-10 w-64 md:w-80 lg:w-[420px] drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]"
  />
</div>

          </div>
        </div>
      </section>
    </>
  );
}
