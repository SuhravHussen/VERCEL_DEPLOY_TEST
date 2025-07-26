"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/authService";
import { LoginDTO, RegisterDTO } from "@/types/dto/auth.dto";
import { UserResponse } from "@/types/user";
import { setAuthCookies } from "@/lib/auth";
export const useLogin = () => {
  return useMutation<UserResponse, Error, LoginDTO>({
    mutationFn: (data) => authService.login(data),
    onSuccess: async (data) => {
      await setAuthCookies(data.user, data.token);
    },
  });
};

export const useRegister = () => {
  return useMutation<UserResponse, Error, RegisterDTO>({
    mutationFn: (data) => authService.register(data),
  });
};
