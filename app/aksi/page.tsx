"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  CheckCircle2,
  Star,
} from "lucide-react";
import { soundFx } from "@/lib/audio";
import MascotBubble from "@/components/MascotBubble";
import ModalPortal from "@/components/ModalPortal";

interface ChipItem {
  id: string;
  color: "red" | "blue";
  label: string;
}

interface AksiMission {
  id: number;
  title: string;
  targetRed: number;
  targetBlue: number;
  description: string;
  totalRedChips: number;
  totalBlueChips: number;
}

const MISSIONS: AksiMission[] = [
  {
    id: 1,
    title: "Misi 1",
    targetRed: 2,
    targetBlue: 3,
    description: "Buat rasio awal dengan memasukkan 2 Merah dan 3 Biru ke dalam gelas ukur!",
    totalRedChips: 5,
    totalBlueChips: 6,
  },
  {
    id: 2,
    title: "Misi 2",
    targetRed: 3,
    targetBlue: 4,
    description: "Tantangan baru! Masukkan 3 Merah dan 4 Biru ke dalam gelas ukur!",
    totalRedChips: 6,
    totalBlueChips: 7,
  },
  {
    id: 3,
    title: "Misi 3",
    targetRed: 1,
    targetBlue: 5,
    description: "Misi pamungkas! Buat perbandingan 1 Merah dan 5 Biru di dalam gelas!",
    totalRedChips: 4,
    totalBlueChips: 8,
  },
];

const generateChips = (count: number, color: "red" | "blue", missionId: number): ChipItem[] => {
  const prefix = color === "red" ? "M" : "B";
  return Array.from({ length: count }, (_, i) => ({
    id: `m${missionId}-${color}-${i + 1}`,
    color,
    label: `${prefix}${i + 1}`,
  }));
};

