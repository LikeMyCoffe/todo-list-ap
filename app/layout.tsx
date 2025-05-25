import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientLayout from './client-layout';

// Update the font paths with explicit relative paths
const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff", // Make sure this exactly matches your file name and path
  variable: "--font-geist-sans",
  weight: "100 900",
  display: 'swap',
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff", // Make sure this exactly matches your file name and path
  variable: "--font-geist-mono",
  weight: "100 900",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ToDo Application",
  description: "Realizat de Eduard Enache si Stanoiu Ionut",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
