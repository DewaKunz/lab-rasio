"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Send,
  Trophy,
  Volume2,
  VolumeX,
  CheckCircle2,
  Star,
} from "lucide-react";
import { soundFx } from "@/lib/audio";
import MascotBubble from "@/components/MascotBubble";
import ModalPortal from "@/components/ModalPortal";

interface BatchItem {
  id: number;
  multiplier: number;
  redCount: number;
  blueCount: number;
  ratioText: string;
  factorText: string;
}

interface ProsesMission {
  id: number;
  title: string;
  baseRed: number;
  baseBlue: number;
  question: string;
  hint: string;
  explanation: string;
}

const PROSES_MISSIONS: ProsesMission[] = [
  {
    id: 1,
    title: "Misi 1 (2:3)",
    baseRed: 2,
    baseBlue: 3,
    question: "Mengapa 2:3 dan 4:6 menunjukkan perbandingan yang sama padahal jumlah kepingnya berbeda?",
    hint: "Pikirkan tentang paket kelipatan yang digandakan bersama!",
    explanation: "Tepat sekali! Meskipun jumlah keping bertambah, rasio tetap sama karena merah dan biru digandakan bersamaan (×2).",
  },
  {
    id: 2,
    title: "Misi 2 (3:4)",
    baseRed: 3,
    baseBlue: 4,
    question: "Jika paket 3:4 digandakan 3 kali lipat menjadi 9:12, mengapa nilai perbandingannya tetap sama?",
    hint: "Perhatikan bahwa merah dan biru sama-sama dikalikan 3!",
    explanation: "Hebat! Karena kedua nilai dikalikan dengan bilangan pengali yang sama (×3), perbandingannya tetap senilai.",
  },
  {
    id: 3,
    title: "Misi 3 (1:4)",
    baseRed: 1,
    baseBlue: 4,
    question: "Apa kesimpulanmu tentang aturan membuat rasio senilai dari perbandingan dasar?",
    hint: "Pikirkan hubungan pengali pada keping merah dan keping biru!",
    explanation: "Luar biasa! Untuk menghasilkan rasio senilai, kedua nilai perbandingan harus dikalikan dengan angka pengali yang sama!",
  },
];

const getInitialHistory = (baseRed: number, baseBlue: number): BatchItem[] => [
  {
    id: 1,
    multiplier: 1,
    redCount: baseRed,
    blueCount: baseBlue,
    ratioText: `${baseRed} : ${baseBlue}`,
    factorText: `(${baseRed} × 1) : (${baseBlue} × 1)`,
  },
];

