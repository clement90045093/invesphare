"use client";

import Image from "next/image";



export default function Subbodyone() {
  return (
    <section className="w-full text-gray-800 bg-white">
      {/* ===== Top Green Banner Section ===== */}
      <div className="bg-green-600 text-white px-6 md:px-20 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              WHY TRADE WITH INVESTSPHERE
            </h2>
            <p className="text-base leading-relaxed opacity-90">
              Since its establishment, Investsphere Live Trading has shown consistent and
              remarkable results. Today, it’s recognized as one of the most successful
              and dependable companies in the forex trading and investment industry.
            </p>
          </div>
          <button className="mt-4 md:mt-0 bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Read More
          </button>
        </div>
      </div>

      {/* ===== Image + Info Section ===== */}
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-20 gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={"/jakub-zerdzicki-eGI0aGwuE-A-unsplash.jpg"}
            alt="Investment workspace"
            className="rounded-2xl shadow-lg object-cover"
            width={520}
            height={420}
            priority
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <p className="text-green-600 text-sm uppercase font-semibold tracking-widest">
            Secured with the latest encryption technology
          </p>
          <h3 className="text-3xl font-bold text-gray-900">
            Investsphere
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            Experience the best in asset management and financial innovation.
            We’re dedicated to meeting our clients’ needs and ensuring your security at
            every step.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            All forex transactions are executed quickly, safely, and securely — with
            instant withdrawals and verified payment options.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Read More
            </button>
            <button className="border border-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* ===== Investment Plans Section ===== */}
      <div className="bg-gray-50 py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Our Investment Plans
        </h2>
        <div className="w-24 h-1 bg-green-600 mx-auto my-5"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl shadow-md p-10 hover:shadow-xl transition border border-gray-100">
            <div className="flex justify-center mb-5">
              <Image src={"/invest1.webp"} alt="Starter plan" width={60} height={60} className="rounded-full" />
            </div>
            <h3 className="text-lg font-semibold uppercase mb-4 text-gray-800">Starter Plan</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Profit - 2% Daily for 5 Days <br />
              Minimum Deposit - $100.00 <br />
              Max Deposit - $4,999.00 <br />
              Payment Options: BTC, ETH, USDT, LTC, BCH <br />
              <span className="text-green-600 font-semibold">Instant Withdrawal</span>
            </p>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-2xl shadow-md p-10 hover:shadow-xl transition border border-gray-100">
            <div className="flex justify-center mb-5">
              <Image src={"/invest2.webp"} alt="Professional plan" width={60} height={60} className="rounded-full" />
            </div>
            <h3 className="text-lg font-semibold uppercase mb-4 text-gray-800">Professional Plan</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Profit - 5% Daily for 5 Days <br />
              Minimum Deposit - $5,000.00 <br />
              Max Deposit - $9,999.00 <br />
              Payment Options: BTC, ETH, USDT, LTC, BCH <br />
              <span className="text-green-600 font-semibold">Instant Withdrawal</span>
            </p>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-md p-10 hover:shadow-xl transition border border-gray-100">
            <div className="flex justify-center mb-5">
              <Image src={"/invest3.webp"} alt="Premium plan" width={60} height={60} className="rounded-full" />
            </div>
            <h3 className="text-lg font-semibold uppercase mb-4 text-gray-800">Premium Plan</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Profit - 7% Daily for 5 Days <br />
              Minimum Deposit - $10,000.00 <br />
              Max Deposit - Unlimited <br />
              Payment Options: BTC, ETH, USDT, LTC, BCH <br />
              <span className="text-green-600 font-semibold">Instant Withdrawal</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
