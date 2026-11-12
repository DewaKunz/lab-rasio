import { PrismaClient, AposStage } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Menyiapkan data awal Laboratorium Rasio...");

  // 1. Buat Siswa Contoh
  const student = await prisma.student.upsert({
    where: { id: "student-sample-1" },
    update: {},
    create: {
      id: "student-sample-1",
      name: "Ayu Putri",
      class: "Kelas 5B",
    },
  });

  console.log(`👤 Siswa dibuat: ${student.name} (${student.class})`);

  // 2. Buat Kemajuan 4 Tahap APOS
  const stages: {
    stage: AposStage;
    isCompleted: boolean;
    score: number;
  }[] = [
    { stage: AposStage.AKSI, isCompleted: true, score: 100 },
    { stage: AposStage.PROSES, isCompleted: false, score: 85 },
    { stage: AposStage.OBJEK, isCompleted: false, score: 0 },
    { stage: AposStage.SKEMA, isCompleted: false, score: 0 },
  ];

  for (const item of stages) {
    await prisma.aposProgress.upsert({
      where: {
        studentId_stage: {
          studentId: student.id,
          stage: item.stage,
        },
      },
      update: {
        isCompleted: item.isCompleted,
        score: item.score,
      },
      create: {
        studentId: student.id,
        stage: item.stage,
        isCompleted: item.isCompleted,
        score: item.score,
      },
    });
  }

  // 3. Buat Contoh Refleksi LKPD
  await prisma.reflection.create({
    data: {
      studentId: student.id,
      understoodText:
        "Saya sudah paham bahwa rasio 2:3 artinya membandingkan 2 bagian apel dengan 3 bagian jeruk. Jika apelnya ada 4, maka jeruknya ada 6!",
      confusedText:
        "Bagaimana cara menyederhanakan rasio jika bilangannya besar sekali seperti 48 : 72?",
    },
  });

  console.log("✅ Seed database selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

