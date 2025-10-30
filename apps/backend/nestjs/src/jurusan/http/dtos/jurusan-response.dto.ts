export class JurusanResponseDto {
    id: string;
    name: string;
    fakultasId: string;
    fakultas: {
      id: string;
      name: string;
      campus: {
        id: string;
        name: string;
      };
    };
    createdAt: Date;
    updatedAt: Date;
  }
  