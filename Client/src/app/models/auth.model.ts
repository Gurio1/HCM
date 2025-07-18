export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  department: string;
  password: string;
  confirmedPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  accessTokenExpiry: string;
  refreshTokenValidityMinutes: number;
}

export interface User {
  personId: string;
  email: string;
  role: string;
  department: string;
}