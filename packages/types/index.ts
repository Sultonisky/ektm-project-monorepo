// Contoh shared types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Export types dari Prisma juga bisa
// export type { User as PrismaUser } from "monorepo-ektm-database"; // Removed due to missing module
