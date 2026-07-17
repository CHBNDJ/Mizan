"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AcquisitionPopup from "@/components/AcquisitionPopup";

export default function AcquisitionGate() {
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const emailConfirmed = !!(user as any)?.email_confirmed_at;
    const isAuthPage = pathname?.includes("/auth/");
    if (
      user &&
      emailConfirmed &&
      !isAuthPage &&
      profile &&
      profile.user_type === "client" &&
      !profile.acquisition_source
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user, profile, pathname]);

  if (!show || !user) return null;

  return <AcquisitionPopup userId={user.id} onClose={() => setShow(false)} />;
}
