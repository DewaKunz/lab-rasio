"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { upsertStoredStudent } from "@/lib/store";

export interface StudentAuthResult {
  success: boolean;
  student?: {
    id: string;
    name: string;
    class: string;
  };
  error?: string;
  isMockFallback?: boolean;
}

/**
 * Frictionless Student Login:
 * Finds existing student by name or creates a new one,
 * saves to persistent store & Prisma, sets secure HTTP-only cookies.
 */
export async function loginStudentAction(
  name: string,
  studentClass: string = "Kelas 5B"
): Promise<StudentAuthResult> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      error: "Nama murid tidak boleh kosong.",
    };
  }

  // 1. Always save / upsert into persistent local store first (never loses data!)
  const storedStudent = upsertStoredStudent(trimmedName, studentClass);

  let activeId = storedStudent.id;
  let activeName = storedStudent.name;
  let activeClass = storedStudent.class;

  // 2. Also try Prisma PostgreSQL if available
  try {
    let student = await prisma.student.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: "insensitive",
        },
      },
      include: {
        progress: true,
      },
    });

    if (!student) {
      student = await prisma.student.create({
        data: {
          name: trimmedName,
          class: studentClass.trim() || "Kelas 5B",
        },
        include: {
          progress: true,
        },
      });

      try {
        await prisma.aposProgress.create({
          data: {
            studentId: student.id,
            stage: "AKSI",
            isCompleted: false,
            score: 0,
          },
        });
      } catch (initErr) {
        console.warn("Inisialisasi progres tahap awal:", initErr);
      }
    }

    activeId = student.id;
    activeName = student.name;
    activeClass = student.class;
  } catch (dbErr) {
    console.warn("Database offline / using local persistent store for login:", dbErr);
  }

  // 3. Set session cookies
  const cookieStore = cookies();
  cookieStore.set("student_id", activeId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("student_name", encodeURIComponent(activeName), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("student_class", encodeURIComponent(activeClass), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  return {
    success: true,
    student: {
      id: activeId,
      name: activeName,
      class: activeClass,
    },
  };
}

/**
 * Mendapatkan data murid yang sedang aktif dari session cookie
 */
export async function getActiveStudentAction() {
  const cookieStore = cookies();
  const studentId = cookieStore.get("student_id")?.value;
  const rawName = cookieStore.get("student_name")?.value;
  const rawClass = cookieStore.get("student_class")?.value;

  if (!studentId || !rawName) {
    return null;
  }

  return {
    id: studentId,
    name: decodeURIComponent(rawName),
    class: rawClass ? decodeURIComponent(rawClass) : "Kelas 5B",
  };
}

/**
 * Logout murid
 */
export async function logoutStudentAction() {
  const cookieStore = cookies();
  cookieStore.delete("student_id");
  cookieStore.delete("student_name");
  cookieStore.delete("student_class");
  return { success: true };
}
