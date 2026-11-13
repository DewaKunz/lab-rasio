"use client";

import { useState, useEffect } from "react";
import { Menu, Sparkles, Trophy, Flame, Star, Volume2, VolumeX } from "lucide-react";
import { useSecretTeacherAccess } from "@/lib/useSecretTeacherAccess";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { clickCount, isUnlocked, handleLogoClick } = useSecretTeacherAccess();
  const [studentName, setStudentName] = useState("Ayu Putri");
  const [studentClass, setStudentClass] = useState("Kelas 5B");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("lab_rasio_student_name");
      const storedClass = localStorage.getItem("lab_rasio_student_class");
      if (storedName) setStudentName(storedName);
      if (storedClass) setStudentClass(storedClass);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-20 items-center justify-between border-b-4 border-sky-300 bg-white/95 px-3 sm:px-6 backdrop-blur-md select-none shadow-md">
      {/* Left: Mobile hamburger & Secret Logo Entrance */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-b-4 border-slate-300 bg-white text-slate-800 shadow-md transition active:translate-y-1 lg:hidden text-lg"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Secret Logo Button (5x clicks opens teacher dashboard) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-2 cursor-pointer transition active:scale-95 text-left"
          title="Laboratorium Rasio (Klik 5x untuk akses guru)"
        >
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-b-4 border-amber-600 bg-amber-400 text-lg sm:text-xl shadow-md">
            <span>🧪</span>
            {clickCount > 1 && clickCount < 5 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[10px] sm:text-xs font-black shadow animate-ping">
                {clickCount}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                Lab Rasio!
              </span>
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-amber-400 animate-spin-slow" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-purple-700 bg-purple-100 border border-purple-200 px-1.5 py-0.2 rounded-full w-fit">
              {isUnlocked ? "Membuka Guru... 👨‍🏫" : "Game Edukasi 🎮"}
            </span>
          </div>
        </button>
      </div>

      {/* Right: Gamification HUD (Stars, Streak, Student Avatar, Sound) */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Star XP Counter */}
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-amber-100 px-2.5 sm:px-3.5 py-1 sm:py-1.5 border-2 border-amber-300 text-amber-950 shadow-sm">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-500 animate-spin-slow" />
          <span className="text-xs sm:text-sm font-black">340 XP</span>
        </div>

        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 border-2 border-orange-300 text-orange-950 shadow-sm">
          <Flame className="h-5 w-5 fill-orange-500 text-orange-600 animate-bounce" />
          <span className="text-xs sm:text-sm font-black">3 Hari</span>
        </div>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => setSoundOn(!soundOn)}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border-b-2 border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:translate-y-0.5 transition"
          title={soundOn ? "Matikan Suara" : "Nyalakan Suara"}
        >
          {soundOn ? (
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
          ) : (
            <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          )}
        </button>

        {/* Student Avatar HUD */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l-2 border-slate-200">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-tr from-pink-400 via-rose-500 to-amber-400 text-lg sm:text-xl shadow-md select-none">
            👧
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="truncate max-w-[110px] text-xs font-black text-slate-900 leading-none">
              {studentName}
            </span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5">
              {studentClass} &bull; Lvl 2 ⭐
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
