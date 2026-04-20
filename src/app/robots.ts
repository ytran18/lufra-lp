import type { MetadataRoute } from "next";

import { defaultSiteConfig } from "@/constants/default-site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${defaultSiteConfig.siteUrl}/sitemap.xml`,
    host: defaultSiteConfig.siteUrl,
  };
}
