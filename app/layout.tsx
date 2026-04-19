import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { LanguageProvider } from "@/app/components/LanguageProvider";
import AuthProvider from "@/app/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Nasr Sanitary | Premium Sanitary Products",
    template: "%s | Nasr Sanitary",
  },
  description:
    "Nasr Sanitary e-commerce store for premium sanitary products with cash on delivery and bilingual English/Arabic support.",
  keywords: [
    "Nasr Sanitary",
    "sanitary products",
    "bathroom accessories",
    "e-commerce",
    "cash on delivery",
  ],
  openGraph: {
    title: "Nasr Sanitary",
    description:
      "Professional sanitary products with trusted quality and fast delivery.",
    siteName: "Nasr Sanitary",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <AuthProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
