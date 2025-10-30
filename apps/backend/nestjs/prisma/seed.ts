import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data first to avoid conflicts
  console.log('Clearing existing data...');
  
  // Delete in correct order due to foreign key constraints
  await prisma.biayaDefault.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.mahasiswa.deleteMany();
  await prisma.jurusan.deleteMany();
  await prisma.fakultas.deleteMany();
  await prisma.campus.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Existing data cleared.');

  // Default Admin
  const adminEmail = 'admin@ektm.local';
  const adminPassword = 'Admin#12345';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      name: 'Admin 1',
      email: adminEmail,
      password: adminHash,
      role: 'admin',
    },
  });

  // Default Admin 2
  const adminEmail2 = 'admin@mail.com';
  const adminPassword2 = 'admin12345';
  const adminHash2 = await bcrypt.hash(adminPassword2, 10);

  await prisma.user.create({
    data: {
      name: 'Admin 2',
      email: adminEmail2,
      password: adminHash2,
      role: 'admin',
    },
  });

  // default users (mahasiswa)
  const defaultUsers = "user1@mail.com";
  const defaultUsersPassword = "password123";
  const defaultUsersHash = await bcrypt.hash(defaultUsersPassword, 10);

  await prisma.user.create({
    data: {
      name: 'User 1',
      email: defaultUsers,
      password: defaultUsersHash,
      role: 'mahasiswa',
    },
  });

  // Create Campus
  const kramatCampus = await prisma.campus.create({
    data: {
      name: 'Kramat',
      address: 'Jl. Kramat No. 1',
    },
  });

  const slipiCampus = await prisma.campus.create({
    data: {
      name: 'Slipi',
      address: 'Jl. Slipi No. 1',
    },
  });

  // Create Fakultas
  const ekonomiFakultas = await prisma.fakultas.create({
    data: {
      name: 'Ekonomi dan Bisnis',
      campusId: kramatCampus.id,
    },
  });

  const teknikFakultas = await prisma.fakultas.create({
    data: {
      name: 'Teknik dan Informatika',
      campusId: slipiCampus.id,
    },
  });

  // Create Jurusan
  const manajemenJurusan = await prisma.jurusan.create({
    data: {
      name: 'Manajemen',
      fakultasId: ekonomiFakultas.id,
    },
  });

  const akuntansiJurusan = await prisma.jurusan.create({
    data: {
      name: 'Akuntansi',
      fakultasId: ekonomiFakultas.id,
    },
  });

  const informatikaJurusan = await prisma.jurusan.create({
    data: {
      name: 'Informatika',
      fakultasId: teknikFakultas.id,
    },
  });

  const RekayasaPerangkatLunakJurusan = await prisma.jurusan.create({
    data: {
      name: 'Rekayasa Perangkat Lunak',
      fakultasId: teknikFakultas.id,
    },
  });

  const elektroJurusan = await prisma.jurusan.create({
    data: {
      name: 'Elektro',
      fakultasId: teknikFakultas.id,
    },
  });

  const sistemInformasiJurusan = await prisma.jurusan.create({
    data: {
      name: 'Sistem Informasi',
      fakultasId: teknikFakultas.id,
    },
  });

  // Create BiayaDefault per Semester untuk setiap Jurusan
  const jurusanList = [
    { jurusan: manajemenJurusan, name: 'Manajemen' },
    { jurusan: akuntansiJurusan, name: 'Akuntansi' },
    { jurusan: informatikaJurusan, name: 'Informatika' },
    { jurusan: RekayasaPerangkatLunakJurusan, name: 'Rekayasa Perangkat Lunak' },
    { jurusan: elektroJurusan, name: 'Elektro' },
    { jurusan: sistemInformasiJurusan, name: 'Sistem Informasi' }
  ];

  // Base biaya untuk setiap jurusan (semester 1)
  const baseBiaya = {
    manajemen: { pokok: 5000000, tambahan: 1000000, praktikum: 500000, ujian: 300000, kegiatan: 200000 },
    akuntansi: { pokok: 5500000, tambahan: 1200000, praktikum: 600000, ujian: 350000, kegiatan: 250000 },
    informatika: { pokok: 6000000, tambahan: 1500000, praktikum: 800000, ujian: 400000, kegiatan: 300000 },
    rekayasa: { pokok: 6200000, tambahan: 1600000, praktikum: 900000, ujian: 450000, kegiatan: 350000 },
    elektro: { pokok: 5800000, tambahan: 1400000, praktikum: 700000, ujian: 380000, kegiatan: 280000 },
    sistem: { pokok: 5900000, tambahan: 1450000, praktikum: 750000, ujian: 390000, kegiatan: 290000 }
  };

  // Mapping jurusan ke base biaya
  const jurusanBiayaMap = {
    'Manajemen': baseBiaya.manajemen,
    'Akuntansi': baseBiaya.akuntansi,
    'Informatika': baseBiaya.informatika,
    'Rekayasa Perangkat Lunak': baseBiaya.rekayasa,
    'Elektro': baseBiaya.elektro,
    'Sistem Informasi': baseBiaya.sistem
  };

  // Create biaya default untuk semester 1-8 untuk setiap jurusan
  for (const { jurusan, name } of jurusanList) {
    const base = jurusanBiayaMap[name];
    
    for (let semester = 1; semester <= 8; semester++) {
      // Biaya meningkat setiap semester (semester ganjil lebih mahal)
      const semesterMultiplier = semester % 2 === 1 ? 1.1 : 1.05; // Semester ganjil +10%, genap +5%
      const praktikumMultiplier = semester >= 3 ? 1.2 : 1.0; // Praktikum lebih mahal dari semester 3+
      
      await prisma.biayaDefault.create({
        data: {
          jurusanId: jurusan.id,
          semester: semester,
          biayaPokok: Math.round(base.pokok * semesterMultiplier),
          biayaTambahanJurusan: Math.round(base.tambahan * semesterMultiplier),
          biayaPraktikum: Math.round(base.praktikum * semesterMultiplier * praktikumMultiplier),
          biayaUjian: Math.round(base.ujian * semesterMultiplier),
          biayaKegiatan: Math.round(base.kegiatan * semesterMultiplier),
        },
      });
    }
  }

  // Default Mahasiswa dengan berbagai semester untuk testing
  const mahasiswaPassword = 'password123';
  const mahasiswaHash = await bcrypt.hash(mahasiswaPassword, 10);

  const mahasiswaData = [
    // Manajemen
    { name: 'Surya Wibisono', email: 'mhs@ektm.local', nim: 12345678, kelas: '19.1A.00', semester: 1, jurusan: manajemenJurusan },
    { name: 'Ahmad Rizki', email: 'ahmad@ektm.local', nim: 12345679, kelas: '19.1A.01', semester: 2, jurusan: manajemenJurusan },
    { name: 'Siti Nurhaliza', email: 'siti@ektm.local', nim: 12345680, kelas: '19.1A.02', semester: 3, jurusan: manajemenJurusan },
    
    // Akuntansi
    { name: 'John Doe', email: 'johndoe@mail.com', nim: 19232345, kelas: '19.3B.01', semester: 3, jurusan: akuntansiJurusan },
    { name: 'Maria Santos', email: 'maria@ektm.local', nim: 19232346, kelas: '19.3B.02', semester: 4, jurusan: akuntansiJurusan },
    { name: 'Budi Santoso', email: 'budi@ektm.local', nim: 19232347, kelas: '19.3B.03', semester: 5, jurusan: akuntansiJurusan },
    
    // Informatika
    { name: 'Alice Johnson', email: 'alice@ektm.local', nim: 20240001, kelas: '20.1C.01', semester: 1, jurusan: informatikaJurusan },
    { name: 'Bob Smith', email: 'bob@ektm.local', nim: 20240002, kelas: '20.1C.02', semester: 2, jurusan: informatikaJurusan },
    { name: 'Charlie Brown', email: 'charlie@ektm.local', nim: 20240003, kelas: '20.1C.03', semester: 3, jurusan: informatikaJurusan },
    
    // Rekayasa Perangkat Lunak
    { name: 'David Wilson', email: 'david@ektm.local', nim: 20240004, kelas: '20.1D.01', semester: 1, jurusan: RekayasaPerangkatLunakJurusan },
    { name: 'Eva Garcia', email: 'eva@ektm.local', nim: 20240005, kelas: '20.1D.02', semester: 2, jurusan: RekayasaPerangkatLunakJurusan },
    
    // Elektro
    { name: 'Frank Miller', email: 'frank@ektm.local', nim: 20240006, kelas: '20.1E.01', semester: 1, jurusan: elektroJurusan },
    { name: 'Grace Lee', email: 'grace@ektm.local', nim: 20240007, kelas: '20.1E.02', semester: 2, jurusan: elektroJurusan },
    
    // Sistem Informasi
    { name: 'Henry Davis', email: 'henry@ektm.local', nim: 20240008, kelas: '20.1F.01', semester: 1, jurusan: sistemInformasiJurusan },
    { name: 'Ivy Chen', email: 'ivy@ektm.local', nim: 20240009, kelas: '20.1F.02', semester: 2, jurusan: sistemInformasiJurusan },
  ];

  // Create mahasiswa
  for (const mhs of mahasiswaData) {
    await prisma.mahasiswa.create({
      data: {
        name: mhs.name,
        email: mhs.email,
        password: mahasiswaHash,
        nim: mhs.nim,
        kelas: mhs.kelas,
        phone: '081234567890',
        semester: mhs.semester,
        jurusanId: mhs.jurusan.id,
        foto: null,
      },
    });
  }

  // Create sample payments untuk testing auto-populate feature
  const samplePayments = [
    {
      mahasiswaId: mahasiswaData[0].nim, // Surya Wibisono (Manajemen Semester 1)
      paymentCode: 'PAY-2024-001',
      semester: 1,
      biayaPokok: 5500000, // Auto-populated dari biaya default
      biayaTambahanJurusan: 1100000,
      biayaPraktikum: 550000,
      biayaUjian: 330000,
      biayaKegiatan: 220000,
      totalPayment: 7680000,
      paymentMethod: 'bank',
      status: 'belum'
    },
    {
      mahasiswaId: mahasiswaData[3].nim, // John Doe (Akuntansi Semester 3)
      paymentCode: 'PAY-2024-002',
      semester: 3,
      biayaPokok: 6352500, // Auto-populated dari biaya default
      biayaTambahanJurusan: 1386000,
      biayaPraktikum: 831600, // Praktikum lebih mahal di semester 3+
      biayaUjian: 404250,
      biayaKegiatan: 288750,
      totalPayment: 9282600,
      paymentMethod: 'e_wallet',
      status: 'lunas'
    },
    {
      mahasiswaId: mahasiswaData[6].nim, // Alice Johnson (Informatika Semester 1)
      paymentCode: 'PAY-2024-003',
      semester: 1,
      biayaPokok: 6600000, // Auto-populated dari biaya default
      biayaTambahanJurusan: 1650000,
      biayaPraktikum: 880000,
      biayaUjian: 440000,
      biayaKegiatan: 330000,
      totalPayment: 9870000,
      paymentMethod: 'credit_card',
      status: 'belum'
    }
  ];

  // Get mahasiswa IDs untuk payment
  const mahasiswaIds = await prisma.mahasiswa.findMany({
    select: { id: true, nim: true }
  });

  // Create payments
  for (const payment of samplePayments) {
    const mahasiswa = mahasiswaIds.find(m => m.nim === payment.mahasiswaId);
    if (mahasiswa) {
      await prisma.payment.create({
        data: {
          mahasiswaId: mahasiswa.id,
          paymentCode: payment.paymentCode,
          semester: payment.semester,
          biayaPokok: payment.biayaPokok,
          biayaTambahanJurusan: payment.biayaTambahanJurusan,
          biayaPraktikum: payment.biayaPraktikum,
          biayaUjian: payment.biayaUjian,
          biayaKegiatan: payment.biayaKegiatan,
          totalPayment: payment.totalPayment,
          paymentMethod: payment.paymentMethod as any,
          status: payment.status as any,
        },
      });
    }
  }

  console.log('🎉 Seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- 👥 Admins: 2 accounts');
  console.log('  • admin@ektm.local / Admin#12345');
  console.log('  • admin@mail.com / admin12345');
  console.log('- 🏫 Campus: 2 (Kramat, Slipi)');
  console.log('- 🎓 Fakultas: 2 (Ekonomi dan Bisnis, Teknik dan Informatika)');
  console.log('- 📚 Jurusan: 6 (Manajemen, Akuntansi, Informatika, RPL, Elektro, Sistem Informasi)');
  console.log('- 💰 BiayaDefault: 48 records (6 jurusan × 8 semester)');
  console.log('- 👨‍🎓 Mahasiswa: 15 students across all jurusan and semesters');
  console.log('- 💳 Sample Payments: 3 payments untuk testing auto-populate');
  
  console.log('\n🔧 Testing Features:');
  console.log('- ✅ Auto-populate biaya berdasarkan jurusan dan semester');
  console.log('- ✅ Biaya berbeda per semester (semester ganjil +10%, genap +5%)');
  console.log('- ✅ Praktikum lebih mahal dari semester 3+ (+20%)');
  console.log('- ✅ Mahasiswa dengan berbagai semester untuk testing');
  
  console.log('\n📝 Sample Mahasiswa untuk Testing:');
  console.log('- Surya Wibisono (Manajemen S1) - mhs@ektm.local / password123');
  console.log('- John Doe (Akuntansi S3) - johndoe@mail.com / password123');
  console.log('- Alice Johnson (Informatika S1) - alice@ektm.local / password123');
  
  console.log('\n🚀 Ready to test auto-payment feature!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });