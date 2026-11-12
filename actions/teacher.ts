"use server";

import prisma from "@/lib/prisma";
import { getStoredStudents, StoredStudent } from "@/lib/store";

export interface StudentProgressRow {
  id: string;
  name: string;
  class: string;
  createdAt: Date | string;
  progress: {
    aksi: { isCompleted: boolean; score: number };
    proses: { isCompleted: boolean; score: number };
    objek: { isCompleted: boolean; score: number };
    skema: { isCompleted: boolean; score: number };
  };
  completionRate: number; // 0 - 100%
  reflection?: {
    dailyExample: string;
    understoodText: string;
    confusedText: string;
    createdAt: Date | string;
  } | null;
}

/**
 * Fetch all students with their APOS progress and LKPD digital reflections.
 * Combines persistent local store and Prisma database so student submissions are NEVER lost.
 */
export async function getTeacherDashboardData(): Promise<{
  students: StudentProgressRow[];
  totalStudents: number;
  totalReflections: number;
  avgCompletionRate: number;
  isMock: boolean;
}> {
  // 1. Ambil data dari persistent JSON store
  const storedStudents = getStoredStudents();

  // Map untuk deduplikasi berdasarkan nama atau ID
  const studentMap = new Map<string, StudentProgressRow>();

  // Masukkan data dari store ke map
  for (const s of storedStudents) {
    const stagesDone = [
      s.progress.aksi,
      s.progress.proses,
      s.progress.objek,
      s.progress.skema,
    ].filter((p) => p.isCompleted).length;

    const rate = Math.round((stagesDone / 4) * 100);

    studentMap.set(s.name.toLowerCase(), {
      id: s.id,
      name: s.name,
      class: s.class,
      createdAt: s.createdAt,
      progress: s.progress,
      completionRate: Math.max(s.completionRate, rate),
      reflection: s.reflection,
    });
  }

  // 2. Coba gabungkan dengan data Prisma PostgreSQL jika database sedang aktif
  try {
    const rawStudents = await prisma.student.findMany({
      include: {
        progress: true,
        reflections: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (rawStudents && rawStudents.length > 0) {
      for (const s of rawStudents) {
        const pMap = new Map(s.progress.map((p) => [p.stage, p]));

        const aksi = pMap.get("AKSI") || { isCompleted: false, score: 0 };
        const proses = pMap.get("PROSES") || { isCompleted: false, score: 0 };
        const objek = pMap.get("OBJEK") || { isCompleted: false, score: 0 };
        const skema = pMap.get("SKEMA") || { isCompleted: false, score: 0 };

        const stagesDone = [aksi, proses, objek, skema].filter((p) => p.isCompleted).length;
        const completionRate = Math.round((stagesDone / 4) * 100);

        const latestRef = s.reflections[0];
        let reflectionData = null;

        if (latestRef) {
          let daily = "";
          let understood = latestRef.understoodText;

          if (latestRef.understoodText.includes("[Contoh Sehari-hari]:")) {
            const parts = latestRef.understoodText.split("[Hal yang Dipahami]:");
            daily = parts[0].replace("[Contoh Sehari-hari]:", "").trim();
            understood = parts[1]?.trim() || latestRef.understoodText;
          }

          reflectionData = {
            dailyExample: daily || "Contoh perbandingan resep atau benda sehari-hari.",
            understoodText: understood,
            confusedText: latestRef.confusedText,
            createdAt: latestRef.createdAt,
          };
        }

        const existingInMap = studentMap.get(s.name.toLowerCase());

        // Jika sudah ada refleksi di database, gunakan data database
        if (reflectionData || !existingInMap) {
          studentMap.set(s.name.toLowerCase(), {
            id: s.id,
            name: s.name,
            class: s.class,
            createdAt: s.createdAt,
            progress: {
              aksi: { isCompleted: aksi.isCompleted, score: aksi.score },
              proses: { isCompleted: proses.isCompleted, score: proses.score },
              objek: { isCompleted: objek.isCompleted, score: objek.score },
              skema: { isCompleted: skema.isCompleted, score: skema.score },
            },
            completionRate,
            reflection: reflectionData || existingInMap?.reflection || null,
          });
        }
      }
    }
  } catch (error) {
    console.warn("Prisma offline / using persistent store data for teacher dashboard:", error);
  }

  // Ubah map menjadi array, urutkan: yang sudah mengisi refleksi berada paling atas
  const students: StudentProgressRow[] = Array.from(studentMap.values()).sort((a, b) => {
    if (a.reflection && !b.reflection) return -1;
    if (!a.reflection && b.reflection) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalStudents = students.length;
  const totalReflections = students.filter((s) => s.reflection !== null).length;
  const avgCompletionRate = Math.round(
    students.reduce((acc, s) => acc + s.completionRate, 0) / (totalStudents || 1)
  );

  return {
    students,
    totalStudents,
    totalReflections,
    avgCompletionRate,
    isMock: false,
  };
}

/**
 * Server action to manually add or sync an LKPD submission from client localStorage
 */
export async function syncClientReflectionAction(data: {
  studentName: string;
  studentClass: string;
  dailyExample: string;
  understoodText: string;
  confusedText: string;
}) {
  const { studentName, studentClass, dailyExample, understoodText, confusedText } = data;
  if (!dailyExample || !understoodText || !confusedText) {
    return { success: false };
  }

  const { saveStoredReflection } = await import("@/lib/store");
  saveStoredReflection(studentName, dailyExample, understoodText, confusedText);
  return { success: true };
}
