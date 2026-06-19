import { consultationMetadata } from "@/app/metadata";
export const metadata = consultationMetadata;
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
