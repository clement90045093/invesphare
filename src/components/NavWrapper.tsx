"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavWrapper() {
  const pathname = usePathname();

  // Hide the navbar on auth pages (signup, login)
  if (!pathname) return null;
  const hideRoutes = ["/signup", "/login"];
  for (const route of hideRoutes) {
    if (pathname === route || pathname.startsWith(route + "/")) return null;
  }

  return <Navbar />;
}
