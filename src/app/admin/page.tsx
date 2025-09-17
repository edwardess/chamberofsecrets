"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // Redirect to main public page
  }, [router]);

  return null;
}













