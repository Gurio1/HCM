export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  department: string;
  role: string;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  password: string;
  role: string;
  department: string;
}

export interface UpdatePersonRequest {
  personId: string;
  firstName: string;
  lastName: string;
  department: string;
  email: string;
  jobTitle: string;
  salary: number;
  role?: string;
}

export interface PagedResponse {
  persons: Person[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}