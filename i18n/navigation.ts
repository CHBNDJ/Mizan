import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// À utiliser à la place de next/navigation et next/link dans tes composants :
// gèrent automatiquement le préfixe de langue dans les URLs.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
