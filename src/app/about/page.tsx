'use client';

import React from 'react';
import { ShieldCheck, Users, Globe, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="bg-[#0B132B] min-h-screen py-20 px-6 md:px-20 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <p className="text-emerald-500 text-sm uppercase font-semibold tracking-widest mb-3">
              Our Story
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Redefining the <span className="text-emerald-500">Future of Finance</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded with the mission to democratize wealth, InvestSphare bridges the gap 
              between complex global markets and everyday investors. We believe that 
              financial freedom should be accessible to everyone, regardless of their 
              starting capital or experience level.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="relative border border-gray-800 bg-[#141E3C]/50 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-emerald-500 text-xl font-bold mb-4 italic">"Transparency is our currency."</h3>
              <p className="text-gray-300">
                At InvestSphare, we don't just provide a platform; we provide a partnership. 
                Our infrastructure is built on the pillars of security, speed, and 
                unwavering support.
              </p>
            </div>
          </div>
        </div>

        {/* --- Core Values Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl border border-gray-800 bg-[#0F1935] hover:border-emerald-500/50 transition-all">
            <Target className="h-10 w-10 text-emerald-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">Our Mission</h4>
            <p className="text-gray-400 text-sm">To provide the tools and confidence for individuals to navigate the digital asset economy safely.</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-800 bg-[#0F1935] hover:border-emerald-500/50 transition-all">
            <ShieldCheck className="h-10 w-10 text-emerald-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">Security First</h4>
            <p className="text-gray-400 text-sm">We employ institutional-grade encryption and cold storage to ensure your assets are always protected.</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-800 bg-[#0F1935] hover:border-emerald-500/50 transition-all">
            <Users className="h-10 w-10 text-emerald-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">Community Driven</h4>
            <p className="text-gray-400 text-sm">Our platform evolves based on the feedback of thousands of traders worldwide.</p>
          </div>
        </div>

        {/* --- Contact & Support Section --- */}
        <div className="bg-gradient-to-r from-[#141E3C] to-[#0B132B] rounded-3xl p-10 md:p-16 border border-gray-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-gray-400">
                Have questions about our platform or interested in a partnership? Our team is standing by to assist you.
              </p>
            </div>
            
            <div className="space-y-6 w-full md:w-auto">
              <div className="flex items-center gap-4 bg-[#0B132B] p-4 rounded-xl border border-gray-700">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">General Support</p>
                  <a href="mailto:support@investsphare.com" className="text-emerald-400 hover:text-emerald-300 font-medium">
                    support@investsphare.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0B132B] p-4 rounded-xl border border-gray-700">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Billing & Security</p>
                  <a href="mailto:billing@investsphare.com" className="text-emerald-400 hover:text-emerald-300 font-medium">
                    billing@investsphare.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}