"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { saveStoredReflection } from "@/lib/store";

export interface SaveReflectionInput {
  studentId?: string;
  studentName?: string;
  dailyExample: string;
  understoodText: string;
  confusedText: string;
}

export interface SaveReflectionResult {
  success: boolean;
  reflectionId?: string;
  error?: string;
  isMockFallback?: boolean;
}

/**
 * Server Action to save student's LKPD digital reflection.
 * Persists to persistent JSON store AND Prisma PostgreSQL database.
 */
export async function saveReflectionAction(
  input: SaveReflectionInput
): Promise<SaveReflectionResult> {
  const { dailyExample, understoodText, confusedText } = input;

  if (!dailyExample?.trim() || !understoodText?.trim() || !confusedText?.trim()) {
    return {
      success: false,
      error: "Semua isian refleksi LKPD harus diisi.",
    };
  }

  const cookieStore = cookies();
  const sessionStudentId = input.studentId || cookieStore.get("student_id")?.value;
  const rawCookieName = cookieStore.get("student_name")?.value;
  const sessionStudentName = input.studentName || (rawCookieName ? decodeURIComponent(rawCookieName) : "Ayu Putri");

  // 1. ALWAYS SAVE TO PERSISTENT LOCAL STORE (Guarantees data is never lost!)
  const identifier = sessionStudentName || sessionStudentId || "student-sample-1";
  const storedRecord = saveStoredReflection(
    identifier,
    dailyExample,
    understoodText,
    confusedText
  );

  let reflectionId = "reflection-" + Date.now();

  // 2. Also try Prisma if connected
  try {
    let student = sessionStudentId
      ? await prisma.student.findUnique({ where: { id: sessionStudentId } })
      : null;

    if (!student && sessionStudentName) {
      student = await prisma.student.findFirst({
        where: {
          name: {
            equals: sessionStudentName,
            mode: "insensitive",
          },
        },
      });
    }

    if (!student) {
      student = await prisma.student.upsert({
        where: { id: "student-sample-1" },
        update: {},
        create: {
          id: "student-sample-1",
          name: sessionStudentName || "Ayu Putri",
          class: "Kelas 5B",
        },
      });
    }

    const combinedUnderstood = `[Contoh Sehari-hari]: ${dailyExample.trim()}\n\n[Hal yang Dipahami]: ${understoodText.trim()}`;

    const reflection = await prisma.reflection.create({
      data: {
        studentId: student.id,
        understoodText: combinedUnderstood,
        confusedText: confusedText.trim(),
      },
    });

    reflectionId = reflection.id;

    try {
      await prisma.aposProgress.upsert({
        where: {
          studentId_stage: {
            studentId: student.id,
            stage: "SKEMA",
          },
        },
        update: {
          isCompleted: true,
          score: 100,
        },
        create: {
          studentId: student.id,
          stage: "SKEMA",
          isCompleted: true,
          score: 100,
        },
      });
    } catch (progressError) {
      console.warn("Gagal memperbarui progres SKEMA di Prisma:", progressError);
    }
  } catch (dbError) {
    console.warn("Prisma offline / using persistent store for LKPD reflection:", dbError);
  }

  return {
    success: true,
    reflectionId: reflectionId || storedRecord.id,
  };
}
