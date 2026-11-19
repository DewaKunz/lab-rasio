import fs from "fs";
import path from "path";

export interface StoredStudentProgress {
  isCompleted: boolean;
  score: number;
}

export interface StoredReflection {
  dailyExample: string;
  understoodText: string;
  confusedText: string;
  createdAt: string;
}

export interface StoredStudent {
  id: string;
  name: string;
  class: string;
  createdAt: string;
  progress: {
    aksi: StoredStudentProgress;
    proses: StoredStudentProgress;
    objek: StoredStudentProgress;
    skema: StoredStudentProgress;
  };
  completionRate: number;
  reflection: StoredReflection | null;
}

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

function ensureStoreFile(): void {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify({ students: [] }, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Could not ensure store file:", err);
  }
}

export function getStoredStudents(): StoredStudent[] {
  ensureStoreFile();
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    const content = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(content);
    return Array.isArray(data.students) ? data.students : [];
  } catch (err) {
    console.error("Error reading store.json:", err);
    return [];
  }
}

export function saveStoredStudents(students: StoredStudent[]): void {
  ensureStoreFile();
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ students }, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving store.json:", err);
  }
}

export function upsertStoredStudent(
  name: string,
  studentClass: string = "Kelas 6 SD",
  preferredId?: string
): StoredStudent {
  const students = getStoredStudents();
  const trimmedName = name.trim();

  let existing = students.find(
    (s) =>
      s.name.toLowerCase() === trimmedName.toLowerCase() ||
      (preferredId && s.id === preferredId)
  );

  if (existing) {
    existing.class = studentClass || existing.class;
    saveStoredStudents(students);
    return existing;
  }

  const newStudent: StoredStudent = {
    id: preferredId || "student-" + Date.now(),
    name: trimmedName,
    class: studentClass || "Kelas 6 SD",
    createdAt: new Date().toISOString(),
    progress: {
      aksi: { isCompleted: false, score: 0 },
      proses: { isCompleted: false, score: 0 },
      objek: { isCompleted: false, score: 0 },
      skema: { isCompleted: false, score: 0 },
    },
    completionRate: 0,
    reflection: null,
  };

  students.unshift(newStudent);
  saveStoredStudents(students);
  return newStudent;
}

export function saveStoredReflection(
  studentIdentifier: string, // id or name
  dailyExample: string,
  understoodText: string,
  confusedText: string
): StoredStudent {
  const students = getStoredStudents();
  const lowerIdent = studentIdentifier.trim().toLowerCase();

  let student = students.find(
    (s) =>
      s.id === studentIdentifier ||
      s.name.toLowerCase() === lowerIdent ||
      s.id === "student-sample-1"
  );

  if (!student) {
    // If not found, create new student record
    student = {
      id: "student-" + Date.now(),
      name: studentIdentifier.startsWith("student-") ? "Ayu Putri" : studentIdentifier,
      class: "Kelas 6 SD",
      createdAt: new Date().toISOString(),
      progress: {
        aksi: { isCompleted: true, score: 100 },
        proses: { isCompleted: true, score: 100 },
        objek: { isCompleted: true, score: 100 },
        skema: { isCompleted: true, score: 100 },
      },
      completionRate: 100,
      reflection: null,
    };
    students.unshift(student);
  }

  // Update reflection
  student.reflection = {
    dailyExample: dailyExample.trim(),
    understoodText: understoodText.trim(),
    confusedText: confusedText.trim(),
    createdAt: new Date().toISOString(),
  };

  // Mark all completed as they reached and completed LKPD!
  student.progress.aksi.isCompleted = true;
  student.progress.aksi.score = 100;
  student.progress.proses.isCompleted = true;
  student.progress.proses.score = 100;
  student.progress.objek.isCompleted = true;
  student.progress.objek.score = 100;
  student.progress.skema.isCompleted = true;
  student.progress.skema.score = 100;
  student.completionRate = 100;

  // Move this updated student to the top of the list so teacher sees it first
  const remaining = students.filter((s) => s.id !== student!.id);
  const updatedList = [student, ...remaining];

  saveStoredStudents(updatedList);
  return student;
}