export default function AksiPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active mission state (1, 2, or 3)
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const currentMission = MISSIONS[activeMissionIndex];

  // Completed missions tracking
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  // Chip collections
  const [redPool, setRedPool] = useState<ChipItem[]>([]);
  const [bluePool, setBluePool] = useState<ChipItem[]>([]);
  const [glassChips, setGlassChips] = useState<ChipItem[]>([]);

  // Validation state
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    isCorrect: boolean;
    message: string;
    detail: string;
  }>({
    tested: false,
    isCorrect: false,
    message: "",
    detail: "",
  });

  const [shakeGlass, setShakeGlass] = useState(false);

  // Initialize chips on mount or when mission changes
  const initMissionChips = (mission: AksiMission) => {
    setRedPool(generateChips(mission.totalRedChips, "red", mission.id));
    setBluePool(generateChips(mission.totalBlueChips, "blue", mission.id));
    setGlassChips([]);
    setValidationResult({ tested: false, isCorrect: false, message: "", detail: "" });
  };

  useEffect(() => {
    setIsMounted(true);
    initMissionChips(MISSIONS[0]);
  }, []);

  const playSound = (type: "pop" | "success" | "retry") => {
    if (!soundEnabled) return;
    if (type === "pop") soundFx.playPop();
    if (type === "success") soundFx.playSuccess();
    if (type === "retry") soundFx.playRetry();
  };

  const handleSelectMission = (index: number) => {
    if (index === activeMissionIndex) return;
    playSound("pop");
    setActiveMissionIndex(index);
    initMissionChips(MISSIONS[index]);
  };

  const currentRedCount = glassChips.filter((c) => c.color === "red").length;
  const currentBlueCount = glassChips.filter((c) => c.color === "blue").length;

  // Drag and Drop Handler
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (validationResult.tested && !validationResult.isCorrect) {
      setValidationResult((prev) => ({ ...prev, tested: false }));
    }

    let itemToMove: ChipItem | undefined;

    if (source.droppableId === "pool-red") {
      const updated = Array.from(redPool);
      [itemToMove] = updated.splice(source.index, 1);
      setRedPool(updated);
    } else if (source.droppableId === "pool-blue") {
      const updated = Array.from(bluePool);
      [itemToMove] = updated.splice(source.index, 1);
      setBluePool(updated);
    } else if (source.droppableId === "glass") {
      const updated = Array.from(glassChips);
      [itemToMove] = updated.splice(source.index, 1);
      setGlassChips(updated);
    }

    if (!itemToMove) return;

    playSound("pop");

    if (destination.droppableId === "glass") {
      setGlassChips((prev) => {
        const next = Array.from(prev);
        next.splice(destination.index, 0, itemToMove!);
        return next;
      });
    } else if (destination.droppableId === "pool-red") {
      if (itemToMove.color === "red") {
        setRedPool((prev) => {
          const next = Array.from(prev);
          next.splice(destination.index, 0, itemToMove!);
          return next;
        });
      } else {
        setBluePool((prev) => [...prev, itemToMove!]);
      }
    } else if (destination.droppableId === "pool-blue") {
      if (itemToMove.color === "blue") {
        setBluePool((prev) => {
          const next = Array.from(prev);
          next.splice(destination.index, 0, itemToMove!);
          return next;
        });
      } else {
        setRedPool((prev) => [...prev, itemToMove!]);
      }
    }
  };

  // Quick click helpers for touch friendliness
  const addChipToGlass = (chip: ChipItem) => {
    playSound("pop");
    if (chip.color === "red") {
      setRedPool((prev) => prev.filter((c) => c.id !== chip.id));
    } else {
      setBluePool((prev) => prev.filter((c) => c.id !== chip.id));
    }
    setGlassChips((prev) => [...prev, chip]);
    if (validationResult.tested && !validationResult.isCorrect) {
      setValidationResult((prev) => ({ ...prev, tested: false }));
    }
  };

  const returnChipToPool = (chip: ChipItem) => {
    playSound("pop");
    setGlassChips((prev) => prev.filter((c) => c.id !== chip.id));
    if (chip.color === "red") {
      setRedPool((prev) => [...prev, chip]);
    } else {
      setBluePool((prev) => [...prev, chip]);
    }
    if (validationResult.tested && !validationResult.isCorrect) {
      setValidationResult((prev) => ({ ...prev, tested: false }));
    }
  };

  const handleResetGlass = () => {
    playSound("pop");
    initMissionChips(currentMission);
  };

  const handleCheckResults = () => {
    const isRedMatch = currentRedCount === currentMission.targetRed;
    const isBlueMatch = currentBlueCount === currentMission.targetBlue;
    const isTotalMatch =
      glassChips.length === currentMission.targetRed + currentMission.targetBlue;

    if (isRedMatch && isBlueMatch && isTotalMatch) {
      playSound("success");
      setValidationResult({
        tested: true,
        isCorrect: true,
        message: "HOREEE! Kamu Berhasil! 🎉",
        detail: `Kamu memasukkan tepat ${currentMission.targetRed} keping merah dan ${currentMission.targetBlue} keping biru! Rasionya sempurna ${currentMission.targetRed} : ${currentMission.targetBlue}!`,
      });

      if (!completedMissions.includes(currentMission.id)) {
        setCompletedMissions((prev) => [...prev, currentMission.id]);
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#F43F5E", "#0EA5E9", "#FBBF24", "#10B981", "#A855F7"],
      });
    } else {
      playSound("retry");
      setShakeGlass(true);
      setTimeout(() => setShakeGlass(false), 500);

      let hint = "";
      if (glassChips.length === 0) {
        hint = `Gelasnya masih kosong lho! Ayo masukkan ${currentMission.targetRed} keping merah dan ${currentMission.targetBlue} keping biru ya!`;
      } else {
        const redDiff = currentRedCount - currentMission.targetRed;
        const blueDiff = currentBlueCount - currentMission.targetBlue;

        const redNotes =
          redDiff === 0
            ? `Merah sudah pas (${currentMission.targetRed})!`
            : redDiff > 0
            ? `Merah kebanyakan ${redDiff} keping.`
            : `Merah masih kurang ${Math.abs(redDiff)} keping.`;

        const blueNotes =
          blueDiff === 0
            ? `Biru sudah pas (${currentMission.targetBlue})!`
            : blueDiff > 0
            ? `Biru kebanyakan ${blueDiff} keping.`
            : `Biru masih kurang ${Math.abs(blueDiff)} keping.`;

        hint = `${redNotes} ${blueNotes} Yuk sesuaikan lagi!`;
      }

      setValidationResult({
        tested: true,
        isCorrect: false,
        message: "Yuk Coba Lagi, Sedikit Lagi Pas! 💪",
        detail: hint,
      });
    }
  };

  const handleNextMission = () => {
    playSound("pop");
    if (activeMissionIndex < MISSIONS.length - 1) {
      const nextIdx = activeMissionIndex + 1;
      setActiveMissionIndex(nextIdx);
      initMissionChips(MISSIONS[nextIdx]);
    }
  };

  // Determine Mascot Instruction based on current game state
  const getMascotMessage = () => {
    if (validationResult.tested && validationResult.isCorrect) {
      if (activeMissionIndex < MISSIONS.length - 1) {
        return `HEBAT BANGET! 🎉 Misi ${currentMission.id} tuntas! Ayo tekan tombol hijau untuk lanjut ke Misi ${currentMission.id + 1}! 🚀`;
      }
      return "LUAR BIASA! 🏆 Ketiga misi Aksi berhasil kamu tuntaskan dengan bintang emas! Sekarang ayo lanjut ke Tahap 2: Proses! ⭐";
    }
    if (validationResult.tested && !validationResult.isCorrect) {
      return validationResult.detail;
    }
    if (glassChips.length === 0) {
      return `Misi ${currentMission.id}: Masukkan ${currentMission.targetRed} keping merah dan ${currentMission.targetBlue} keping biru ke dalam gelas ya! 🚀`;
    }
    return `Keren! Di gelas ada ${currentRedCount} Merah dan ${currentBlueCount} Biru. Jika sudah pas ${currentMission.targetRed}:${currentMission.targetBlue}, tekan tombol kuning besar di bawah! ⭐`;
  };

  const getMascotEmotion = () => {
    if (validationResult.tested && validationResult.isCorrect) return "celebrating";
    if (validationResult.tested && !validationResult.isCorrect) return "thinking";
    return "happy";
  };

  if (!isMounted) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          <span className="text-xl font-black text-sky-900">
            Membuka Laboratorium Rasio... 🧪
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Navigation & Mission Stepper */}
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

        {/* 3 Mission Stepper Pills (Smooth horizontal scroll on small screens) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {MISSIONS.map((m, idx) => {
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
                <span>Soal {m.id} ({m.targetRed}:{m.targetBlue})</span>
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

      {/* 2. TARGET RATIO CARD (BIG, VIBRANT, HIGH-CONTRAST) */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-b-8 border-pink-600 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 p-6 sm:p-7 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-block rounded-full bg-white/25 px-4 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                Tahap 1 Aksi &bull; {currentMission.title} dari 3 🎯
              </span>
              {completedMissions.includes(currentMission.id) && (
                <span className="rounded-full bg-emerald-400/90 text-emerald-950 px-3 py-0.5 text-xs font-black">
                  Tuntas ⭐
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow">
              Buat Rasio: {currentMission.targetRed} Merah : {currentMission.targetBlue} Biru!
            </h1>
            <p className="text-pink-100 text-sm sm:text-base font-bold">
              {currentMission.description}
            </p>
          </div>

          {/* Chunky Ratio Badge */}
          <div className="flex items-center gap-3 rounded-3xl border-4 border-amber-300 bg-white px-5 py-3 text-slate-900 shadow-xl shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-base font-black text-white shadow-md">
                {currentMission.targetRed}
              </span>
              <span className="text-sm font-black text-rose-600">Merah</span>
            </div>
            <span className="text-2xl font-black text-slate-400">:</span>
            <div className="flex items-center gap-1.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-base font-black text-white shadow-md">
                {currentMission.targetBlue}
              </span>
              <span className="text-sm font-black text-sky-600">Biru</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VIRTUAL LAB TABLE & DRAG-AND-DROP GAME */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="rounded-3xl border-4 border-b-8 border-amber-400 bg-amber-50/80 p-5 sm:p-8 shadow-2xl space-y-6">
          {/* Header of Table */}
          <div className="flex items-center justify-between border-b-4 border-amber-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔬</span>
              <h2 className="text-lg sm:text-xl font-black text-amber-950">
                Meja Eksperimen &bull; Soal {currentMission.id}
              </h2>
            </div>

            <button
              onClick={handleResetGlass}
              disabled={glassChips.length === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-rose-600 border-b-4 border-rose-300 shadow hover:bg-rose-50 active:translate-y-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Kosongkan Gelas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: POOLS OF RED & BLUE CHIPS (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Red Chips Pool */}
              <div className="rounded-3xl border-4 border-b-6 border-rose-300 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔴</span>
                    <h3 className="text-base sm:text-lg font-black text-rose-700">
                      Kotak Keping Merah ({redPool.length} Sisa)
                    </h3>
                  </div>
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                    Sentuh atau Seret 👇
                  </span>
                </div>

                <Droppable droppableId="pool-red" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[90px] flex flex-wrap items-center gap-3 rounded-2xl border-4 border-dashed p-3 transition-colors ${
                        snapshot.isDraggingOver
                          ? "border-rose-500 bg-rose-100"
                          : "border-rose-200 bg-rose-50/50"
                      }`}
                    >
                      {redPool.length === 0 ? (
                        <span className="text-sm font-bold text-rose-400 mx-auto">
                          Semua keping merah sudah masuk ke gelas! ✨
                        </span>
                      ) : (
                        redPool.map((chip, index) => (
                          <Draggable
                            key={chip.id}
                            draggableId={chip.id}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`group relative flex h-14 w-14 sm:h-16 sm:w-16 cursor-grab items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-400 via-rose-500 to-red-600 text-white font-black text-base sm:text-lg shadow-lg border-b-4 border-rose-800 ring-3 sm:ring-4 ring-rose-300/80 active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform select-none touch-manipulation ${
                                  dragSnapshot.isDragging
                                    ? "scale-125 shadow-2xl ring-6 ring-yellow-400 z-50"
                                    : "animate-touch-ready"
                                }`}
                              >
                                <span>{chip.label}</span>
                                {/* Quick click button for touch accessibility */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addChipToGlass(chip);
                                  }}
                                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 border-2 border-amber-600 text-slate-950 font-black text-xs shadow hover:scale-110"
                                  title="Klik untuk masukkan ke gelas"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Blue Chips Pool */}
              <div className="rounded-3xl border-4 border-b-6 border-sky-300 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔵</span>
                    <h3 className="text-base sm:text-lg font-black text-sky-700">
                      Kotak Keping Biru ({bluePool.length} Sisa)
                    </h3>
                  </div>
                  <span className="text-xs font-black text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                    Sentuh atau Seret 👇
                  </span>
                </div>

                <Droppable droppableId="pool-blue" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[90px] flex flex-wrap items-center gap-3 rounded-2xl border-4 border-dashed p-3 transition-colors ${
                        snapshot.isDraggingOver
                          ? "border-sky-500 bg-sky-100"
                          : "border-sky-200 bg-sky-50/50"
                      }`}
                    >
                      {bluePool.length === 0 ? (
                        <span className="text-sm font-bold text-sky-400 mx-auto">
                          Semua keping biru sudah masuk ke gelas! ✨
                        </span>
                      ) : (
                        bluePool.map((chip, index) => (
                          <Draggable
                            key={chip.id}
                            draggableId={chip.id}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`group relative flex h-14 w-14 sm:h-16 sm:w-16 cursor-grab items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white font-black text-base sm:text-lg shadow-lg border-b-4 border-sky-800 ring-3 sm:ring-4 ring-sky-300/80 active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform select-none touch-manipulation ${
                                  dragSnapshot.isDragging
                                    ? "scale-125 shadow-2xl ring-6 ring-yellow-400 z-50"
                                    : "animate-touch-ready"
                                }`}
                              >
                                <span>{chip.label}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addChipToGlass(chip);
                                  }}
                                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 border-2 border-amber-600 text-slate-950 font-black text-xs shadow hover:scale-110"
                                  title="Klik untuk masukkan ke gelas"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

            {/* RIGHT: THE GLASS DROPZONE (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <motion.div
                animate={shakeGlass ? { x: [-12, 12, -12, 12, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center"
              >
                {/* Measuring Beaker Container */}
                <div className="relative w-full max-w-[340px] rounded-t-3xl rounded-b-[48px] border-4 border-b-8 border-sky-400 bg-white p-5 shadow-2xl">
                  {/* Glass Top Bevel */}
                  <div className="text-center pb-2">
                    <span className="text-sm font-black uppercase tracking-wider text-sky-800 flex items-center justify-center gap-1.5">
                      <span>🧪 Gelas Ukur Lab</span>
                    </span>
                    <span className="text-xs font-bold text-sky-600">
                      Lepaskan keping di dalam garis putus-putus
                    </span>
                  </div>

                  {/* Droppable Inside of Glass */}
                  <Droppable droppableId="glass">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[220px] flex flex-wrap content-start items-center justify-center gap-3.5 rounded-3xl border-4 border-dashed p-4 transition-all duration-200 ${
                          snapshot.isDraggingOver
                            ? "border-emerald-500 bg-emerald-100 scale-105 shadow-inner"
                            : "border-sky-300 bg-sky-50/70"
                        }`}
                      >
                        {glassChips.length === 0 ? (
                          <div className="my-auto flex flex-col items-center justify-center text-center p-3 select-none">
                            <span className="text-4xl animate-bounce">💧</span>
                            <span className="mt-2 text-base font-black text-sky-800">
                              Gelas Masih Kosong!
                            </span>
                            <span className="text-xs font-bold text-sky-600 mt-0.5">
                              Tarik {currentMission.targetRed} Merah &bull; {currentMission.targetBlue} Biru ke sini!
                            </span>
                          </div>
                        ) : (
                          glassChips.map((chip, index) => (
                            <Draggable
                              key={chip.id}
                              draggableId={chip.id}
                              index={index}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className={`group relative flex h-14 w-14 sm:h-16 sm:w-16 cursor-grab items-center justify-center rounded-2xl sm:rounded-3xl text-white font-black text-base sm:text-lg shadow-lg border-b-4 select-none touch-manipulation ${
                                    chip.color === "red"
                                      ? "bg-gradient-to-br from-rose-400 via-rose-500 to-red-600 border-rose-800 ring-3 sm:ring-4 ring-rose-300/80"
                                      : "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-sky-800 ring-3 sm:ring-4 ring-sky-300/80"
                                  } ${
                                    dragSnapshot.isDragging
                                      ? "scale-125 shadow-2xl ring-6 ring-yellow-400 z-50"
                                      : "hover:scale-110 active:scale-95 animate-touch-ready"
                                  } transition-transform`}
                                >
                                  <span>{chip.label}</span>
                                  {/* Return chip button matching the + button on the left */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      returnChipToPool(chip);
                                    }}
                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 border-2 border-rose-700 text-white font-black text-xs shadow hover:scale-110 active:scale-90 transition-transform"
                                    title="Klik untuk kembalikan keping"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Real-time Counter Meter */}
                  <div className="mt-4 rounded-2xl border-2 border-sky-200 bg-sky-100/60 p-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl bg-white p-2 border-2 border-rose-300 shadow-sm">
                        <span className="block text-xs font-black text-rose-600">
                          🔴 Merah
                        </span>
                        <span className="text-xl font-black text-rose-700">
                          {currentRedCount} <span className="text-xs text-slate-400">/ {currentMission.targetRed}</span>
                        </span>
                      </div>
                      <div className="rounded-xl bg-white p-2 border-2 border-sky-300 shadow-sm">
                        <span className="block text-xs font-black text-sky-600">
                          🔵 Biru
                        </span>
                        <span className="text-xl font-black text-sky-700">
                          {currentBlueCount} <span className="text-xs text-slate-400">/ {currentMission.targetBlue}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-center text-xs font-black text-slate-800">
                      Rasio Saat Ini:{" "}
                      <span className="rounded-full bg-white px-3 py-0.5 text-sky-700 border border-sky-300">
                        {currentRedCount} : {currentBlueCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. HUGE BOUNCY 3D CHECK BUTTON */}
                <div className="mt-5 w-full max-w-[340px]">
                  <button
                    onClick={handleCheckResults}
                    className="w-full btn-game-yellow min-h-16 px-8 text-xl"
                  >
                    <Sparkles className="h-6 w-6 text-amber-950 mr-2 animate-spin-slow" />
                    <span>Cek Ramuan Soal {currentMission.id}! 🧪</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* 5. VISUAL CELEBRATION MODAL (PORTALED DIRECTLY TO BODY FOR 100% BLUR) */}
      <ModalPortal>
        <AnimatePresence>
          {validationResult.tested && validationResult.isCorrect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-sky-950/75 p-4 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.7, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.7, y: 40 }}
                transition={{ type: "spring", damping: 18, stiffness: 280 }}
                className="relative w-full max-w-md rounded-3xl border-4 border-b-8 border-emerald-600 bg-white p-6 sm:p-8 text-center shadow-2xl space-y-5"
              >
                {/* Giant Emojis Banner */}
                <div className="text-6xl animate-bounce">
                  🎉 ⭐ 🥳
                </div>

                <div className="space-y-1.5">
                  <span className="inline-block rounded-full bg-emerald-100 border-2 border-emerald-400 px-4 py-1 text-xs font-black text-emerald-900 uppercase">
                    Soal {currentMission.id} dari 3 Tuntas! ⭐
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Luar Biasa, Kamu Juara!
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-600 leading-relaxed">
                    {validationResult.detail}
                  </p>
                </div>

                {/* Reward Badge */}
                <div className="rounded-2xl border-4 border-amber-300 bg-amber-50 p-4 flex items-center justify-center gap-3">
                  <Trophy className="h-10 w-10 text-amber-500 fill-amber-400" />
                  <div className="text-left">
                    <span className="text-xs font-black text-amber-800 uppercase block">
                      Hadiah Bintang
                    </span>
                    <span className="text-lg font-black text-amber-950">
                      +100 XP Petualang Rasio
                    </span>
                  </div>
                </div>

                {/* NEXT MISSION OR NEXT STAGE BUTTON */}
                <div className="pt-2 flex flex-col gap-3">
                  {activeMissionIndex < MISSIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextMission}
                      className="w-full btn-game-green min-h-16 px-8 text-xl"
                    >
                      <span>Lanjut ke Soal {currentMission.id + 1} ({MISSIONS[activeMissionIndex + 1].targetRed}:{MISSIONS[activeMissionIndex + 1].targetBlue})! 🚀</span>
                      <ArrowRight className="h-6 w-6 ml-2" />
                    </button>
                  ) : (
                    <Link
                      href="/proses"
                      className="w-full btn-game-green min-h-16 px-8 text-xl"
                    >
                      <span>Semua Soal Aksi Selesai! Lanjut ke Proses! 🚀</span>
                      <ArrowRight className="h-6 w-6 ml-2" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setValidationResult((prev) => ({ ...prev, tested: false }))
                    }
                    className="text-xs font-black text-slate-500 hover:text-slate-800 py-1"
                  >
                    Ulangi Soal Ini
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
