import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavWrapper from "../components/NavWrapper";
import Footer from "../components/footer";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/superbase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvestSphere",
  description: "Secure investment platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check (used by NavWrapper logic if needed)
  const supabase = await createClient();
  await supabase.auth.getUser(); // no console.log in prod

  return (
    <html lang="en">
      <head>
        {/* ======================
            Smartsupp Live Chat
           ====================== */}
        <Script
          id="smartsupp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = 'cbffb5b33d9f622c3e7d3f54eca1741bd0287f00';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];
                c=d.createElement('script');
                c.type='text/javascript';
                c.charset='utf-8';
                c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';
                s.parentNode.insertBefore(c,s);
              })(document);
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navbar */}
        <NavWrapper />

        {/* Page content */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>

        {/* Footer (global) */}
        <Footer />

        {/* Toast notifications */}
        <Toaster />
      </body>
    </html>
  );
}
