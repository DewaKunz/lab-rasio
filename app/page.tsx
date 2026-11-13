"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  Flame,
  Trophy,
} from "lucide-react";
import { soundFx } from "@/lib/audio";
import { loginStudentAction, getActiveStudentAction } from "@/actions/student";
import { useSecretTeacherAccess } from "@/lib/useSecretTeacherAccess";

const AVATAR_OPTIONS = [
  { emoji: "👧", name: "Ayu" },
  { emoji: "👦", name: "Budi" },
  { emoji: "🦊", name: "Fiki" },
  { emoji: "🐱", name: "Kimi" },
  { emoji: "🤖", name: "Robi" },
];

export default function StudentLoginPage() {
  const router = useRouter();
  const { clickCount, isUnlocked, handleLogoClick } = useSecretTeacherAccess();
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("Kelas 5B");
  const [selectedAvatar, setSelectedAvatar] = useState("👧");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active student from cookie/localStorage if already logged in previously
  const [existingStudent, setExistingStudent] = useState<{
    id: string;
    name: string;
    class: string;
  } | null>(null);

  useEffect(() => {
    getActiveStudentAction().then((student) => {
      if (student) {
        setExistingStudent(student);
      } else {
        const localName = localStorage.getItem("lab_rasio_student_name");
        if (localName) {
          setExistingStudent({
            id: localStorage.getItem("lab_rasio_student_id") || "local-1",
            name: localName,
            class: localStorage.getItem("lab_rasio_student_class") || "Kelas 5B",
          });
        }
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameToSubmit = studentName.trim();
    if (!nameToSubmit) {
      setErrorMessage("Ketik namamu dulu ya sebelum mulai bermain! 😊");
      soundFx.playRetry();
      return;
    }

    setIsLoading(true);
    soundFx.playPop();

    try {
      const result = await loginStudentAction(nameToSubmit, studentClass);

      if (result.success && result.student) {
        soundFx.playSuccess();

        if (typeof window !== "undefined") {
          localStorage.setItem("lab_rasio_student_id", result.student.id);
          localStorage.setItem("lab_rasio_student_name", result.student.name);
          localStorage.setItem("lab_rasio_student_class", result.student.class);
          localStorage.setItem("lab_rasio_student_avatar", selectedAvatar);
        }

        router.push("/aksi");
      } else {
        setErrorMessage(result.error || "Gagal masuk. Coba ketik namamu lagi ya.");
        soundFx.playRetry();
        setIsLoading(false);
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.setItem("lab_rasio_student_id", "student-local-" + Date.now());
        localStorage.setItem("lab_rasio_student_name", nameToSubmit);
        localStorage.setItem("lab_rasio_student_class", studentClass);
        localStorage.setItem("lab_rasio_student_avatar", selectedAvatar);
      }
      soundFx.playSuccess();
      router.push("/aksi");
    }
  };

  const handleContinueAsExisting = () => {
    soundFx.playSuccess();
    router.push("/aksi");
  };

  return (
    <div className="min-h-[84vh] flex flex-col justify-between py-4 select-none space-y-8">
      {/* Top Secret Entrance Bar */}
      <div className="flex items-center justify-between px-2">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer text-left"
          title="Laboratorium Rasio (Klik 5x untuk akses guru)"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black shadow-md border-b-4 border-amber-600 text-2xl">
            🧪
            {clickCount > 1 && clickCount < 5 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-black shadow animate-ping">
                {clickCount}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-slate-900 tracking-tight leading-none">
              Laboratorium Rasio
            </span>
            <span className="text-[11px] font-black text-purple-700 mt-0.5">
              {isUnlocked ? "Mode Guru Terbuka! 👨‍🏫" : "Petualangan Matematika 🎮"}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 border-2 border-sky-300 text-xs font-black text-sky-950 shadow-sm">
            <span>Level 1-4</span>
            <span>⭐</span>
          </div>
        </div>
      </div>

      {/* Main Hero Mascot & Login Card */}
      <div className="my-auto max-w-xl w-full mx-auto space-y-6">
        {/* Animated Friendly Mascot */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="flex flex-col items-center text-center space-y-3"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-3xl border-4 border-b-8 border-amber-400 bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 shadow-2xl text-6xl sm:text-7xl select-none"
          >
            <span>🤖</span>
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-6 w-6 rounded-full bg-emerald-500 border-2 border-white"></span>
            </span>
          </motion.div>

          <div className="space-y-1.5 px-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 border-2 border-amber-400 px-4 py-1 text-xs font-black text-amber-950 uppercase shadow-sm">
              <Sparkles className="h-4 w-4 fill-amber-500 text-amber-600 animate-spin" />
              <span>Petualangan Matematika Teori APOS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Selamat Datang di Laboratorium Rasio! 🧪
            </h1>
            <p className="text-base sm:text-lg font-bold text-slate-600 max-w-md mx-auto">
              Kuasai perbandingan angka melalui 4 tantangan game seru bersama Robi si Robot Lab!
            </p>
          </div>
        </motion.div>

        {/* Existing Student Quick Continue Card */}
        {existingStudent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-card-3d border-emerald-500 bg-emerald-50 p-5 text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-950 font-black text-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <span>
                Halo lagi, <strong>{existingStudent.name}</strong> ({existingStudent.class})!
              </span>
            </div>
            <button
              type="button"
              onClick={handleContinueAsExisting}
              className="w-full btn-game-green min-h-16 px-8 text-xl"
            >
              <span>Lanjut Bermain Sebagai {existingStudent.name}! 🚀</span>
              <ArrowRight className="h-6 w-6 ml-2" />
            </button>
            <p className="text-xs font-bold text-emerald-800">
              Bukan kamu? Ketik nama baru di bawah ini 👇
            </p>
          </motion.div>
        )}

        {/* Student Name & Avatar Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="game-card-3d border-sky-400 bg-white p-6 sm:p-8 space-y-5"
        >
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-900">
              Pilih Karakter &amp; Ketik Namamu! ✨
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Tanpa password! Langsung ketik namamu dan petualangan dimulai.
            </p>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-1.5 text-center">
            <span className="text-xs font-black text-slate-600">Pilih Avatar Favorit:</span>
            <div className="flex items-center justify-center gap-2.5">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item.emoji}
                  onClick={() => setSelectedAvatar(item.emoji)}
                  className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-2xl border-b-4 transition-all touch-manipulation ${
                    selectedAvatar === item.emoji
                      ? "bg-amber-300 border-amber-600 scale-110 shadow-lg ring-4 ring-amber-200"
                      : "bg-slate-100 border-slate-300 hover:bg-slate-200"
                  }`}
                  title={item.name}
                >
                  <span>{item.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Name */}
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ketik Nama Kamu di sini..."
                className="w-full rounded-full border-4 border-sky-300 bg-sky-50/70 px-5 sm:px-6 py-3.5 sm:py-4 text-base sm:text-xl font-black text-slate-900 placeholder:text-slate-400 placeholder:font-bold focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-200 transition shadow-inner"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl">
                {selectedAvatar}
              </span>
            </div>

            {/* Class Pill selector */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-black text-slate-500">Pilih Kelas:</span>
              {["Kelas 5A", "Kelas 5B", "Kelas 5C"].map((cls) => (
                <button
                  type="button"
                  key={cls}
                  onClick={() => setStudentClass(cls)}
                  className={`rounded-full px-4 py-1.5 text-xs font-black transition ${
                    studentClass === cls
                      ? "bg-amber-400 text-amber-950 border-2 border-amber-600 shadow-sm scale-105"
                      : "bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-3 text-sm font-black text-rose-700 text-center"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* GIANT PRIMARY BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-game-yellow min-h-16 px-8 text-2xl"
            >
              {isLoading ? (
                <span>Menyiapkan Meja Laboratorium... 🧪</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Mulai Bermain! 🚀</span>
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 text-center">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Aman untuk anak: Tanpa kata sandi &amp; progres tersimpan otomatis</span>
          </div>
        </motion.div>

        {/* 4 Levels Preview Game Islands */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <Link
            href="/aksi"
            className="game-card-3d border-rose-400 bg-white p-3 hover:scale-105 transition"
          >
            <span className="text-3xl">🚀</span>
            <span className="block text-xs font-black text-rose-700 mt-1">Level 1: Aksi</span>
            <span className="text-[10px] font-bold text-slate-500">Keping Konkret</span>
          </Link>

          <Link
            href="/proses"
            className="game-card-3d border-amber-400 bg-white p-3 hover:scale-105 transition"
          >
            <span className="text-3xl">⚡</span>
            <span className="block text-xs font-black text-amber-700 mt-1">Level 2: Proses</span>
            <span className="text-[10px] font-bold text-slate-500">Mesin Kloning</span>
          </Link>

          <Link
            href="/objek"
            className="game-card-3d border-emerald-400 bg-white p-3 hover:scale-105 transition"
          >
            <span className="text-3xl">📦</span>
            <span className="block text-xs font-black text-emerald-700 mt-1">Level 3: Objek</span>
            <span className="text-[10px] font-bold text-slate-500">Berburu Pasangan</span>
          </Link>

          <Link
            href="/skema"
            className="game-card-3d border-purple-400 bg-white p-3 hover:scale-105 transition"
          >
            <span className="text-3xl">👑</span>
            <span className="block text-xs font-black text-purple-700 mt-1">Level 4: Skema</span>
            <span className="text-[10px] font-bold text-slate-500">Tantangan Koki</span>
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs font-black text-sky-800/80 pt-4">
        Laboratorium Rasio &bull; Game Edukasi Matematika APOS Ramah Anak
      </footer>
    </div>
  );
}
