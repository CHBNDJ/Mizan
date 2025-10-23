import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/admin/", "/_next/", "/private/"],
      },
    ],
    sitemap: "https://mizan-dz.com/sitemap.xml", // ← Changez par votre domaine
  };
}
