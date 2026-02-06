'use client';

import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] border-t border-gray-800/50 pt-20 pb-10 px-6 md:px-20 text-gray-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <ArrowUpRight className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">InvestSphare</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering global investors with institutional-grade tools and secure asset management. Build your future with confidence.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaTwitter />} href="#" />
              <FaLinkedin className="hover:text-emerald-500 cursor-pointer transition-colors" size={20} />
              <FaInstagram className="hover:text-emerald-500 cursor-pointer transition-colors" size={20} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Platform</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/markets">Live Markets</FooterLink>
              <FooterLink href="/crypto">Cryptocurrencies</FooterLink>
              <FooterLink href="/portfolio">Smart Portfolios</FooterLink>
              <FooterLink href="/security">Security Protocol</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Company</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/legal">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Support</h3>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <p className="text-xs text-gray-500 mb-1">General Inquiries</p>
                <a href="mailto:support@investsphare.com" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <Mail size={14} /> support@investsphare.com
                </a>
              </div>
              <div className="group cursor-pointer">
                <p className="text-xs text-gray-500 mb-1">Billing & Finance</p>
                <a href="mailto:billing@investsphare.com" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <Mail size={14} /> billing@investsphare.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} InvestSphare Global Ltd. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-medium uppercase tracking-tighter">
            <span className="hover:text-white cursor-pointer transition">System Status</span>
            <span className="hover:text-white cursor-pointer transition">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Component for Links
function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="hover:text-emerald-500 transition-all duration-300 ease-in-out flex items-center group">
        <span className="w-0 group-hover:w-2 h-[1px] bg-emerald-500 mr-0 group-hover:mr-2 transition-all"></span>
        {children}
      </Link>
    </li>
  );
}

// Helper Component for Social Icons
function SocialIcon({ icon, href }) {
  return (
    <a href={href} className="h-9 w-9 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
      {icon}
    </a>
  );
}