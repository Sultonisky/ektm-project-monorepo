export class MahasiswaResponseDto {
  id: string;
  name: string;
  email: string;
  nim: number;
  kelas: string;
  phone: string;
  semester: number;
  jurusanId: string;
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
  foto?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 