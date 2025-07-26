"use client";
import { config } from "@/config";
import Cookies from "js-cookie";
import { User } from "@/types/user";

export function getCurrentUser(): User | null {
  try {
    const userInfo = Cookies.get(config.app.auth.userDataName);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing user data from cookie:", error);
    return null;
  }
}
