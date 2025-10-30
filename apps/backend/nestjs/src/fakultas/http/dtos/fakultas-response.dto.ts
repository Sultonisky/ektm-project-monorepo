export class FakultasResponseDto {
    id: string;
    name: string;
    campusId: string;
    campus: {
      id: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }