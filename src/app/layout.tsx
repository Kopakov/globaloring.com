import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayout } from "@/components/layout/root-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Global O-Ring",
  description: "Your trusted source for high-quality O-rings and sealing solutions",
  keywords: ["O-rings", "seals", "rubber", "industrial", "manufacturing"],
  authors: [{ name: "Global O-Ring" }],
  creator: "Global O-Ring",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
