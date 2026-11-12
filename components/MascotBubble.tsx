"use client";

import React from "react";
import { motion } from "framer-motion";

interface MascotBubbleProps {
  message: string;
  emotion?: "happy" | "thinking" | "celebrating" | "surprised";
  mascotName?: string;
  avatarEmoji?: string;
}

export default function MascotBubble({
  message,
  emotion = "happy",
  mascotName = "Robi si Robot Lab 🤖",
  avatarEmoji = "🤖",
}: MascotBubbleProps) {
  const getBadgeStyle = () => {
    switch (emotion) {
      case "celebrating":
        return "bg-emerald-400 text-emerald-950 border-emerald-600";
      case "surprised":
        return "bg-rose-400 text-rose-950 border-rose-600";
      case "thinking":
        return "bg-purple-400 text-purple-950 border-purple-600";
      default:
        return "bg-amber-400 text-amber-950 border-amber-600";
    }
  };

  const getEmoji = () => {
    switch (emotion) {
      case "celebrating":
        return "🥳";
      case "surprised":
        return "😮";
      case "thinking":
        return "🤔";
      default:
        return avatarEmoji;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: -8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="relative flex items-start gap-4 rounded-3xl border-4 border-b-8 border-amber-400 bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 p-4 sm:p-5 shadow-2xl shadow-amber-300/40 select-none"
    >
      {/* Animated Mascot Avatar */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl border-4 border-b-6 border-amber-500 bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 shadow-lg text-3xl sm:text-4xl select-none"
      >
        <span>{getEmoji()}</span>

        {/* Small live pulse beacon */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></span>
        </span>
      </motion.div>

      {/* Speech Bubble Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block rounded-full border-2 px-3 py-0.5 text-xs font-black uppercase tracking-wide shadow-sm ${getBadgeStyle()}`}
          >
            {mascotName}
          </span>
          <span className="text-xs font-extrabold text-amber-800 hidden sm:inline">
            Teman Belajarmu 🚀
          </span>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-black text-slate-800 leading-snug">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
