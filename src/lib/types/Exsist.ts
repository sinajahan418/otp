export interface ExsistResponse {
  success?: boolean;
  message: string;
  data?: {
    exists: boolean;
    auth_type: number;
  };
  errors: {
    username: string[];
  };
}
export interface PasswordResponse {
  success?: boolean;
  message: string;
  data?: {
    exists: boolean;
    auth_type: number;
  };
  errors: {
    username: string[];
  };
}