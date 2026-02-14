import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Using Outfit as it's geometric and matches modern tech/retail logos better than Playfair
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smartavenue99.com"),
  title: {
    default: "Smart Avenue 99 – All your home needs, simplified.",
    template: "%s | Smart Avenue 99",
  },
  description:
    "We are a one-stop departmental store offering a wide range of home essentials, stylish home décor, premium kitchenware, durable plasticware, quality crockery, cosmetics, premium stationery, soft toys, and thoughtfully curated gift items—bringing comfort, convenience, and elegance to everyday living.",
  keywords: [
    "Smart Avenue 99 retail store",
    "premium stationery store",
    "stylish stationery products",
    "affordable home décor store",
    "kitchen décor products",
    "soft toys shop",
    "plastic home products",
    "home essentials store",
    "premium products affordable price",
    "retail store near me",
    "gift shop",
    "online shopping",
  ],
  authors: [{ name: "Smart Avenue 99" }],
  creator: "Smart Avenue 99",
  publisher: "Smart Avenue 99",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smartavenue99.com",
    title: "Smart Avenue 99 – All your home needs, simplified.",
    description:
      "We are a one-stop departmental store offering a wide range of home essentials, stylish home décor, premium kitchenware, durable plasticware, quality crockery, cosmetics, premium stationery, soft toys, and thoughtfully curated gift items—bringing comfort, convenience, and elegance to everyday living.",
    siteName: "Smart Avenue 99",
    images: [
      {
        url: "https://smartavenue99.com/logo.png",
        width: 512,
        height: 512,
        alt: "Smart Avenue 99 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Avenue 99 – All your home needs, simplified.",
    description:
      "We are a one-stop departmental store offering a wide range of home essentials, stylish home décor, premium kitchenware, durable plasticware, quality crockery, cosmetics, premium stationery, soft toys, and thoughtfully curated gift items—bringing comfort, convenience, and elegance to everyday living.",
    images: ["https://smartavenue99.com/logo.png"],
    creator: "@smartavenue99",
  },
  verification: {
    google: "P58XCY_8uZe5I7QC5eNh2wivKElDpu2ckaI60IgD5yc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/apple-icon.png?v=2",
  },
  themeColor: "#0284c7", // brand-blue
};

import { getSiteConfig } from "@/app/actions/site-config";
import { DEFAULT_SITE_CONFIG } from "@/types/site-config";
import { Suspense } from "react";

// Optimized Layout that injects config into ClientLayout
async function ConfigLoader({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig();
  return <ClientLayout initialConfig={siteConfig}>{children}</ClientLayout>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-slate-50 text-slate-900 flex flex-col min-h-screen`}
      >
        <Suspense fallback={<ClientLayout initialConfig={DEFAULT_SITE_CONFIG}>{children}</ClientLayout>}>
          <ConfigLoader>{children}</ConfigLoader>
        </Suspense>
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DepartmentStore",
              "name": "Smart Avenue 99",
              "url": "https://smartavenue99.com",
              "logo": "https://smartavenue99.com/logo.png",
              "image": "https://smartavenue99.com/logo.png",
              "description": "One-stop departmental store offering home essentials, decor, kitchenware, and gifts.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "priceRange": "₹₹"
            })
          }}
        />
      </body>
    </html>
  );
}
