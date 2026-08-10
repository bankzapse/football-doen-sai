"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordView } from "@/app/track/actions";

/** บันทึกยอดเข้าชมทุกครั้งที่เปลี่ยนหน้า (วางไว้ใน root layout) */
export default function ViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    recordView(pathname).catch(() => {});
  }, [pathname]);
  return null;
}
