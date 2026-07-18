"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AcquisitionPopup from "@/components/AcquisitionPopup";

export default function AcquisitionGate() {
  const { user, profile, refreshProfile } = useAuth();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const emailConfirmed = !!(user as any)?.email_confirmed_at;
    const isAuthPage = pathname?.includes("/auth/");
    if (
      !answered &&
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
  }, [user, profile, pathname, answered]);

  const handleClose = async () => {
    setAnswered(true);
    setShow(false);
    try {
      await refreshProfile();
    } catch {}
  };

  if (!show || !user) return null;

  return <AcquisitionPopup userId={user.id} onClose={handleClose} />;
}
