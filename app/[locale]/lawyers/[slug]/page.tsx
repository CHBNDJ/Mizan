import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import LawyerProfileClient from "./LawyerProfileClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = { params: Promise<{ slug: string }> };

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

async function resolveLawyer(idOrSlug: string) {
  const { data } = await supabase
    .from("lawyers")
    .select("id, slug")
    .eq(isUUID(idOrSlug) ? "id" : "slug", idOrSlug)
    .eq("is_verified", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = await resolveLawyer(slug);
  const canonicalPath = lawyer?.slug || lawyer?.id || slug;

  return {
    alternates: {
      canonical: `https://mizan-dz.com/lawyers/${canonicalPath}`,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;

  if (isUUID(slug)) {
    const lawyer = await resolveLawyer(slug);
    if (lawyer?.slug) {
      redirect(`/lawyers/${lawyer.slug}`);
    }
  }

  return <LawyerProfileClient slug={slug} />;
}
