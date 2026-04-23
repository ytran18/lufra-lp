import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { defaultSiteConfig } from "@/constants/default-site-config";

// Limit to only actually-used weights to reduce font payload
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
  preload: false, // secondary font, don't block render
});

const title = "Picture-in-Picture for macOS — Float Any Window";
const description =
  "Float any app above everything else. Resize freely, reposition effortlessly. Experience PiP with 60fps, zero latency, and native macOS design.";

export const metadata: Metadata = {
  metadataBase: new URL(defaultSiteConfig.siteUrl),
  title: {
    default: title,
    template: `%s — ${defaultSiteConfig.name}`,
  },
  description,
  applicationName: defaultSiteConfig.name,
  authors: [{ name: defaultSiteConfig.name }],
  creator: defaultSiteConfig.name,
  publisher: defaultSiteConfig.name,
  keywords: [
    "Picture in Picture",
    "macOS",
    "PiP",
    "productivity",
    "multitasking",
    "floating window",
    "always on top",
    "window manager",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: defaultSiteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d1f" },
  ],
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: defaultSiteConfig.name,
  url: defaultSiteConfig.siteUrl,
  logo: `${defaultSiteConfig.siteUrl}${defaultSiteConfig.logo}`,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: defaultSiteConfig.name,
  url: defaultSiteConfig.siteUrl,
};

const softwareAppLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: defaultSiteConfig.name,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "macOS 13.0+",
  url: defaultSiteConfig.siteUrl,
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  image: `${defaultSiteConfig.siteUrl}${defaultSiteConfig.logo}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="preload"
          href="/model/macbook.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#fbfbfd]`}>
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
