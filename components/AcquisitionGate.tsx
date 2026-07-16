"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AcquisitionPopup from "@/components/AcquisitionPopup";

export default function AcquisitionGate() {
  const { user, profile } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      user &&
      profile &&
      profile.user_type === "client" &&
      !profile.acquisition_source
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user, profile]);

  if (!show || !user) return null;

  return <AcquisitionPopup userId={user.id} onClose={() => setShow(false)} />;
}
