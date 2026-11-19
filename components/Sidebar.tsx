"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Rocket,
  RotateCw,
  Boxes,
  Crown,
  Sparkles,
  BookOpenCheck,
  Home,
  X,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSecretTeacherAccess } from "@/lib/useSecretTeacherAccess";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  emoji: string;
  stageBadge?: string;
  gameColor: string;
  activeBorder: string;
  activeBg: string;
  activeText: string;
}

export const navItems: NavItem[] = [
  {
    title: "Peta Petualangan",
    href: "/",
    icon: Home,
    emoji: "🗺️",
    gameColor: "bg-sky-400 text-sky-950",
    activeBorder: "border-sky-500",
    activeBg: "bg-sky-100 text-sky-950 border-b-4 border-sky-400 shadow-md",
    activeText: "text-sky-900",
  },
  {
    title: "Tahap 1: Aksi",
    href: "/aksi",
    icon: Rocket,
    emoji: "🚀",
    stageBadge: "Eksplorasi Konkret",
    gameColor: "bg-pink-500 text-white",
    activeBorder: "border-pink-500",
    activeBg: "bg-pink-100 text-pink-950 border-b-4 border-pink-400 shadow-md",
    activeText: "text-pink-900",
  },
  {
    title: "Tahap 2: Proses",
    href: "/proses",
    icon: RotateCw,
    emoji: "⚡",
    stageBadge: "Pola Kloning",
    gameColor: "bg-amber-400 text-amber-950",
    activeBorder: "border-amber-500",
    activeBg: "bg-amber-100 text-amber-950 border-b-4 border-amber-400 shadow-md",
    activeText: "text-amber-900",
  },
  {
    title: "Tahap 3: Objek",
    href: "/objek",
    icon: Boxes,
    emoji: "📦",
    stageBadge: "Pasangan Senilai",
    gameColor: "bg-emerald-500 text-white",
    activeBorder: "border-emerald-500",
    activeBg: "bg-emerald-100 text-emerald-950 border-b-4 border-emerald-400 shadow-md",
    activeText: "text-emerald-900",
  },
  {
    title: "Tahap 4: Skema",
    href: "/skema",
    icon: Crown,
    emoji: "👑",
    stageBadge: "Misi Koki Kafe",
    gameColor: "bg-purple-500 text-white",
    activeBorder: "border-purple-500",
    activeBg: "bg-purple-100 text-purple-950 border-b-4 border-purple-400 shadow-md",
    activeText: "text-purple-900",
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { clickCount, isUnlocked, handleLogoClick } = useSecretTeacherAccess();
  const [studentName, setStudentName] = useState("Ayu Putri");
  const [studentClass, setStudentClass] = useState("Kelas 6 SD");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("lab_rasio_student_name");
      const storedClass = localStorage.getItem("lab_rasio_student_class");
      if (storedName) setStudentName(storedName);
      if (storedClass) setStudentClass(storedClass);
    }
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-sky-950/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 sm:w-80 flex-col justify-between border-r-4 border-sky-300 bg-white/95 px-5 py-6 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl lg:shadow-none select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Logo Brand Header with Secret 5-Click Access */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handleLogoClick}
              className="group flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 text-left cursor-pointer"
              title="Laboratorium Rasio (Klik 5x untuk akses guru)"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl border-b-4 border-pink-700 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-lg text-3xl">
                🧪
                {clickCount > 1 && clickCount < 5 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[11px] font-black shadow animate-ping">
                    {clickCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-black text-xl tracking-tight text-slate-900">
                    Lab Rasio!
                  </span>
                  <Sparkles className="h-5 w-5 text-amber-500 fill-amber-400 animate-bounce" />
                </div>
                <span className="text-xs font-black text-purple-700 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full w-fit">
                  {isUnlocked ? "Membuka Guru... 👨‍🏫" : "Petualangan Game 🎮"}
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-200 lg:hidden"
              aria-label="Tutup menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2.5">
            <span className="px-2 text-xs font-black tracking-wider uppercase text-sky-800">
              Pilih Tahapan Game
            </span>
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-150 font-black text-base border-2",
                    isActive
                      ? `${item.activeBg} scale-[1.02] border-2`
                      : "border-transparent text-slate-700 hover:bg-sky-50 hover:text-slate-950 hover:scale-102"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-md transition-transform group-hover:scale-110",
                      item.gameColor
                    )}
                  >
                    <span>{item.emoji}</span>
                  </div>

                  <div className="flex flex-1 flex-col overflow-hidden text-left">
                    <span className="truncate font-black text-base">
                      {item.title}
                    </span>
                    {item.stageBadge && (
                      <span className="truncate text-xs font-bold text-slate-500">
                        {item.stageBadge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Quick LKPD / Reflection link */}
          <div className="px-1">
            <Link
              href="/refleksi"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-3xl border-3 border-dashed border-teal-400 bg-teal-100/70 p-3.5 text-teal-950 transition-all hover:bg-teal-200/80 active:translate-y-1 shadow-sm",
                pathname === "/refleksi" && "bg-teal-200 border-teal-600 font-black shadow-md"
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-md text-xl">
                📝
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black">LKPD Digital</span>
                <span className="text-xs font-bold text-teal-700">
                  Refleksi Pemahamanku
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* User / Student Card Footer with Gamification */}
        <div className="rounded-3xl border-4 border-amber-300 bg-gradient-to-br from-amber-100 to-yellow-100 p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-2xl font-black text-white shadow-md border-2 border-white">
              👧
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-black text-slate-900">
                {studentName}
              </span>
              <span className="text-xs font-bold text-amber-800">
                {studentClass} &bull; Level 2 🌟
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-3 py-1.5 text-xs font-black text-amber-950 border border-amber-300 shadow-inner">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500 animate-spin-slow" />
              <span>Bintang XP:</span>
            </span>
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-amber-950">
              340 XP
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
