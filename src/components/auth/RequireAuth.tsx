"use client";

import { useAccount } from "@/lib/hooks/useAccount";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const { user } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/account/login");
  }, [user]);

  return children;
}
