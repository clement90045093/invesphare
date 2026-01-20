"use client";

import React, { useState } from "react";
import Footer from "../../components/footer"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Breadcrumb */}
      <div className="bg-gray-100 text-sm px-6 py-2 flex items-center gap-1 text-gray-600">
        <span className="text-red-500">🏠</span>
        <span>Home</span>
        <span>›</span>
        <span className="font-medium">Support</span>
      </div>

      {/* Header Bar */}
      <div className="bg-black text-white flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Elite Global Logo"
            className="h-10 w-auto"
          />
          <h1 className="font-bold text-lg">InvestSphere</h1>
        </div>

        <nav className="flex gap-6 text-sm uppercase">
          <a href="/" className="hover:text-yellow-400">Home</a>
          <a href="/about" className="hover:text-yellow-400">About Us</a>
          <a href="/register" className="hover:text-yellow-400">Register</a>
          <a href="/login" className="hover:text-yellow-400">Login</a>
        </nav>
      </div>

      {/* Support Form */}
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Support Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Your Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
              Your Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium text-gray-700 mb-1">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
      <div>
        <Footer/>
      </div>

    </div>
  );
}
