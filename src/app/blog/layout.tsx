import type { Metadata } from "next";

import { defaultSiteConfig } from "@/constants/default-site-config";

const title = "Insights & Product Updates";
const description = `Insights, guides, and product updates from the ${defaultSiteConfig.name} team.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title,
    description,
    url: "/blog",
    siteName: defaultSiteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {children}
    </div>
  );
}
