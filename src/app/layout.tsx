import type { Metadata } from "next";
import { Inter } from "next/font/google"; // or whichever font next.js generated
import "./globals.css";
import Providers from "./providers"; // Add this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forist",
  description: "A premium social platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap children in the Providers component */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}