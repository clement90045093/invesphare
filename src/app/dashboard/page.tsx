"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";
import BalanceCards from "./components/BalanceCards";
import RecentTransactions from "./components/RecentTransactions";
import {
  FiHome,
  FiUser,
  FiHelpCircle,
  FiFileText,
  FiActivity,
  FiCreditCard,
  FiMenu,
} from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";

export default function DashboardPage() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/dashboard`);
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        const json = await res.json();
        if (!mounted) return;
        setSummary({ deposited: json.deposited, pendingCount: json.pendingCount });
        setTransactions(json.recentTransactions || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Account", icon: <FiUser /> },
    { name: "Support", icon: <FiHelpCircle /> },
    { name: "P/L Record", icon: <FiFileText /> },
    { name: "Transactions", icon: <FiActivity />, path: "/transactions" },
    {
      name: "Deposit/Withdrawal",
      icon: <FiCreditCard />,
      children: [
        { name: "Deposit", path: "/deposit" },
        { name: "Withdrawal", path: "/withdrawal" },
      ],
    },
    { name: "Logout", icon: <MdOutlineLogout /> },
  ];

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0B132B] text-white">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#0D1B2A] border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 text-lg font-semibold border-b border-gray-800 flex justify-between items-center">
          investSphere.com
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✖
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 text-sm text-gray-400">Menu</div>
          <nav className="flex flex-col gap-1 px-2">
            {menuItems.map((item) => {
              if (item.children && Array.isArray(item.children)) {
                const isOpen = !!openSubmenus[item.name];
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => {
                        setOpenSubmenus((s) => ({ ...s, [item.name]: !s[item.name] }));
                        setActive(item.name);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
                        active === item.name ? "bg-emerald-600 text-white" : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                    {isOpen && (
                      <div className="pl-6 flex flex-col">
                        {item.children.map((c: any) => (
                          <Link
                            key={c.name}
                            href={c.path}
                            onClick={() => {
                              setActive(c.name);
                              setSidebarOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-gray-300 hover:bg-gray-800`}
                          >
                            <span>{c.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return item.path ? (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => {
                    setActive(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    active === item.name
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => {
                    setActive(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    active === item.name
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col md:ml-0">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-4 md:px-6 py-3 border-b border-gray-800 bg-[#0D1B2A] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-gray-300 text-sm md:text-base">
              Welcome, Investor 👋
            </h2>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-white">🔔</button>
            <button className="hover:text-white">👤</button>
          </div>
        </header>

        {/* Summary Cards */}
        <BalanceCards summary={summary} loading={loading} />

        {/* Chart and Forex sections removed per request */}

        <RecentTransactions transactions={transactions} />

        {/* Footer */}
        <footer className="text-gray-500 text-[10px] md:text-xs text-center py-4 border-t border-gray-800">
          © 2017–{new Date().getFullYear()} InvestSphere.com. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}
