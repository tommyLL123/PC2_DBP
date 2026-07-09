export type CourseStatus = 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO';

export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  grade: number;
  status: CourseStatus;
}

export interface CourseInput {
  name: string;
  code: string;
  credits: number;
  grade: number;
  status: CourseStatus;
}

export interface CoursePage {
  content: Course[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
