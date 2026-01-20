"use client";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-gray-300 py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand + Description */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-green-500 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">InvestSphere</h2>
          </div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Your trusted platform for building wealth through smart investments.
          </p>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-white font-semibold mb-4">Products</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white transition">Investments</li>
            <li className="hover:text-white transition">Cryptocurrencies</li>
            <li className="hover:text-white transition">Smart Portfolios</li>
            <li className="hover:text-white transition">Retirement</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white transition">About Us</li>
            <li className="hover:text-white transition">Careers</li>
            <li className="hover:text-white transition">Press</li>
            <li className="hover:text-white transition">Contact</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white transition">Privacy Policy</li>
            <li className="hover:text-white transition">Terms of Service</li>
            <li className="hover:text-white transition">Disclaimers</li>
            <li className="hover:text-white transition">Security</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} InvestSphere. All rights reserved.
        </p>

        <div className="flex space-x-4 text-gray-400">
          <a
            href="#"
            className="hover:text-white transition"
            aria-label="Twitter"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="#"
            className="hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
