import { config } from "dotenv";
import { resolve } from "path";

config({
  path: [resolve(process.cwd(), ".env.local"), resolve(process.cwd(), ".env")],
});

import { createClient } from "@supabase/supabase-js";
import { generateLawyerSlug } from "../lib/slug";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Variables d'environnement manquantes.");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL:",
    SUPABASE_URL ? "trouvée" : "MANQUANTE"
  );
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY:",
    SERVICE_KEY ? "trouvée" : "MANQUANTE"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  console.log("Recherche des professionnels sans slug...\n");

  const { data: lawyers, error } = await supabase
    .from("lawyers")
    .select("id, slug, profession, users!inner(first_name, last_name)")
    .is("slug", null);

  if (error) {
    console.error("Erreur lors de la récupération:", error);
    process.exit(1);
  }

  if (!lawyers || lawyers.length === 0) {
    console.log("Tous les professionnels ont déjà un slug. Rien à faire.");
    return;
  }

  console.log(`${lawyers.length} professionnel(s) sans slug trouvé(s).\n`);

  const { data: existingSlugs } = await supabase
    .from("lawyers")
    .select("slug")
    .not("slug", "is", null);

  const usedSlugs = new Set(
    (existingSlugs || []).map((r: any) => r.slug as string)
  );

  let updated = 0;
  let failed = 0;

  for (const lawyer of lawyers as any[]) {
    const firstName = lawyer.users?.first_name || "";
    const lastName = lawyer.users?.last_name || "";

    if (!firstName || !lastName) {
      console.log(`${lawyer.id} — nom/prénom manquant, ignoré`);
      failed++;
      continue;
    }

    const baseSlug = generateLawyerSlug(firstName, lastName);
    let finalSlug = baseSlug;
    let suffix = 2;

    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const { error: updateError } = await supabase
      .from("lawyers")
      .update({ slug: finalSlug })
      .eq("id", lawyer.id);

    if (updateError) {
      console.log(`${firstName} ${lastName} — erreur:`, updateError.message);
      failed++;
      continue;
    }

    usedSlugs.add(finalSlug);
    updated++;
    console.log(
      `${firstName} ${lastName} (${lawyer.profession}) -> ${finalSlug}`
    );
  }

  console.log(`\nTerminé — ${updated} slug(s) créé(s), ${failed} échec(s).`);
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
