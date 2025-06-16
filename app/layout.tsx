import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientLayout from './client-layout';

// Load custom fonts from local files for consistent typography
const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: 'swap',
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: 'swap',
});

// Set up page metadata for SEO and browser tab
export const metadata: Metadata = {
  title: "ToDo Application",
  description: "Realizat de Eduard Enache si Stanoiu Ionut",
};

// Set viewport for responsive design
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Wrap all pages with custom fonts and client-side layout logic
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
