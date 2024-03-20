"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const SetUUID = ({ uuid }: { uuid: string }) => {
  const router = useRouter();
  useEffect(() => {
    localStorage.setItem("pitch-align-uuid", uuid);
    router.push("/");
  }, []);
  return <></>;
};
