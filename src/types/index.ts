export type UserRole = 'teacher' | 'student';
export type FileType = '교재용' | '학습용' | '자습용';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  supabase_id: string;
}

export interface Folder {
  id: number;
  name: string;
  created_by: string;
  created_at: string;
}

export interface File {
  id: number;
  folder: number;
  name: string;
  file_type: FileType;
  created_by: string;
  created_at: string;
  cells: Cell[];
}

export interface Cell {
  id: number;
  file: number;
  content: string;
  output: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}