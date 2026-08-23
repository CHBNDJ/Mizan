import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/creer-sarl-algerie",
        destination: "/blog/creer-entreprise-algerie",
        permanent: true,
      },
      {
        source: "/blog/creer-entreprise-algerie-diaspora",
        destination: "/blog/creer-entreprise-algerie",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/blog/creer-sarl-algerie",
        destination: "/:locale/blog/creer-entreprise-algerie",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/blog/creer-entreprise-algerie-diaspora",
        destination: "/:locale/blog/creer-entreprise-algerie",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
