import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import CreditButton from "@/components/ui/credit-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chamber of Secrets",
  description: "Discover the Secret Chamber, a hidden space filled with answers, insights, and strategies for social media management and digital marketing. A focused, distraction-free hub where every question finds its solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <CreditButton />
        </Providers>
      </body>
    </html>
  );
}
