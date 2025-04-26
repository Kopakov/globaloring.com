import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { RootLayout } from "@/components/layout/root-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Globaloring - Industrial Supplies",
    template: "%s | Globaloring",
  },
  description: "Your trusted source for industrial supplies",
  keywords: ["industrial supplies", "manufacturing", "tools", "equipment"],
  authors: [{ name: "Globaloring" }],
  creator: "Globaloring",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
