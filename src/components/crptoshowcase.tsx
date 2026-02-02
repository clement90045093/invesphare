"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Crypto {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function CryptoTicker() {
  const [data, setData] = useState<Crypto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Ticker fetch failed", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#0B132B] border-b border-white/10">
      <div className="flex whitespace-nowrap animate-ticker">
        {[...data, ...data].map((coin, i) => {
          const positive = coin.price_change_percentage_24h >= 0;

          return (
            <div
              key={`${coin.id}-${i}`}
              className="flex items-center gap-2 px-6 py-3 text-sm text-white"
            >
              <span className="uppercase font-semibold">
                {coin.symbol}
              </span>

              <span className="font-medium">
                ${coin.current_price.toLocaleString()}
              </span>

              <span
                className={`flex items-center gap-1 ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
