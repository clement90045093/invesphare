"use client";

import { FaLocationDot } from "react-icons/fa6";
import { MdAttachEmail } from "react-icons/md";
import Image from "next/image";
import image1 from "../../../public/ChatGPT_Image_Oct_17__2025__01_22_02_PM-removebg-preview.png";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-12 px-6">
      {/* Header */}
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 md:p-10 border border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Terms & Conditions
        </h1>

        {/* Terms Text */}
        <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
          <p>
            You agree to be of legal age in your country to partake in this
            program, and in all cases your minimum age must be 18 years.
          </p>

          <p>
            yieldoraglobal.com is not available to the general public and is
            opened only to the qualified members of Absolute Options. Every
            deposit is considered a private transaction between the member and
            yieldoraglobal.com.
          </p>

          <p>
            As a private transaction, this program is exempt from the US
            Securities Act of 1933, the US Securities Exchange Act of 1934, and
            all other related regulations. We are not FDIC insured and not a
            licensed bank or securities firm.
          </p>

          <p>
            All communications and materials from yieldoraglobal.com must be
            kept private and confidential. Information on this website does not
            constitute an investment offer or solicitation in any jurisdiction
            where such actions are unlawful.
          </p>

          <p>
            All data provided by members is used privately and not disclosed to
            third parties. yieldoraglobal.com is not liable for any loss of
            data.
          </p>

          <p>
            You agree to hold all principals and members harmless of any
            liability. Investments are made at your own risk, and past
            performance does not guarantee future results.
          </p>

          <p>
            We reserve the right to change the program’s rules, commissions, or
            rates at any time, without prior notice.
          </p>

          <p>
            yieldoraglobal.com is not responsible for any damages or losses
            resulting from misuse of the website. You agree to comply with all
            applicable laws when using this site.
          </p>

          <p>
            A service fee of 15% of accumulated profit is required to process
            withdrawal requests after each successful trading session.
          </p>

          <p>
            We strictly prohibit SPAM or any form of unsolicited communication.
            Violators will be permanently removed from the program.
          </p>

          <p>
            yieldoraglobal.com reserves the right to accept or decline any
            membership without explanation.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Company Info Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <Image
              src={image1}
              alt="Company"
              className="mx-auto md:mx-0 w-48 h-auto"
            />
            <p className="mt-4 text-sm text-gray-600">
              Since its establishment, we have shown consistent performance and
              are regarded as one of the most successful companies in the
              trading and investment industry.
            </p>
          </div>

          <div className="flex-1 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FaLocationDot className="text-blue-600 mt-1" />
              <div>
                <h2 className="font-semibold text-gray-800">Address</h2>
                <p>14325 96 Ave NW, Edmonton, Alberta, Canada</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MdAttachEmail className="text-blue-600 mt-1" />
              <div>
                <h2 className="font-semibold text-gray-800">Email</h2>
                <p>support@yieldoraglobal.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Useful Links */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <h2 className="text-blue-700 font-semibold mb-3">Useful Links</h2>
          <div className="flex justify-center gap-6 text-gray-600 text-sm">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="hover:text-blue-600 cursor-pointer">About Us</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-xs text-gray-500 mt-10 text-center">
          © 2025 yieldoraglobal.com — All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
