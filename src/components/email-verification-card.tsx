"use client";

import { Mail, CheckCircle } from "lucide-react";

interface EmailVerificationCardProps {
  email: string;
  onResendEmail?: () => void;
}

export function EmailVerificationCard({
  email,
  onResendEmail,
}: EmailVerificationCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      {/* Logo & Title */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-emerald-500 p-3 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
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
        <h1 className="text-2xl font-bold">InvestSphere</h1>
        <p className="text-gray-400 mt-1">Smart Investing Simplified</p>
      </div>

      {/* Verification Card */}
      <div className="bg-[#0B132B] w-full max-w-md rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/20 p-4 rounded-full">
            <Mail className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to
        </p>

        {/* Email Display */}
        <div className="bg-[#1A2238] rounded-lg p-4 mb-6 border border-emerald-400/30">
          <p className="text-emerald-400 font-semibold break-all">{email}</p>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6 text-left">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300">
                Check your inbox and click the verification link to activate your account. You may need to check your spam folder.
              </p>
            </div>
          </div>
        </div>

        {/* Resend Button */}
        <button
          onClick={onResendEmail}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-md transition mb-4"
        >
          Resend Verification Email
        </button>

        {/* Back to Login */}
        <p className="text-gray-400 text-sm">
          Already verified?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Log In
          </a>
        </p>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-xs mt-10">
        © {new Date().getFullYear()} InvestSphere. All rights reserved.
      </p>
    </div>
  );
}
