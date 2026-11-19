"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download,
  Filter,
  Check,
  Eye,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  getTeacherDashboardData,
  syncClientReflectionAction,
  StudentProgressRow,
} from "@/actions/teacher";

export default function TeacherDashboardPage() {
  const [students, setStudents] = useState<StudentProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [expandedReflectionId, setExpandedReflectionId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalReflections: 0,
    avgCompletionRate: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Sinkronkan refleksi lokal dari mode murid jika ada
      if (typeof window !== "undefined") {
        const localReflectionRaw = localStorage.getItem("lab_rasio_last_reflection");
        if (localReflectionRaw) {
          try {
            const parsed = JSON.parse(localReflectionRaw);
            await syncClientReflectionAction({
              studentName: parsed.studentName || "Ayu Putri",
              studentClass: parsed.studentClass || "Kelas 6 SD",
              dailyExample: parsed.dailyExample || "",
              understoodText: parsed.understoodText || "",
              confusedText: parsed.confusedText || "",
            });
          } catch (syncErr) {
            console.warn("Sync local reflection error:", syncErr);
          }
        }
      }

      // 2. Ambil seluruh data murid terpadu
      const data = await getTeacherDashboardData();
      setStudents(data.students);
      setIsMockData(data.isMock);
      setStats({
        totalStudents: data.totalStudents,
        totalReflections: data.totalReflections,
        avgCompletionRate: data.avgCompletionRate,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "ALL" || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const toggleExpand = (id: string) => {
    setExpandedReflectionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Professional Header for Teacher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Halaman Depan Murid</span>
            </Link>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 border border-purple-200">
              Panel Pengajar
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Dashboard Guru - Laporan Laboratorium Rasio 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Pantau ketercapaian 4 tahap Teori APOS (Aksi, Proses, Objek, Skema) dan analisis lembar kerja refleksi digital siswa.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Segarkan Data</span>
          </button>

          <Link
            href="/aksi"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:bg-purple-700 transition"
          >
            <span>Uji Coba Game Murid</span>
          </Link>
        </div>
      </div>

      {/* Demo / Mock Notice if database empty */}
      {isMockData && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <strong>Mode Pratinjau Guru:</strong> Menampilkan data demonstrasi siswa dan isian refleksi LKPD lengkap berbasis Teori APOS. Data baru yang dikirim murid via game akan otomatis tersinkron ke daftar ini!
          </div>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Murid</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalStudents}
            </span>
            <span className="text-xs text-slate-400 font-medium">Siswa terdaftar</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-sky-700">
            Terbagi di rombel kelas 6 SD
          </p>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rata-rata Progres</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">
              {stats.avgCompletionRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Ketercapaian APOS</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${stats.avgCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Refleksi LKPD</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookOpenCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {stats.totalReflections}
            </span>
            <span className="text-xs text-slate-400 font-medium">Lembar masuk</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-emerald-700">
            Telah mengisi evaluasi Skema
          </p>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Lulus Penuh (4/4)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">
              {students.filter((s) => s.completionRate === 100).length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Murid Bintang Emas</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-amber-700">
            Kuasai Aksi hingga Skema
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama murid..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
          />
        </div>

        {/* Class Filter buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Kelas:</span>
          {["ALL", "Kelas 6 SD", "Kelas 6A", "Kelas 6B", "Kelas 6C"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition shrink-0 ${
                selectedClass === cls
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cls === "ALL" ? "Semua Kelas" : cls}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b-2 border-slate-200 text-slate-600 font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-4 px-5">Nama Murid</th>
                <th className="py-4 px-5">Status Progres 4 Tahap APOS</th>
                <th className="py-4 px-5">Ketercapaian</th>
                <th className="py-4 px-5">Hasil LKPD / Refleksi</th>
                <th className="py-4 px-5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                    Memuat data murid...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                    Tidak ditemukan data murid yang cocok.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isExpanded = expandedReflectionId === student.id;

                  return (
                    <React.Fragment key={student.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Nama Murid */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black text-sm shadow-sm">
                              {student.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-black text-slate-900 block text-sm sm:text-base">
                                {student.name}
                              </span>
                              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 inline-block mt-0.5">
                                {student.class}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Status Progres (Visual Badges for Aksi, Proses, Objek, Skema) */}
                        <td className="py-4 px-5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Aksi Badge */}
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black border ${
                                student.progress.aksi.isCompleted
                                  ? "bg-rose-100 text-rose-800 border-rose-300"
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                              }`}
                              title={`Aksi: ${student.progress.aksi.isCompleted ? "Selesai (100 XP)" : "Belum"}`}
                            >
                              🚀 Aksi {student.progress.aksi.isCompleted ? "✓" : "-"}
                            </span>

                            {/* Proses Badge */}
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black border ${
                                student.progress.proses.isCompleted
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : student.progress.proses.score > 0
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                              }`}
                              title={`Proses: ${student.progress.proses.isCompleted ? "Selesai (100 XP)" : "Aktif"}`}
                            >
                              ⚡ Proses {student.progress.proses.isCompleted ? "✓" : "-"}
                            </span>

                            {/* Objek Badge */}
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black border ${
                                student.progress.objek.isCompleted
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                              }`}
                              title={`Objek: ${student.progress.objek.isCompleted ? "Selesai (100 XP)" : "Belum"}`}
                            >
                              📦 Objek {student.progress.objek.isCompleted ? "✓" : "-"}
                            </span>

                            {/* Skema Badge */}
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black border ${
                                student.progress.skema.isCompleted
                                  ? "bg-purple-100 text-purple-800 border-purple-300"
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                              }`}
                              title={`Skema: ${student.progress.skema.isCompleted ? "Selesai (100 XP)" : "Belum"}`}
                            >
                              👑 Skema {student.progress.skema.isCompleted ? "✓" : "-"}
                            </span>
                          </div>
                        </td>

                        {/* 3. Ketercapaian % */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-black ${
                                student.completionRate === 100
                                  ? "text-emerald-600"
                                  : student.completionRate >= 50
                                  ? "text-amber-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {student.completionRate}%
                            </span>
                            <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  student.completionRate === 100
                                    ? "bg-emerald-500"
                                    : "bg-amber-400"
                                }`}
                                style={{ width: `${student.completionRate}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 4. Hasil LKPD / Refleksi Preview */}
                        <td className="py-4 px-5 max-w-xs">
                          {student.reflection ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                                <Check className="h-3 w-3" /> LKPD Terisi
                              </span>
                              <p className="truncate text-xs text-slate-700 font-bold">
                                &ldquo;{student.reflection.dailyExample}&rdquo;
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-400">
                              Belum mengisi lembar refleksi
                            </span>
                          )}
                        </td>

                        {/* 5. Detail / Expand toggle */}
                        <td className="py-4 px-5 text-right">
                          {student.reflection ? (
                            <button
                              onClick={() => toggleExpand(student.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                            >
                              <FileText className="h-3.5 w-3.5 text-purple-600" />
                              <span>{isExpanded ? "Tutup" : "Lihat LKPD"}</span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-300">-</span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Reflection Details Card */}
                      {isExpanded && student.reflection && (
                        <tr className="bg-purple-50/40">
                          <td colSpan={5} className="p-5 border-y border-purple-100">
                            <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 shadow-sm space-y-4">
                              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                                <span className="text-xs font-black text-purple-900 uppercase">
                                  Lembar Kerja &amp; Refleksi Murid: {student.name} ({student.class})
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">
                                  Tersimpan di PostgreSQL via Prisma
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                {/* Jawaban 1: Contoh Rasio */}
                                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 space-y-1">
                                  <span className="font-black text-teal-900 block">
                                    ☕ 1. Contoh Rasio Sehari-hari:
                                  </span>
                                  <p className="text-slate-800 font-semibold leading-relaxed">
                                    &ldquo;{student.reflection.dailyExample}&rdquo;
                                  </p>
                                </div>

                                {/* Jawaban 2: Yang Dipahami */}
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-1">
                                  <span className="font-black text-emerald-900 block">
                                    ✨ 2. Hal yang Dipahami:
                                  </span>
                                  <p className="text-slate-800 font-semibold leading-relaxed">
                                    &ldquo;{student.reflection.understoodText}&rdquo;
                                  </p>
                                </div>

                                {/* Jawaban 3: Yang Membingungkan */}
                                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-1">
                                  <span className="font-black text-amber-900 block">
                                    ❓ 3. Hal yang Masih Membingungkan:
                                  </span>
                                  <p className="text-slate-800 font-semibold leading-relaxed">
                                    &ldquo;{student.reflection.confusedText}&rdquo;
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

