import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata: Metadata = {
  title: "FuturePath — Learn. Grow. Thrive.",
  description:
    "FuturePath empowers youth with skills, courses, and job opportunities to build a brighter future.",
  keywords: ["learning", "jobs", "skills", "youth", "courses", "certificates"],
  authors: [{ name: "FuturePath Team" }],
  openGraph: {
    title: "FuturePath",
    description: "Learn. Grow. Thrive.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
