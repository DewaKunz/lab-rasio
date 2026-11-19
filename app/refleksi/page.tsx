"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpenCheck,
  Send,
  Sparkles,
  Coffee,
  HelpCircle,
  AlertCircle,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { soundFx } from "@/lib/audio";
import { saveReflectionAction } from "@/actions/reflection";
import MascotBubble from "@/components/MascotBubble";

export default function RefleksiPage() {
  const [dailyExample, setDailyExample] = useState("");
  const [understoodText, setUnderstoodText] = useState("");
  const [confusedText, setConfusedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (type: "pop" | "success" | "retry") => {
    if (!soundEnabled) return;
    if (type === "pop") soundFx.playPop();
    if (type === "success") soundFx.playSuccess();
    if (type === "retry") soundFx.playRetry();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!dailyExample.trim() || !understoodText.trim() || !confusedText.trim()) {
      playSound("retry");
      setErrorMessage("Harap lengkapi semua isian pertanyaan refleksi ya!");
      return;
    }

    setIsSubmitting(true);

    try {
      const localName =
        typeof window !== "undefined"
          ? localStorage.getItem("lab_rasio_student_name")
          : null;
      const localClass =
        typeof window !== "undefined"
          ? localStorage.getItem("lab_rasio_student_class")
          : "Kelas 6 SD";

      const res = await saveReflectionAction({
        studentName: localName || "Ayu Putri",
        dailyExample,
        understoodText,
        confusedText,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "lab_rasio_last_reflection",
          JSON.stringify({
            studentName: localName || "Ayu Putri",
            studentClass: localClass || "Kelas 6 SD",
            dailyExample,
            understoodText,
            confusedText,
            createdAt: new Date().toISOString(),
          })
        );
      }

      if (res.success) {
        playSound("success");
        setIsSuccess(true);
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#14B8A6", "#10B981", "#3B82F6", "#F59E0B", "#EC4899"],
        });
      } else {
        playSound("retry");
        setErrorMessage(res.error || "Gagal menyimpan refleksi.");
      }
    } catch {
      playSound("retry");
      setErrorMessage("Terjadi kesalahan teknis saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMascotMessage = () => {
    if (isSuccess) {
      return "LUAR BIASA! 🎉 Refleksi LKPD kamu sudah tersimpan rapi untuk diperiksa Ibu/Bapak Guru! Kamu hebat sekali! ⭐";
    }
    return "Tuliskan pengalaman belajarmu tentang perbandingan dan rasio di sini ya! Jawab dengan jujur dan santai! 📝";
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-3.5 sm:px-5 py-2 sm:py-2.5 font-black text-xs sm:text-sm text-slate-800 border-b-4 border-slate-300 shadow-md hover:bg-slate-50 active:translate-y-1 transition"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Kembali ke Peta</span>
        </Link>

        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-3 sm:px-4 py-2 font-black text-xs text-slate-700 border-b-4 border-slate-300 shadow-md hover:bg-slate-50 active:translate-y-1 transition"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-4 w-4 text-emerald-600" />
              <span>Suara: ON 🔊</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 text-slate-400" />
              <span>Suara: OFF 🔇</span>
            </>
          )}
        </button>
      </div>

      {/* Mascot Guidance */}
      <MascotBubble
        message={getMascotMessage()}
        emotion={isSuccess ? "celebrating" : "happy"}
        mascotName="Robi si Robot Lab 🤖"
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-b-8 border-teal-600 bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 p-6 sm:p-7 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <span className="inline-block rounded-full bg-white/25 px-4 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              Lembar Kerja &amp; Refleksi 📝
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow">
              LKPD Digital Laboratorium Rasio
            </h1>
            <p className="text-teal-100 text-sm sm:text-base font-bold">
              Ceritakan hal seru dan pemahaman barumu kepada guru!
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border-4 border-teal-300 bg-white px-5 py-3 text-slate-900 shadow-xl shrink-0">
            <BookOpenCheck className="h-9 w-9 text-teal-600" />
            <div className="text-left">
              <span className="text-xs font-black text-teal-700 uppercase block">
                Status Tugas
              </span>
              <span className="text-xl font-black text-slate-900">
                {isSuccess ? "Selesai ✅" : "Belum Dikirim"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Container */}
      <section className="rounded-3xl border-4 border-b-8 border-teal-400 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Daily Example */}
            <div className="rounded-3xl border-4 border-teal-200 bg-teal-50/70 p-5 sm:p-6 space-y-2">
              <label className="flex items-center gap-2 text-base sm:text-lg font-black text-teal-950">
                <Coffee className="h-6 w-6 text-teal-600" />
                <span>1. Buat satu contoh rasio dalam kehidupan sehari-hari:</span>
              </label>
              <textarea
                required
                rows={3}
                value={dailyExample}
                onChange={(e) => setDailyExample(e.target.value)}
                placeholder="Contoh: Saat membuat sirup manis, 1 sendok sirup untuk 4 gelas air (1:4)..."
                className="w-full rounded-2xl border-4 border-teal-200 bg-white p-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Field 2: Understood */}
            <div className="rounded-3xl border-4 border-emerald-200 bg-emerald-50/70 p-5 sm:p-6 space-y-2">
              <label className="flex items-center gap-2 text-base sm:text-lg font-black text-emerald-950">
                <Sparkles className="h-6 w-6 text-emerald-600" />
                <span>2. Hal yang saya pahami tentang rasio senilai:</span>
              </label>
              <textarea
                required
                rows={3}
                value={understoodText}
                onChange={(e) => setUnderstoodText(e.target.value)}
                placeholder="Contoh: Jika kedua bilangan dikalikan dengan angka yang sama, rasionya tetap senilai..."
                className="w-full rounded-2xl border-4 border-emerald-200 bg-white p-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Field 3: Confused */}
            <div className="rounded-3xl border-4 border-amber-200 bg-amber-50/70 p-5 sm:p-6 space-y-2">
              <label className="flex items-center gap-2 text-base sm:text-lg font-black text-amber-950">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                <span>3. Hal yang masih membingungkan bagiku:</span>
              </label>
              <textarea
                required
                rows={3}
                value={confusedText}
                onChange={(e) => setConfusedText(e.target.value)}
                placeholder="Contoh: Menghitung rasio jika angkanya berupa bilangan pecahan atau desimal..."
                className="w-full rounded-2xl border-4 border-amber-200 bg-white p-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition shadow-sm"
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl border-4 border-rose-300 bg-rose-50 p-4 text-sm font-black text-rose-800 flex items-center gap-2 shadow">
                <AlertCircle className="h-6 w-6 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-game-green min-h-14 sm:min-h-16 px-6 sm:px-12 text-lg sm:text-xl touch-manipulation"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Database... ⏳</span>
                ) : (
                  <>
                    <Send className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    <span>Kirim Refleksi ke Guru! 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="rounded-3xl border-4 border-b-8 border-emerald-400 bg-emerald-50 p-6 sm:p-8 text-center space-y-6"
          >
            <div className="text-6xl sm:text-7xl animate-bounce">
              🎉 🏆 🥳
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="inline-block rounded-full bg-emerald-200 border-2 border-emerald-400 px-4 py-1 text-xs font-black text-emerald-950 uppercase">
                Terkirim Langsung ke Dashboard Guru ⭐
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Refleksi Berhasil Terkirim!
              </h2>
              <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
                Jawabanmu telah tersimpan rapi. Guru dapat langsung membaca hasil refleksimu di Dashboard Guru.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto btn-game-yellow min-h-14 sm:min-h-16 px-6 sm:px-10 text-lg sm:text-xl touch-manipulation"
              >
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <span>Kembali ke Peta Petualangan 🗺️</span>
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
