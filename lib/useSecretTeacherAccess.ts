"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { soundFx } from "@/lib/audio";

/**
 * Hook untuk membuka Dashboard Guru secara rahasia dengan klik 5x pada logo Lab Rasio.
 * Jika diklik 1x biasa: kembali ke Beranda (/).
 * Jika diklik cepat 5x: Membuka Dashboard Guru (/guru).
 */
export function useSecretTeacherAccess() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const singleClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (singleClickTimerRef.current) {
      clearTimeout(singleClickTimerRef.current);
    }

    const nextCount = clickCount + 1;

    if (nextCount >= 5) {
      setClickCount(0);
      setIsUnlocked(true);
      soundFx.playSuccess();
      router.push("/guru");
    } else {
      setClickCount(nextCount);
      soundFx.playPop();

      if (nextCount === 1) {
        // Jika hanya 1 klik dan tidak diklik lagi dalam 400ms, arahkan ke beranda
        singleClickTimerRef.current = setTimeout(() => {
          setClickCount(0);
          router.push("/");
        }, 400);
      } else {
        // Multi-click sedang berlangsung, tunggu klik ke-5
        timeoutRef.current = setTimeout(() => {
          setClickCount(0);
        }, 2000);
      }
    }
  };

  return { clickCount, isUnlocked, handleLogoClick };
}
