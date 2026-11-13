"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  Trophy,
  Volume2,
  VolumeX,
  GlassWater,
  Check,
  Star,
} from "lucide-react";
import { soundFx } from "@/lib/audio";
import { saveReflectionAction } from "@/actions/reflection";
import MascotBubble from "@/components/MascotBubble";
import ModalPortal from "@/components/ModalPortal";

interface SkemaChallenge {
  id: number;
  title: string;
  name: string;
  emoji: string;
  recipeText: string;
  syrupAmount: number;
  targetWater: number;
  problemStatement: string;
  explanation: string;
}

const SKEMA_CHALLENGES: SkemaChallenge[] = [
  {
    id: 1,
    title: "Tantangan 1",
    name: "Jus Cocopandan",
    emoji: "🍹",
    recipeText: "1 Sirup : 4 Air",
    syrupAmount: 5,
    targetWater: 20,
    problemStatement:
      "Resep minuman menggunakan perbandingan sirup dan air 1:4. Jika digunakan 5 gelas sirup, berapa gelas air yang dibutuhkan?",
    explanation:
      "Racikan Sempurna! 🎉 Kamu menuangkan tepat 20 gelas air untuk 5 gelas sirup (Rasio 5:20 = 1:4)!",
  },
  {
    id: 2,
    title: "Tantangan 2",
    name: "Jus Stroberi Segar",
    emoji: "🍓",
    recipeText: "2 Sirup : 3 Air",
    syrupAmount: 6,
    targetWater: 9,
    problemStatement:
      "Resep jus stroberi menggunakan perbandingan sirup dan air 2:3. Jika digunakan 6 gelas sirup, berapa gelas air yang dibutuhkan?",
    explanation:
      "Racikan Pas! 🎉 6 gelas sirup membutuhkan tepat 9 gelas air karena kelipatan 3x (Rasio 6:9 = 2:3)!",
  },
  {
    id: 3,
    title: "Tantangan 3",
    name: "Lemonade Segar",
    emoji: "🍋",
    recipeText: "1 Sirup : 5 Air",
    syrupAmount: 4,
    targetWater: 20,
    problemStatement:
      "Resep lemonade menggunakan perbandingan sirup dan air 1:5. Jika digunakan 4 gelas sirup, berapa gelas air yang dibutuhkan?",
    explanation:
      "Luar Biasa Koki Hebat! 🎉 4 gelas sirup membutuhkan 20 gelas air (Rasio 4:20 = 1:5)! Semua 3 tantangan koki tuntas!",
  },
];

export default function SkemaPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active challenge state (1, 2, or 3)
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const currentChallenge = SKEMA_CHALLENGES[activeChallengeIndex];

  // Completed challenges tracking
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  // Pouring & challenge states
  const [waterCount, setWaterCount] = useState<number>(0);
  const [isChallengeTested, setIsChallengeTested] = useState<boolean>(false);
  const [isChallengeSuccess, setIsChallengeSuccess] = useState<boolean>(false);
  const [challengeFeedback, setChallengeFeedback] = useState<string>("");
  const [isPouringAnim, setIsPouringAnim] = useState<boolean>(false);

  // LKPD Form States
  const [dailyExample, setDailyExample] = useState("");
  const [understoodText, setUnderstoodText] = useState("");
  const [confusedText, setConfusedText] = useState("");
  const [isSubmittingLkpd, setIsSubmittingLkpd] = useState(false);
  const [lkpdSuccess, setLkpdSuccess] = useState(false);
  const [lkpdError, setLkpdError] = useState<string | null>(null);

  const lkpdSectionRef = useRef<HTMLDivElement>(null);

  const playSound = (type: "pour" | "pop" | "success" | "retry") => {
    if (!soundEnabled) return;
    if (type === "pour") soundFx.playPour();
    if (type === "pop") soundFx.playPop();
    if (type === "success") soundFx.playSuccess();
    if (type === "retry") soundFx.playRetry();
  };

  const handleSelectChallenge = (index: number) => {
    if (index === activeChallengeIndex) return;
    playSound("pop");
    setActiveChallengeIndex(index);
    setWaterCount(0);
    setIsChallengeTested(false);
    setIsChallengeSuccess(false);
    setChallengeFeedback("");
  };

  const handlePourWater = (amount = 1) => {
    playSound("pour");
    setIsPouringAnim(true);
    setTimeout(() => setIsPouringAnim(false), 250);

    setWaterCount((prev) => Math.min(prev + amount, 30));
    if (isChallengeTested && !isChallengeSuccess) {
      setIsChallengeTested(false);
    }
  };

  const handleDecreaseWater = () => {
    playSound("pop");
    setWaterCount((prev) => Math.max(0, prev - 1));
    if (isChallengeTested && !isChallengeSuccess) {
      setIsChallengeTested(false);
    }
  };

  const handleResetWater = () => {
    playSound("pop");
    setWaterCount(0);
    setIsChallengeTested(false);
    setIsChallengeSuccess(false);
  };

  const handleSubmitChallenge = () => {
    if (waterCount === currentChallenge.targetWater) {
      playSound("success");
      setIsChallengeTested(true);
      setIsChallengeSuccess(true);
      setChallengeFeedback(currentChallenge.explanation);

      if (!completedChallenges.includes(currentChallenge.id)) {
        setCompletedChallenges((prev) => [...prev, currentChallenge.id]);
      }

      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
      });

      // If finished all 3 challenges, smoothly scroll to LKPD form
      if (
        activeChallengeIndex === SKEMA_CHALLENGES.length - 1 ||
        completedChallenges.length >= 2
      ) {
        setTimeout(() => {
          lkpdSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 600);
      }
    } else {
      playSound("retry");
      setIsChallengeTested(true);
      setIsChallengeSuccess(false);

      if (waterCount < currentChallenge.targetWater) {
        const diff = currentChallenge.targetWater - waterCount;
        setChallengeFeedback(
          `Masih terlalu kental/manis! Baru ada ${waterCount} gelas air. Tuang ${diff} gelas air lagi ya!`
        );
      } else {
        const diff = waterCount - currentChallenge.targetWater;
        setChallengeFeedback(
          `Kebanyakan air (${waterCount} gelas)! Rasanya jadi tawar. Kurangi ${diff} gelas air agar pas ${currentChallenge.targetWater}!`
        );
      }
    }
  };

  const handleNextChallenge = () => {
    playSound("pop");
    if (activeChallengeIndex < SKEMA_CHALLENGES.length - 1) {
      const nextIdx = activeChallengeIndex + 1;
      setActiveChallengeIndex(nextIdx);
      setWaterCount(0);
      setIsChallengeTested(false);
      setIsChallengeSuccess(false);
      setChallengeFeedback("");
    }
  };

  const handleSubmitLkpd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLkpdError(null);

    if (!dailyExample.trim() || !understoodText.trim() || !confusedText.trim()) {
      setLkpdError("Harap isi semua pertanyaan refleksi sebelum mengirim.");
      return;
    }

    setIsSubmittingLkpd(true);

    try {
      const localName =
        typeof window !== "undefined"
          ? localStorage.getItem("lab_rasio_student_name")
          : null;
      const localClass =
        typeof window !== "undefined"
          ? localStorage.getItem("lab_rasio_student_class")
          : "Kelas 5B";

      const result = await saveReflectionAction({
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
            studentClass: localClass || "Kelas 5B",
            dailyExample,
            understoodText,
            confusedText,
            createdAt: new Date().toISOString(),
          })
        );
      }

      if (result.success) {
        playSound("success");
        setLkpdSuccess(true);
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"],
        });
      } else {
        setLkpdError(result.error || "Gagal menyimpan refleksi.");
      }
    } catch {
      setLkpdError("Terjadi kesalahan teknis. Coba lagi.");
    } finally {
      setIsSubmittingLkpd(false);
    }
  };

  const pitcherFillPercent = Math.min(
    100,
    (waterCount / currentChallenge.targetWater) * 75 + 15
  );

  const getMascotMessage = () => {
    if (lkpdSuccess) {
      return "LUAR BIASA! 🏆 Kamu telah menyelesaikan seluruh petualangan Laboratorium Rasio dengan predikat bintang emas! 🥳";
    }
    if (isChallengeSuccess) {
      if (activeChallengeIndex < SKEMA_CHALLENGES.length - 1) {
        return `YESS! 🎉 ${currentChallenge.title} berhasil! Tekan tombol hijau untuk lanjut ke ${SKEMA_CHALLENGES[activeChallengeIndex + 1].title}! 🍹`;
      }
      return "HEBAT BANGET KOKI CILIK! 👑 Semua 3 resep kafe tuntas! Sekarang isi 3 pertanyaan di Lembar LKPD di bawah ya! 📝";
    }
    if (waterCount === 0) {
      return `Halo Koki Cilik! 👨‍🍳 ${currentChallenge.title}: Resep adalah ${currentChallenge.recipeText}. Ada ${currentChallenge.syrupAmount} sirup, tuang air sampai pas ${currentChallenge.targetWater} gelas ya! 💧`;
    }
    if (waterCount === currentChallenge.targetWater) {
      return `Pas ${currentChallenge.targetWater} gelas air! 🎯 Cepat tekan tombol kuning 'Cek Racikan Koki' di bawah! ⭐`;
    }
    if (waterCount > currentChallenge.targetWater) {
      return `Airnya kebanyakan (${waterCount} gelas)! Tekan 'Kurangi 1 Gelas' biar pas ${currentChallenge.targetWater} ya! 😮`;
    }
    return `Bagus! Sudah ada ${waterCount} gelas air. Terus tuang sampai pas ${currentChallenge.targetWater} gelas ya! 💧`;
  };

  const getMascotEmotion = () => {
    if (lkpdSuccess || isChallengeSuccess) return "celebrating";
    if (waterCount > currentChallenge.targetWater) return "surprised";
    return "happy";
  };

  return (
    <div className="space-y-6 pb-20">
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

        {/* 3 Challenge Stepper Pills (Smooth horizontal scroll on small screens) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SKEMA_CHALLENGES.map((c, idx) => {
            const isCompleted = completedChallenges.includes(c.id);
            const isCurrent = idx === activeChallengeIndex;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectChallenge(idx)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${
                  isCurrent
                    ? "bg-purple-600 text-white border-b-4 border-purple-800 shadow-md scale-105"
                    : isCompleted
                    ? "bg-purple-100 text-purple-900 border-2 border-purple-400"
                    : "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Star className={`h-3.5 w-3.5 ${isCurrent ? "text-yellow-300 fill-yellow-300" : "text-slate-400"}`} />
                )}
                <span>{c.title} ({c.name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. FRIENDLY MASCOT INSTRUCTION BUBBLE */}
      <MascotBubble
        message={getMascotMessage()}
        emotion={getMascotEmotion()}
        mascotName="Robi si Robot Koki 👨‍🍳"
      />

      {/* 2. CHEF CHALLENGE HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-b-8 border-purple-600 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 p-6 sm:p-7 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-block rounded-full bg-white/25 px-4 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                Tahap 4: Skema &bull; {currentChallenge.title} dari 3 👑
              </span>
              {completedChallenges.includes(currentChallenge.id) && (
                <span className="rounded-full bg-purple-300 text-purple-950 px-3 py-0.5 text-xs font-black">
                  Tuntas ⭐
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow">
              Tantangan Koki: {currentChallenge.name}! {currentChallenge.emoji}
            </h1>
            <p className="text-purple-100 text-sm sm:text-base font-bold">
              {currentChallenge.problemStatement}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border-4 border-purple-300 bg-white px-5 py-3 text-slate-900 shadow-xl shrink-0">
            <span className="text-3xl">{currentChallenge.emoji}</span>
            <div className="text-left">
              <span className="text-xs font-black text-purple-700 uppercase block">
                Resep Kafe
              </span>
              <span className="text-2xl font-black text-purple-600">
                {currentChallenge.recipeText}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAFE KITCHEN & INTERACTIVE WATER POURING */}
      <section className="rounded-3xl border-4 border-b-8 border-purple-400 bg-purple-50/80 p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT: Bottles & Pour Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Syrup Bottle */}
            <div className="flex items-center gap-4 rounded-3xl border-4 border-rose-300 bg-white p-4 shadow-md">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white font-black text-2xl shadow-md border-b-4 border-rose-700">
                {currentChallenge.emoji}
              </div>
              <div>
                <span className="text-xs font-black uppercase text-rose-600 block">
                  Bahan 1: Botol Sirup
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {currentChallenge.syrupAmount} Gelas Sirup (Sudah Masuk)
                </h4>
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1">
                  <Check className="h-3.5 w-3.5" /> Siap di Teko
                </span>
              </div>
            </div>

            {/* Water Bottle & Counter */}
            <div className="flex items-center gap-4 rounded-3xl border-4 border-sky-300 bg-white p-4 shadow-md">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white font-black text-2xl shadow-md border-b-4 border-sky-700">
                💧
              </div>
              <div>
                <span className="text-xs font-black uppercase text-sky-600 block">
                  Bahan 2: Botol Air
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-sky-700">
                    {waterCount}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    / target {currentChallenge.targetWater} gelas
                  </span>
                </div>
              </div>
            </div>

            {/* HUGE BOUNCY POUR BUTTONS */}
            <div className="space-y-3 pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePourWater(1)}
                  className="flex-1 btn-game-blue min-h-14 sm:min-h-16 px-4 sm:px-6 text-lg sm:text-xl touch-manipulation"
                >
                  <GlassWater className="h-5 w-5 sm:h-6 sm:w-6 mr-2 animate-bounce" />
                  <span>Tuang Air (+1) 💧</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePourWater(5)}
                  className="btn-game bg-sky-100 hover:bg-sky-200 text-sky-950 border-b-4 border-sky-400 px-4 text-sm font-black touch-manipulation"
                  title="Tuang 5 gelas sekaligus"
                >
                  <span>+5</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={handleDecreaseWater}
                  disabled={waterCount === 0}
                  className="text-xs font-black text-slate-600 hover:text-slate-900 disabled:opacity-40 py-1"
                >
                  - Kurangi 1 Gelas
                </button>

                <button
                  type="button"
                  onClick={handleResetWater}
                  disabled={waterCount === 0}
                  className="inline-flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-800 disabled:opacity-40 py-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kosongkan Air</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: GIANT PITCHER DISPLAY & VALIDATE BUTTON (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[320px] flex flex-col items-center">
              {/* Giant Pitcher */}
              <div className="relative w-full h-[210px] sm:h-[250px] rounded-b-[48px] rounded-t-3xl border-4 border-b-8 border-purple-400 bg-white p-4 shadow-2xl flex flex-col justify-end overflow-hidden">
                {/* Pour Stream */}
                <AnimatePresence>
                  {isPouringAnim && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 90 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 left-1/2 -translate-x-1/2 w-4 rounded-full bg-sky-400 shadow-lg z-20"
                    />
                  )}
                </AnimatePresence>

                {/* Mixed Liquid */}
                <motion.div
                  animate={{ height: `${pitcherFillPercent}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 14 }}
                  className={`w-full rounded-b-[40px] p-4 flex flex-col items-center justify-center text-white font-black shadow-inner relative ${
                    waterCount === currentChallenge.targetWater
                      ? "bg-gradient-to-t from-pink-500 via-rose-400 to-sky-300"
                      : waterCount > currentChallenge.targetWater
                      ? "bg-gradient-to-t from-sky-400 to-cyan-300"
                      : "bg-gradient-to-t from-rose-600 to-pink-500"
                  }`}
                >
                  <span className="text-sm sm:text-base drop-shadow">{currentChallenge.name}</span>
                  <span className="text-xs opacity-90">
                    {currentChallenge.syrupAmount} Sirup + {waterCount} Air
                  </span>
                </motion.div>
              </div>

              {/* Status Indicator */}
              <div className="mt-3 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black text-slate-800 bg-white rounded-2xl border-2 border-purple-300 px-3 sm:px-4 py-2 shadow-sm w-full">
                <span>Rasio Saat Ini:</span>
                <span className="rounded-full bg-purple-200 px-2.5 sm:px-3 py-0.5 text-purple-900">
                  {currentChallenge.syrupAmount} : {waterCount}
                </span>
                {waterCount === currentChallenge.targetWater && (
                  <span className="text-emerald-600 font-black">
                    (= {currentChallenge.recipeText}) ✅
                  </span>
                )}
              </div>

              {/* HUGE BOUNCY SUBMIT BUTTON */}
              <div className="mt-4 w-full">
                <button
                  type="button"
                  onClick={handleSubmitChallenge}
                  className="w-full btn-game-yellow min-h-14 sm:min-h-16 px-6 sm:px-8 text-lg sm:text-xl touch-manipulation"
                >
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-950 mr-2 animate-spin-slow" />
                  <span>Cek Racikan {currentChallenge.title}! 🍹</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Result Notice */}
        <AnimatePresence>
          {isChallengeTested && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-3xl p-5 border-4 space-y-3 ${
                isChallengeSuccess
                  ? "bg-emerald-100 border-emerald-400 text-emerald-950"
                  : "bg-amber-100 border-amber-400 text-amber-950"
              }`}
            >
              <div className="flex items-start gap-3">
                {isChallengeSuccess ? (
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-7 w-7 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-black text-lg">
                    {isChallengeSuccess
                      ? `HOREEE! ${currentChallenge.title} Sempurna! 🎉`
                      : "Periksa Kembali Racikanmu! 🤔"}
                  </h4>
                  <p className="text-sm font-bold mt-0.5">{challengeFeedback}</p>
                </div>
              </div>

              {isChallengeSuccess && activeChallengeIndex < SKEMA_CHALLENGES.length - 1 && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="btn-game-green min-h-14 px-8 text-lg"
                  >
                    <span>Lanjut ke {SKEMA_CHALLENGES[activeChallengeIndex + 1].title} ({SKEMA_CHALLENGES[activeChallengeIndex + 1].name})! 🍹</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. PART 2: DIGITAL LKPD */}
      <section
        ref={lkpdSectionRef}
        className="rounded-3xl border-4 border-b-8 border-teal-400 bg-white p-6 sm:p-8 shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-3 border-b-4 border-teal-200 pb-4">
          <span className="text-3xl">📝</span>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 block">
              Lembar Kerja Mandiri
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              LKPD Digital: Refleksi Pemahamanku
            </h3>
          </div>
        </div>

        {!lkpdSuccess ? (
          <form onSubmit={handleSubmitLkpd} className="space-y-5">
            {/* Field 1: Contoh Rasio Sehari-hari */}
            <div className="rounded-3xl border-4 border-teal-200 bg-teal-50 p-5 space-y-2">
              <label className="flex items-center gap-2 text-base font-black text-teal-950">
                <span>☕ 1. Buat satu contoh rasio dalam kehidupan sehari-hari:</span>
              </label>
              <textarea
                required
                rows={2}
                value={dailyExample}
                onChange={(e) => setDailyExample(e.target.value)}
                placeholder="Contoh: Saat membuat teh manis, 2 sendok gula untuk 1 cangkir air (2:1)..."
                className="w-full rounded-2xl border-4 border-teal-200 bg-white p-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none transition"
              />
            </div>

            {/* Field 2: Hal yang Dipahami */}
            <div className="rounded-3xl border-4 border-emerald-200 bg-emerald-50 p-5 space-y-2">
              <label className="flex items-center gap-2 text-base font-black text-emerald-950">
                <span>✨ 2. Hal yang saya pahami tentang rasio:</span>
              </label>
              <textarea
                required
                rows={2}
                value={understoodText}
                onChange={(e) => setUnderstoodText(e.target.value)}
                placeholder="Contoh: Rasio membandingkan dua kuantitas dan tetap senilai jika dikalikan pengali yang sama..."
                className="w-full rounded-2xl border-4 border-emerald-200 bg-white p-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* Field 3: Hal yang Membingungkan */}
            <div className="rounded-3xl border-4 border-amber-200 bg-amber-50 p-5 space-y-2">
              <label className="flex items-center gap-2 text-base font-black text-amber-950">
                <span>❓ 3. Hal yang masih membingungkan:</span>
              </label>
              <textarea
                required
                rows={2}
                value={confusedText}
                onChange={(e) => setConfusedText(e.target.value)}
                placeholder="Contoh: Menghitung rasio jika angkanya berupa bilangan pecahan..."
                className="w-full rounded-2xl border-4 border-amber-200 bg-white p-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>

            {lkpdError && (
              <div className="rounded-2xl border-4 border-rose-300 bg-rose-50 p-4 text-sm font-black text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{lkpdError}</span>
              </div>
            )}

            {/* HUGE BOUNCY SUBMIT LKPD BUTTON */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isSubmittingLkpd}
                className="w-full sm:w-auto btn-game-green min-h-14 sm:min-h-16 px-6 sm:px-12 text-lg sm:text-xl touch-manipulation"
              >
                {isSubmittingLkpd ? (
                  <span>Menyimpan ke Database... ⏳</span>
                ) : (
                  <>
                    <Send className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    <span>Kirim Lembar Refleksi (LKPD)! 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS SCREEN: "SELAMAT! KAMU TELAH MENYELESAIKAN LABORATORIUM RASIO!" */
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="rounded-3xl border-4 border-b-8 border-amber-400 bg-amber-50 p-8 text-center shadow-2xl space-y-6"
          >
            <div className="text-7xl animate-bounce">
              🎉 🏆 🥳
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="inline-block rounded-full bg-amber-200 border-2 border-amber-400 px-4 py-1 text-xs font-black text-amber-950 uppercase">
                🌟 LULUS LABORATORIUM RASIO DENGAN PREDIKAT BINTANG EMAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Selamat! Kamu telah menyelesaikan Laboratorium Rasio!
              </h2>
              <p className="text-base font-bold text-slate-700 leading-relaxed">
                Refleksi LKPD Digitalmu telah berhasil dikirim dan tersimpan di database.
                Kamu telah menuntaskan seluruh 4 pilar Teori APOS (masing-masing 3 tantangan) dengan sangat luar biasa!
              </p>
            </div>

            {/* 4 STAGES RECAP BADGES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="rounded-2xl border-4 border-rose-300 bg-white p-3 shadow-md">
                <span className="text-xs font-black text-rose-600">Tahap 1</span>
                <h5 className="font-black text-sm text-slate-900">Aksi (3 Soal)</h5>
                <span className="text-xs font-black text-emerald-600 block mt-1">✅ 300 XP</span>
              </div>
              <div className="rounded-2xl border-4 border-amber-300 bg-white p-3 shadow-md">
                <span className="text-xs font-black text-amber-600">Tahap 2</span>
                <h5 className="font-black text-sm text-slate-900">Proses (3 Soal)</h5>
                <span className="text-xs font-black text-emerald-600 block mt-1">✅ 300 XP</span>
              </div>
              <div className="rounded-2xl border-4 border-emerald-300 bg-white p-3 shadow-md">
                <span className="text-xs font-black text-emerald-600">Tahap 3</span>
                <h5 className="font-black text-sm text-slate-900">Objek (3 Soal)</h5>
                <span className="text-xs font-black text-emerald-600 block mt-1">✅ 300 XP</span>
              </div>
              <div className="rounded-2xl border-4 border-purple-300 bg-white p-3 shadow-md">
                <span className="text-xs font-black text-purple-600">Tahap 4</span>
                <h5 className="font-black text-sm text-slate-900">Skema (3 Soal)</h5>
                <span className="text-xs font-black text-emerald-600 block mt-1">✅ 300 XP</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/"
                className="w-full sm:w-auto btn-game-yellow min-h-16 px-12 text-xl"
              >
                <Trophy className="h-6 w-6 mr-2" />
                <span>Kembali ke Peta Petualangan! 🏠</span>
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
