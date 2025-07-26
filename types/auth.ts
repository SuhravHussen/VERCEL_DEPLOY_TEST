// Dictionary interfaces for auth components
export interface ForgotPasswordDictionary {
  auth: {
    login: {
      email: string;
    };
    resetPasswordButton: string;
    passwordResetEmailSent: string;
    backToLogin: string;
  };
}

export interface ResetPasswordDictionary {
  auth: {
    newPassword: string;
    confirmPassword: string;
    resetPasswordButton: string;
    passwordResetSuccess: string;
    backToLogin: string;
  };
}

// DTOs for password reset
export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export interface ResetResponse {
  success: boolean;
  message: string;
}
