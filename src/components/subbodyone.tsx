'use client';

import Image from 'next/image';

export default function Subbodyone() {
  return (
    <section className="w-full bg-[#0B132B]">
      {/* ===== Top Banner Section ===== */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 md:px-20 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-4xl">
            <p className="text-emerald-100 text-sm uppercase tracking-widest mb-3 font-semibold">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Trade with Investsphere
            </h2>
            <p className="text-base leading-relaxed opacity-95">
              Since our establishment, Investsphere has delivered consistent and
              remarkable results. Recognized as one of the most successful and dependable
              investment companies in the forex and crypto trading industry.
            </p>
          </div>
          {/* Read More button removed per request */}
        </div>
      </div>

      {/* ===== Image + Info Section ===== */}
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-20 gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={"/jakub-zerdzicki-eGI0aGwuE-A-unsplash.jpg"}
            alt="Investment workspace"
            className="rounded-2xl shadow-2xl object-cover border border-gray-800"
            width={520}
            height={420}
            priority
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <p className="text-emerald-500 text-sm uppercase font-semibold tracking-widest">
            Secured with Latest Encryption
          </p>
          <h3 className="text-4xl font-bold text-white">
            Investsphere
          </h3>
          <p className="text-gray-400 leading-relaxed text-lg">
            Experience the best in asset management and financial innovation.
            We're dedicated to meeting our clients' needs and ensuring your security at
            every step.
          </p>
          <p className="text-gray-400 leading-relaxed text-lg">
            All forex transactions are executed quickly, safely, and securely — with
            instant withdrawals and verified payment options.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="mailto:investsphere31@gmail.com" className="border border-gray-700 hover:border-emerald-500 text-gray-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition inline-flex items-center justify-center">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* ===== Investment Plans Section ===== */}
      <div className="bg-[#0D1B2A] py-20 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-3">
          Investment Plans
        </h2>
        <p className="text-gray-400 mb-2">Choose the plan that fits your goals</p>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto my-6 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Starter Plan */}
          <div className="group relative rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-emerald-500/50 bg-[#0B132B]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <Image src={"/invest1.webp"} alt="Starter plan" width={60} height={60} className="rounded-full ring-2 ring-emerald-500/30" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 text-white">Starter</h3>
              <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Daily Profit</span>
                  <span className="text-emerald-500 font-semibold">2%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Min Deposit</span>
                  <span className="text-white font-semibold">$100</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Max Deposit</span>
                  <span className="text-white font-semibold">$4,999</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Duration</span>
                  <span className="text-white font-semibold">5 Days</span>
                </div>
                <p className="text-emerald-500 font-semibold pt-2">Instant Withdrawal</p>
              </div>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="group relative rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-emerald-500/30 bg-gradient-to-br from-[#0B132B] to-[#0D1B2A] ring-2 ring-emerald-500/20 transform md:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
              Popular
            </div>
            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <Image src={"/invest2.webp"} alt="Professional plan" width={60} height={60} className="rounded-full ring-2 ring-emerald-500/50" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 text-white">Professional</h3>
              <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Daily Profit</span>
                  <span className="text-emerald-500 font-semibold">5%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Min Deposit</span>
                  <span className="text-white font-semibold">$5,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Max Deposit</span>
                  <span className="text-white font-semibold">$9,999</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Duration</span>
                  <span className="text-white font-semibold">5 Days</span>
                </div>
                <p className="text-emerald-500 font-semibold pt-2">Instant Withdrawal</p>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="group relative rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-emerald-500/50 bg-[#0B132B]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <Image src={"/invest3.webp"} alt="Premium plan" width={60} height={60} className="rounded-full ring-2 ring-emerald-500/30" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 text-white">Premium</h3>
              <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Daily Profit</span>
                  <span className="text-emerald-500 font-semibold">7%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Min Deposit</span>
                  <span className="text-white font-semibold">$10,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Max Deposit</span>
                  <span className="text-white font-semibold">Unlimited</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                  <span>Duration</span>
                  <span className="text-white font-semibold">5 Days</span>
                </div>
                <p className="text-emerald-500 font-semibold pt-2">Instant Withdrawal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
