import "./globals.css";
import React from "react";

export const metadata = {
  title: "Service Center",
  description: "A modern service center management app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The (MainLayout) and (AuthLayout) folders each have their own layout.tsx.
  // Next.js will automatically use the correct layout for each route segment.
  // This root layout just provides the global HTML/body wrapper.
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 