export default function ProsesPage() {
  const [activeMissionIndex, setActiveMissionIndex] = useState<number>(0);
  const currentMission = PROSES_MISSIONS[activeMissionIndex];

  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  const [multiplier, setMultiplier] = useState<number>(1);
  const [history, setHistory] = useState<BatchItem[]>(
    getInitialHistory(PROSES_MISSIONS[0].baseRed, PROSES_MISSIONS[0].baseBlue)
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Reflection Card / Modal State
  const [showReflectionModal, setShowReflectionModal] = useState<boolean>(false);
  const [reflectionAnswer, setReflectionAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCloning, setIsCloning] = useState<boolean>(false);

  const playSound = (type: "zap" | "pop" | "success") => {
    if (!soundEnabled) return;
    if (type === "zap") soundFx.playZap();
    if (type === "pop") soundFx.playPop();
    if (type === "success") soundFx.playSuccess();
  };

  const handleSelectMission = (index: number) => {
    if (index === activeMissionIndex) return;
    playSound("pop");
    setActiveMissionIndex(index);
    setMultiplier(1);
    setHistory(getInitialHistory(PROSES_MISSIONS[index].baseRed, PROSES_MISSIONS[index].baseBlue));
    setShowReflectionModal(false);
    setReflectionAnswer("");
    setIsAnswerSubmitted(false);
    setIsCloning(false);
  };

  const handleMultiply = () => {
    if (multiplier >= 3) return;

    setIsCloning(true);
    playSound("zap");

    setTimeout(() => {
      const nextMultiplier = multiplier + 1;
      const nextRed = currentMission.baseRed * nextMultiplier;
      const nextBlue = currentMission.baseBlue * nextMultiplier;
      const newEntry: BatchItem = {
        id: nextMultiplier,
        multiplier: nextMultiplier,
        redCount: nextRed,
        blueCount: nextBlue,
        ratioText: `${nextRed} : ${nextBlue}`,
        factorText: `(${currentMission.baseRed} × ${nextMultiplier}) : (${currentMission.baseBlue} × ${nextMultiplier})`,
      };

      setMultiplier(nextMultiplier);
      setHistory((prev) => [...prev, newEntry]);
      setIsCloning(false);

      if (nextMultiplier === 3) {
        setTimeout(() => {
          setShowReflectionModal(true);
          playSound("pop");
        }, 500);
      }
    }, 350);
  };

  const handleReset = () => {
    playSound("pop");
    setMultiplier(1);
    setHistory(getInitialHistory(currentMission.baseRed, currentMission.baseBlue));
    setIsCloning(false);
    setShowReflectionModal(false);
    setReflectionAnswer("");
    setIsAnswerSubmitted(false);
  };

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionAnswer.trim()) return;

    playSound("success");
    setIsAnswerSubmitted(true);

    if (!completedMissions.includes(currentMission.id)) {
      setCompletedMissions((prev) => [...prev, currentMission.id]);
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#EC4899", "#8B5CF6", "#10B981", "#3B82F6"],
    });
  };

  const handleNextMission = () => {
    playSound("pop");
    if (activeMissionIndex < PROSES_MISSIONS.length - 1) {
      const nextIdx = activeMissionIndex + 1;
      setActiveMissionIndex(nextIdx);
      setMultiplier(1);
      setHistory(getInitialHistory(PROSES_MISSIONS[nextIdx].baseRed, PROSES_MISSIONS[nextIdx].baseBlue));
      setShowReflectionModal(false);
      setReflectionAnswer("");
      setIsAnswerSubmitted(false);
    }
  };

  const currentRed = currentMission.baseRed * multiplier;
  const currentBlue = currentMission.baseBlue * multiplier;

  const getMascotMessage = () => {
    if (isAnswerSubmitted) {
      if (activeMissionIndex < PROSES_MISSIONS.length - 1) {
        return `LUAR BIASA! 🎉 Soal ${currentMission.id} tuntas! Ayo lanjut ke Soal ${currentMission.id + 1}! 🚀`;
      }
      return "HEBAT BANGET! 🏆 Semua 3 soal kloning dan refleksi telah kamu selesaikan! Ayo lanjut ke Tahap 3: Objek! 👑";
    }
    if (multiplier === 1) {
      return `Soal ${currentMission.id}: Tekan tombol oranye besar 'GANDAKAN' untuk melipatgandakan paket rasio ${currentMission.baseRed}:${currentMission.baseBlue}! ⚡`;
    }
    if (multiplier === 2) {
      return `Keren! Sekarang ada ${currentRed} Merah & ${currentBlue} Biru (kelipatan 2x)! Tekan tombol sekali lagi! 🚀`;
    }
    return `HEBAT! Sekarang ada ${currentRed} Merah & ${currentBlue} Biru. Coba lihat tabel dan jawab pertanyaan refleksinya! 💡`;
  };

  const getMascotEmotion = () => {
    if (isAnswerSubmitted) return "celebrating";
    if (multiplier >= 3) return "thinking";
    return "happy";
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Navigation & Stepper */}
      <div className="space-y-2.5">
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

        {/* 3 Mission Stepper Pills (Scrollable on small screens) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PROSES_MISSIONS.map((m, idx) => {
            const isCompleted = completedMissions.includes(m.id);
            const isCurrent = idx === activeMissionIndex;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMission(idx)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${
                  isCurrent
                    ? "bg-amber-400 text-amber-950 border-b-4 border-amber-600 shadow-md scale-105"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-400"
                    : "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Star className={`h-3.5 w-3.5 ${isCurrent ? "text-amber-800 fill-amber-500" : "text-slate-400"}`} />
                )}
                <span>Soal {m.id} ({m.baseRed}:{m.baseBlue})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. FRIENDLY MASCOT INSTRUCTION BUBBLE */}
      <MascotBubble
        message={getMascotMessage()}
        emotion={getMascotEmotion()}
        mascotName="Robi si Robot Lab 🤖"
      />

      {/* 2. CLONING MACHINE HERO CARD */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-b-8 border-amber-600 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 sm:p-7 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-block rounded-full bg-white/25 px-4 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                Tahap 2: Proses &bull; Soal {currentMission.id} dari 3 ⚡
              </span>
              {completedMissions.includes(currentMission.id) && (
                <span className="rounded-full bg-emerald-400/90 text-emerald-950 px-3 py-0.5 text-xs font-black">
                  Tuntas ⭐
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow">
              Mesin Kloning Rasio {currentMission.baseRed} : {currentMission.baseBlue}!
            </h1>
            <p className="text-amber-100 text-sm sm:text-base font-bold">
              Amati bagaimana paket rasio {currentMission.baseRed}:{currentMission.baseBlue} dilipatgandakan tanpa mengubah perbandingannya!
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border-4 border-yellow-200 bg-white px-5 py-3 text-slate-900 shadow-xl shrink-0">
            <span className="text-3xl">🔬</span>
            <div className="text-left">
              <span className="text-xs font-black text-amber-700 uppercase block">
                Kelipatan Saat Ini
              </span>
              <span className="text-2xl font-black text-amber-500">
                {multiplier}x Paket
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLONING CHAMBER & GIANT MULTIPLY BUTTON */}
      <section className="rounded-3xl border-4 border-b-8 border-amber-400 bg-amber-50/80 p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b-4 border-amber-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-lg sm:text-xl font-black text-amber-950">
              Kamar Kloning &bull; Soal {currentMission.id}
            </h2>
          </div>

          <button
            onClick={handleReset}
            disabled={multiplier === 1}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-amber-800 border-b-4 border-amber-300 shadow hover:bg-amber-100 active:translate-y-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Mulai Ulang (1x)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Chamber: Shows the Batches of Chips (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm font-black text-amber-900 px-1">
              <span>Paket Terkloning ({multiplier} Paket)</span>
              <span className="bg-amber-200 border-2 border-amber-400 px-3 py-0.5 rounded-full text-xs font-black">
                {currentRed} Merah &bull; {currentBlue} Biru (Total: {currentRed + currentBlue})
              </span>
            </div>

            <div className="relative min-h-[220px] rounded-3xl border-4 border-dashed border-amber-400 bg-white p-5 shadow-inner flex flex-col justify-center overflow-hidden">
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                {Array.from({ length: multiplier }).map((_, batchIdx) => (
                  <motion.div
                    key={`batch-${batchIdx}`}
                    initial={{ scale: 0.6, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                      delay: batchIdx * 0.1,
                    }}
                    className="flex flex-col items-center rounded-3xl border-4 border-amber-300 bg-amber-50 p-4 shadow-md"
                  >
                    <span className="mb-2 rounded-full bg-amber-200 border border-amber-400 px-3 py-0.5 text-xs font-black text-amber-900">
                      Paket #{batchIdx + 1} ({currentMission.baseRed} : {currentMission.baseBlue})
                    </span>

                    <div className="flex items-center gap-3">
                      {/* Red Chips sub-group */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: currentMission.baseRed }).map((_, num) => (
                          <div
                            key={`batch-${batchIdx}-red-${num}`}
                            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-red-600 text-white font-black text-sm shadow-md border-b-4 border-rose-800"
                          >
                            🔴
                          </div>
                        ))}
                      </div>

                      <span className="text-xl font-black text-slate-400">:</span>

                      {/* Blue Chips sub-group */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: currentMission.baseBlue }).map((_, num) => (
                          <div
                            key={`batch-${batchIdx}-blue-${num}`}
                            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white font-black text-sm shadow-md border-b-4 border-sky-800"
                          >
                            🔵
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* GIANT MULTIPLY 3D BUTTON (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center gap-3">
            <motion.button
              onClick={handleMultiply}
              disabled={multiplier >= 3 || isCloning}
              whileHover={multiplier < 3 ? { scale: 1.05 } : {}}
              whileTap={multiplier < 3 ? { scale: 0.95 } : {}}
              className={`w-full max-w-[300px] min-h-20 rounded-full font-black text-xl border-b-6 shadow-2xl transition-all flex flex-col items-center justify-center p-5 ${
                multiplier >= 3
                  ? "bg-slate-200 border-slate-400 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-600 shadow-amber-400/50 cursor-pointer active:translate-y-1"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-7 w-7 text-amber-950 fill-amber-300 animate-bounce" />
                <span>
                  {multiplier === 1
                    ? "GANDAKAN (2x)! 🚀"
                    : multiplier === 2
                    ? "GANDAKAN (3x)! ⚡"
                    : "Kloning Selesai! 🎉"}
                </span>
              </div>
              <span className="text-xs font-extrabold text-amber-900 mt-0.5">
                {multiplier < 3 ? "Sentuh Tombol Ini! 👇" : "Lanjut ke Refleksi"}
              </span>
            </motion.button>

            {multiplier >= 3 && !isAnswerSubmitted && (
              <button
                onClick={() => setShowReflectionModal(true)}
                className="btn-game-green min-h-14 px-8 text-lg"
              >
                <span>Buka Pertanyaan Refleksi! 💡</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. STEP-BY-STEP FOCUS: AUTO-FILLING TABLE */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📋 Catatan Hasil Kloning Rasio Soal {currentMission.id}</span>
            </h3>
            <span className="text-xs font-black text-amber-800 bg-amber-200 px-3 py-1 rounded-full">
              Terbuka {history.length} dari 3 Langkah
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border-4 border-amber-300 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base font-bold">
                <thead className="bg-amber-100 border-b-4 border-amber-200 text-amber-950 font-black text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Langkah</th>
                    <th className="py-3 px-4 text-rose-600">🔴 Merah</th>
                    <th className="py-3 px-4 text-sky-600">🔵 Biru</th>
                    <th className="py-3 px-4">Rasio Tertulis</th>
                    <th className="py-3 px-4 text-emerald-700">Hasil Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-amber-100">
                  {history.map((row) => (
                    <motion.tr
                      key={`history-row-${row.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-amber-50"
                    >
                      <td className="py-3 px-4 font-black text-slate-900">
                        {row.multiplier === 1
                          ? "Mula-Mula (1x)"
                          : `Kelipatan (${row.multiplier}x)`}
                      </td>
                      <td className="py-3 px-4 font-black text-rose-600">
                        {row.redCount} Keping
                      </td>
                      <td className="py-3 px-4 font-black text-sky-600">
                        {row.blueCount} Keping
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        <span className="rounded-full bg-amber-200 px-3 py-1">
                          {row.ratioText}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600">
                        ✅ Tetap Senilai ({currentMission.baseRed}:{currentMission.baseBlue})
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REFLECTION POP-UP QUESTION CARD (PORTALED TO BODY FOR 100% BLUR) */}
      <ModalPortal>
        <AnimatePresence>
          {showReflectionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-sky-950/75 p-4 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.75, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.75, y: 30 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="relative w-full max-w-lg rounded-3xl border-4 border-b-8 border-amber-500 bg-white p-6 sm:p-8 shadow-2xl space-y-5"
              >
                <div className="flex items-center gap-3 border-b-4 border-amber-100 pb-3">
                  <span className="text-4xl animate-bounce">💡</span>
                  <div>
                    <span className="text-xs font-black uppercase text-amber-700 block">
                      Refleksi Soal {currentMission.id} dari 3
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Teka-Teki Rasio Senilai!
                    </h3>
                  </div>
                </div>

                {!isAnswerSubmitted ? (
                  <form onSubmit={handleSubmitReflection} className="space-y-4">
                    <div className="rounded-2xl border-4 border-amber-200 bg-amber-50 p-4">
                      <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        &ldquo;{currentMission.question}&rdquo;
                      </p>
                      <p className="mt-1 text-xs font-bold text-amber-800">
                        Petunjuk: {currentMission.hint}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-black text-slate-800">
                        Tulis pendapatmu di sini ya:
                      </label>
                      <textarea
                        required
                        value={reflectionAnswer}
                        onChange={(e) => setReflectionAnswer(e.target.value)}
                        rows={3}
                        placeholder="Contoh: Karena kedua warna sama-sama dikalikan angka yang sama, jadi rasionya tetap senilai..."
                        className="w-full rounded-2xl border-4 border-slate-200 p-3.5 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:outline-none transition"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReflectionModal(false)}
                        className="text-xs font-black text-slate-500 hover:text-slate-800"
                      >
                        Tutup Dulu
                      </button>

                      <button
                        type="submit"
                        disabled={!reflectionAnswer.trim()}
                        className="w-full sm:w-auto btn-game-yellow min-h-14 px-8 text-lg"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        <span>Kirim Jawaban! 🚀</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5 text-center">
                    <div className="text-6xl animate-bounce">
                      🎉 ⭐ 🥳
                    </div>

                    <div className="space-y-1">
                      <span className="rounded-full bg-emerald-100 border-2 border-emerald-400 px-4 py-1 text-xs font-black text-emerald-900 uppercase">
                        Soal {currentMission.id} dari 3 Tuntas! ⭐
                      </span>
                      <h4 className="text-2xl font-black text-slate-900">
                        Pemikiran Hebat!
                      </h4>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed max-w-md mx-auto">
                        {currentMission.explanation}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      {activeMissionIndex < PROSES_MISSIONS.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNextMission}
                          className="w-full btn-game-green min-h-16 px-8 text-xl"
                        >
                          <span>Lanjut ke Soal {currentMission.id + 1} ({PROSES_MISSIONS[activeMissionIndex + 1].baseRed}:{PROSES_MISSIONS[activeMissionIndex + 1].baseBlue})! 🚀</span>
                          <ArrowRight className="h-6 w-6 ml-2" />
                        </button>
                      ) : (
                        <Link
                          href="/objek"
                          className="w-full btn-game-green min-h-16 px-8 text-xl"
                        >
                          <span>Semua Soal Proses Tuntas! Lanjut ke Objek! 📦</span>
                          <ArrowRight className="h-6 w-6 ml-2" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  );
}
