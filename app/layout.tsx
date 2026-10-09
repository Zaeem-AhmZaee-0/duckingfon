import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DuckingFon — Weather, brought to life",
  description: "Explore real weather with Fon. Local forecasts, a living 3D world, global search, and rain radar.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
