export class BiayaResponseDto {
  id: string;
  jurusanId: string;
  semester: number;
  biayaPokok?: number;
  biayaTambahanJurusan?: number;
  biayaPraktikum?: number;
  biayaUjian?: number;
  biayaKegiatan?: number;
  jurusan: {
    id: string;
    name: string;
    fakultas: {
      id: string;
      name: string;
      campus: {
        id: string;
        name: string;
      };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}