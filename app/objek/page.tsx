"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Volume2,
  VolumeX,
  Star,
} from "lucide-react";
import { soundFx } from "@/lib/audio";
import MascotBubble from "@/components/MascotBubble";
import ModalPortal from "@/components/ModalPortal";

interface RatioCard {
  id: string;
  code: string;
  ratioText: string;
  antecedent: number;
  consequent: number;
  simplified: string;
  emoji: string;
  pairGroup: "group-1" | "group-2";
  colorTheme: {
    badge: string;
    bgHover: string;
  };
}

interface ObjekRound {
  id: number;
  title: string;
  pairSummary: string;
  cards: RatioCard[];
}

const OBJEK_ROUNDS: ObjekRound[] = [
  {
    id: 1,
    title: "Ronde 1",
    pairSummary: "2:3 = 4:6 dan 3:5 = 6:10",
    cards: [
      {
        id: "r1-card-a",
        code: "Kartu A",
        ratioText: "2 : 3",
        antecedent: 2,
        consequent: 3,
        simplified: "2:3",
        emoji: "🍎",
        pairGroup: "group-1",
        colorTheme: {
          badge: "bg-rose-100 text-rose-800 border-rose-300",
          bgHover: "hover:border-rose-400",
        },
      },
      {
        id: "r1-card-b",
        code: "Kartu B",
        ratioText: "4 : 6",
        antecedent: 4,
        consequent: 6,
        simplified: "2:3",
        emoji: "🍎",
        pairGroup: "group-1",
        colorTheme: {
          badge: "bg-amber-100 text-amber-800 border-amber-300",
          bgHover: "hover:border-amber-400",
        },
      },
      {
        id: "r1-card-c",
        code: "Kartu C",
        ratioText: "3 : 5",
        antecedent: 3,
        consequent: 5,
        simplified: "3:5",
        emoji: "🍊",
        pairGroup: "group-2",
        colorTheme: {
          badge: "bg-sky-100 text-sky-800 border-sky-300",
          bgHover: "hover:border-sky-400",
        },
      },
      {
        id: "r1-card-d",
        code: "Kartu D",
        ratioText: "6 : 10",
        antecedent: 6,
        consequent: 10,
        simplified: "3:5",
        emoji: "🍊",
        pairGroup: "group-2",
        colorTheme: {
          badge: "bg-purple-100 text-purple-800 border-purple-300",
          bgHover: "hover:border-purple-400",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Ronde 2",
    pairSummary: "1:2 = 4:8 dan 2:5 = 6:15",
    cards: [
      {
        id: "r2-card-a",
        code: "Kartu A",
        ratioText: "1 : 2",
        antecedent: 1,
        consequent: 2,
        simplified: "1:2",
        emoji: "🍇",
        pairGroup: "group-1",
        colorTheme: {
          badge: "bg-purple-100 text-purple-800 border-purple-300",
          bgHover: "hover:border-purple-400",
        },
      },
      {
        id: "r2-card-b",
        code: "Kartu B",
        ratioText: "4 : 8",
        antecedent: 4,
        consequent: 8,
        simplified: "1:2",
        emoji: "🍇",
        pairGroup: "group-1",
        colorTheme: {
          badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
          bgHover: "hover:border-indigo-400",
        },
      },
      {
        id: "r2-card-c",
        code: "Kartu C",
        ratioText: "2 : 5",
        antecedent: 2,
        consequent: 5,
        simplified: "2:5",
        emoji: "🍒",
        pairGroup: "group-2",
        colorTheme: {
          badge: "bg-rose-100 text-rose-800 border-rose-300",
          bgHover: "hover:border-rose-400",
        },
      },
      {
        id: "r2-card-d",
        code: "Kartu D",
        ratioText: "6 : 15",
        antecedent: 6,
        consequent: 15,
        simplified: "2:5",
        emoji: "🍒",
        pairGroup: "group-2",
        colorTheme: {
          badge: "bg-amber-100 text-amber-800 border-amber-300",
          bgHover: "hover:border-amber-400",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Ronde 3",
    pairSummary: "3:4 = 9:12 dan 1:3 = 5:15",
    cards: [
      {
        id: "r3-card-a",
        code: "Kartu A",
        ratioText: "3 : 4",
        antecedent: 3,
        consequent: 4,
        simplified: "3:4",
        emoji: "🍋",
        pairGroup: "group-1",
        colorTheme: {
          badge: "bg-amber-100 text-amber-800 border-amber-300",
          bgHover: "hover:border-amber-400",
        },
      },
      {
        id: "r3-card-b",
        code: "Kartu B",
        ratioText: "9 : 12",
        antecedent: 9,
        consequent: 12,
        simplified: "3:4",
        emoji: "🍋",
        pairGroup: "group-1",
        colorTheme: {
          badge: "bg-teal-100 text-teal-800 border-teal-300",
          bgHover: "hover:border-teal-400",
        },
      },
      {
        id: "r3-card-c",
        code: "Kartu C",
        ratioText: "1 : 3",
        antecedent: 1,
        consequent: 3,
        simplified: "1:3",
        emoji: "🍉",
        pairGroup: "group-2",
        colorTheme: {
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
          bgHover: "hover:border-emerald-400",
        },
      },
      {
        id: "r3-card-d",
        code: "Kartu D",
        ratioText: "5 : 15",
        antecedent: 5,
        consequent: 15,
        simplified: "1:3",
        emoji: "🍉",
        pairGroup: "group-2",
        colorTheme: {
          badge: "bg-rose-100 text-rose-800 border-rose-300",
          bgHover: "hover:border-rose-400",
        },
      },
    ],
  },
];

export default function ObjekPage() {
  const [activeRoundIndex, setActiveRoundIndex] = useState<number>(0);
  const currentRound = OBJEK_ROUNDS[activeRoundIndex];

  const [completedRounds, setCompletedRounds] = useState<number[]>([]);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedCardIds, setMatchedCardIds] = useState<string[]>([]);
  const [mismatchIds, setMismatchIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (type: "pop" | "success" | "retry") => {
    if (!soundEnabled) return;
    if (type === "pop") soundFx.playPop();
    if (type === "success") soundFx.playSuccess();
    if (type === "retry") soundFx.playRetry();
  };

  const handleSelectRound = (index: number) => {
    if (index === activeRoundIndex) return;
    playSound("pop");
    setActiveRoundIndex(index);
    setSelectedCardId(null);
    setMatchedCardIds([]);
    setMismatchIds([]);
  };

  const handleCardClick = (card: RatioCard) => {
    if (matchedCardIds.includes(card.id)) return;

    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      playSound("pop");
      return;
    }

    if (!selectedCardId) {
      setSelectedCardId(card.id);
      playSound("pop");
      return;
    }

    const firstCard = currentRound.cards.find((c) => c.id === selectedCardId);
    if (!firstCard) return;

    if (firstCard.simplified === card.simplified) {
      playSound("success");
      const updatedMatches = [...matchedCardIds, firstCard.id, card.id];
      setMatchedCardIds(updatedMatches);
      setSelectedCardId(null);

      if (updatedMatches.length === currentRound.cards.length) {
        if (!completedRounds.includes(currentRound.id)) {
          setCompletedRounds((prev) => [...prev, currentRound.id]);
        }

        setTimeout(() => {
          confetti({
            particleCount: 130,
            spread: 85,
            origin: { y: 0.6 },
            colors: ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"],
          });
        }, 200);
      }
    } else {
      playSound("retry");
      setMismatchIds([firstCard.id, card.id]);

      setTimeout(() => {
        setMismatchIds([]);
        setSelectedCardId(null);
      }, 700);
    }
  };

  const handleResetGame = () => {
    playSound("pop");
    setSelectedCardId(null);
    setMatchedCardIds([]);
    setMismatchIds([]);
  };

  const handleNextRound = () => {
    playSound("pop");
    if (activeRoundIndex < OBJEK_ROUNDS.length - 1) {
      const nextIdx = activeRoundIndex + 1;
      setActiveRoundIndex(nextIdx);
      setSelectedCardId(null);
      setMatchedCardIds([]);
      setMismatchIds([]);
    }
  };

  const isAllMatched = matchedCardIds.length === currentRound.cards.length;
  const matchedPairsCount = Math.floor(matchedCardIds.length / 2);

  const getMascotMessage = () => {
    if (isAllMatched) {
      if (activeRoundIndex < OBJEK_ROUNDS.length - 1) {
        return `HOREEE! 🏆 Ronde ${currentRound.id} tuntas sempurna! Tekan tombol hijau untuk lanjut ke Ronde ${currentRound.id + 1}! 🎯`;
      }
      return "LUAR BIASA! 👑 Semua 3 ronde berburu rasio senilai telah tuntas! Kamu resmi jadi Master Objek Rasio! Ayo lanjut ke Skema! ⭐";
    }
    if (selectedCardId) {
      const card = currentRound.cards.find((c) => c.id === selectedCardId);
      return `Kartu ${card?.code} (${card?.ratioText}) dipilih! Sekarang sentuh kartu kedua yang nilainya setara/senilai ya! 🔍`;
    }
    if (matchedPairsCount === 1) {
      return "Keren banget! 1 pasang sudah cocok! Tinggal 1 pasang kartu lagi! Ayo selesaikan! 🎯";
    }
    return `Ronde ${currentRound.id}: Ayo sentuh dua kartu yang memiliki perbandingan senilai (sama nilainya)! 🎯`;
  };

  const getMascotEmotion = () => {
    if (isAllMatched) return "celebrating";
    if (selectedCardId) return "thinking";
    return "happy";
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-black text-sm text-slate-800 border-b-4 border-slate-300 shadow-md hover:bg-slate-50 active:translate-y-1 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali ke Peta</span>
        </Link>

        {/* 3 Round Stepper Pills */}
        <div className="flex items-center gap-2">
          {OBJEK_ROUNDS.map((r, idx) => {
            const isCompleted = completedRounds.includes(r.id);
            const isCurrent = idx === activeRoundIndex;
            return (
              <button
                key={r.id}
                onClick={() => handleSelectRound(idx)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                  isCurrent
                    ? "bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-md scale-105"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-400"
                    : "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Star className={`h-4 w-4 ${isCurrent ? "text-yellow-300 fill-yellow-300" : "text-slate-400"}`} />
                )}
                <span>Ronde {r.id}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-black text-xs text-slate-700 border-b-4 border-slate-300 shadow-md hover:bg-slate-50 active:translate-y-1 transition"
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

      {/* 1. FRIENDLY MASCOT INSTRUCTION BUBBLE */}
      <MascotBubble
        message={getMascotMessage()}
        emotion={getMascotEmotion()}
        mascotName="Robi si Robot Lab 🤖"
      />

      {/* 2. OBJECT HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-b-8 border-emerald-600 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 p-6 sm:p-7 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-block rounded-full bg-white/25 px-4 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                Tahap 3: Objek &bull; Ronde {currentRound.id} dari 3 📦
              </span>
              {completedRounds.includes(currentRound.id) && (
                <span className="rounded-full bg-emerald-300 text-emerald-950 px-3 py-0.5 text-xs font-black">
                  Tuntas ⭐
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow">
              Berburu Pasangan Rasio Senilai!
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-bold">
              Temukan 2 pasang kartu yang memiliki perbandingan nilai pecahan yang sama persis!
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border-4 border-emerald-300 bg-white px-5 py-3 text-slate-900 shadow-xl shrink-0">
            <span className="text-3xl">⚖️</span>
            <div className="text-left">
              <span className="text-xs font-black text-emerald-700 uppercase block">
                Pasangan Ditemukan
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {matchedPairsCount} / 2 Pasang
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GAME BOARD WITH 4 CHUNKY 3D CARDS */}
      <section className="rounded-3xl border-4 border-b-8 border-emerald-400 bg-emerald-50/80 p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b-4 border-emerald-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-lg sm:text-xl font-black text-emerald-950">
              Papan Kartu &bull; Ronde {currentRound.id}
            </h2>
          </div>

          <button
            onClick={handleResetGame}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-emerald-800 border-b-4 border-emerald-300 shadow hover:bg-emerald-100 active:translate-y-1 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Kocok Ulang Ronde Ini</span>
          </button>
        </div>

        {/* 4 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {currentRound.cards.map((card) => {
            const isMatched = matchedCardIds.includes(card.id);
            const isSelected = selectedCardId === card.id;
            const isMismatch = mismatchIds.includes(card.id);

            return (
              <motion.div
                key={card.id}
                whileHover={!isMatched ? { y: -6, scale: 1.04 } : {}}
                whileTap={!isMatched ? { scale: 0.96 } : {}}
                onClick={() => handleCardClick(card)}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 cursor-pointer select-none min-h-[220px] ${
                  isMatched
                    ? "border-4 border-b-8 border-emerald-600 bg-emerald-100 shadow-xl ring-4 ring-emerald-400 cursor-default"
                    : isSelected
                    ? "border-4 border-b-8 border-amber-500 bg-amber-100 shadow-2xl ring-6 ring-amber-400 animate-pulse"
                    : isMismatch
                    ? "border-4 border-b-8 border-rose-500 bg-rose-100 shadow-md ring-4 ring-rose-400"
                    : `border-4 border-b-8 border-slate-300 bg-white shadow-lg hover:border-sky-400`
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 py-0.5 text-xs font-black uppercase tracking-wider ${
                      isMatched
                        ? "bg-emerald-200 text-emerald-900 border-emerald-400"
                        : card.colorTheme.badge
                    }`}
                  >
                    {card.code}
                  </span>

                  {isMatched ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-black text-sm shadow-md animate-bounce">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                  ) : isSelected ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-900 font-black text-sm shadow-md">
                      ⭐
                    </span>
                  ) : (
                    <span className="text-xl">{card.emoji}</span>
                  )}
                </div>

                {/* Central Big Ratio */}
                <div className="my-4 text-center space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight block">
                    {card.ratioText}
                  </span>
                  <span className="text-xs font-black text-slate-500 block">
                    Pecahan: {card.antecedent}/{card.consequent}
                  </span>
                </div>

                {/* Bottom Status */}
                <div className="border-t-2 border-slate-100 pt-3 text-center">
                  {isMatched ? (
                    <span className="text-xs font-black text-emerald-700">
                      ✅ Pasangan Cocok!
                    </span>
                  ) : isSelected ? (
                    <span className="text-xs font-black text-amber-800">
                      👇 Sentuh Kartu Pasangannya!
                    </span>
                  ) : (
                    <span className="text-xs font-black text-slate-400">
                      Sentuh Untuk Memilih
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. VISUAL CELEBRATION MODAL (PORTALED TO BODY FOR 100% BLUR) */}
      <ModalPortal>
        <AnimatePresence>
          {isAllMatched && (
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
                className="relative w-full max-w-md rounded-3xl border-4 border-b-8 border-emerald-600 bg-white p-6 sm:p-8 text-center shadow-2xl space-y-5"
              >
                <div className="text-6xl animate-bounce">
                  🎉 ⭐ 🥳
                </div>

                <div className="space-y-1.5">
                  <span className="inline-block rounded-full bg-emerald-100 border-2 border-emerald-400 px-4 py-1 text-xs font-black text-emerald-900 uppercase">
                    Ronde {currentRound.id} dari 3 Tuntas! ⭐
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Hebat! Semua Pasangan Cocok!
                  </h3>
                  <p className="text-sm font-bold text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Kamu berhasil membuktikan bahwa <strong>{currentRound.pairSummary}</strong> adalah pasangan objek rasio yang senilai!
                  </p>
                </div>

                <div className="rounded-2xl border-4 border-amber-300 bg-amber-50 p-4 flex items-center justify-center gap-3">
                  <Trophy className="h-10 w-10 text-amber-500 fill-amber-400" />
                  <div className="text-left">
                    <span className="text-xs font-black text-amber-800 uppercase block">
                      Poin Ronde {currentRound.id}
                    </span>
                    <span className="text-lg font-black text-amber-950">
                      +100 XP Pasangan Objek
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  {activeRoundIndex < OBJEK_ROUNDS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextRound}
                      className="w-full btn-game-green min-h-16 px-8 text-xl"
                    >
                      <span>Lanjut ke Ronde {currentRound.id + 1}! 🎯</span>
                      <ArrowRight className="h-6 w-6 ml-2" />
                    </button>
                  ) : (
                    <Link
                      href="/skema"
                      className="w-full btn-game-green min-h-16 px-8 text-xl"
                    >
                      <span>Semua Ronde Selesai! Lanjut ke Skema! 👑</span>
                      <ArrowRight className="h-6 w-6 ml-2" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleResetGame}
                    className="text-xs font-black text-slate-500 hover:text-slate-800 py-1"
                  >
                    Mainkan Ulang Ronde Ini
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  );
}
