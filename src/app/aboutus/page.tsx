"use client";

import Image from "next/image";
import image from "../../../public/roi-return-investment-finance-profit-success-internet-business-technology-concept-110267580.webp";
import image1 from "../../../public/invest1.webp";
import image2 from "../../../public/invest2.webp";
import image3 from "../../../public/invest3.webp";
import image4 from "../../../public/ChatGPT_Image_Oct_17__2025__01_22_02_PM-removebg-preview.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-12 px-6">
      {/* ABOUT SECTION */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl p-8 md:p-10 border border-blue-200">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-4">
          About Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          We are secured with the latest server security tech and highest
          encryption levels — protected 24/7.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="flex-1 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Since its establishment on <b>March 10, 2020</b>,
              <b> yieldoraglobal.com LIVE TRADING</b> has shown
              commendably successful and consistent performance in the trading
              world.
            </p>
            <p>
              Currently, it is regarded as one of the most beneficial and
              successful companies in the industry of forex trading and
              investing.
            </p>
          </div>

          <div className="flex-1">
            <Image
              src={image}
              alt="ROI Illustration"
              className="rounded-xl shadow-md transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* WHY CHOOSE SECTION */}
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-8">
          Why Choose Yieldora Global
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2 hover:bg-blue-50">
            <Image
              src={image1}
              alt="Instant Trading"
              className="mx-auto mb-4 w-32 h-32 object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
            />
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Instant Trading
            </h3>
            <p className="text-gray-600 text-sm">
              Change your world today and make yourself a great tomorrow. Invest
              with the little you have and earn great profit.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2 hover:bg-blue-50">
            <Image
              src={image2}
              alt="Experts Support"
              className="mx-auto mb-4 w-32 h-32 object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
            />
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Experts Support
            </h3>
            <p className="text-gray-600 text-sm">
              Our professional team offers full-time support and guidance to
              help you achieve your investment goals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2 hover:bg-blue-50">
            <Image
              src={image3}
              alt="Safe and Secure"
              className="mx-auto mb-4 w-32 h-32 object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
            />
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Safe and Secure
            </h3>
            <p className="text-gray-600 text-sm">
              With advanced security systems, we keep your account safe and
              protected 24/7.
            </p>
          </div>
        </div>

        {/* COMPANY INFO */}
        <div className="mt-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <Image
              src={image4}
              alt="Company Logo"
              className="mx-auto w-56 h-auto transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex-1 text-gray-700 text-sm leading-relaxed">
            <p>
              Since its establishment, we have consistently demonstrated success
              and performance in global trading. Today, we are recognized as one
              of the most trusted and growth-oriented investment companies in
              the industry.
            </p>
          </div>
        </div>

        {/* LINKS */}
        <div className="border-t border-gray-200 mt-14 pt-6 text-center">
          <h2 className="text-blue-700 font-semibold mb-3">Useful Links</h2>
          <div className="flex justify-center gap-6 text-gray-600 text-sm">
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">
              Home
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">
              About Us
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">
              Terms
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-xs text-gray-500 mt-10 text-center">
          © 2025 yieldoraglobal.com — All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
