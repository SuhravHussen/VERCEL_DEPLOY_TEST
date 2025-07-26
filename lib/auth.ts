"use server";

import { cookies } from "next/headers";
import { User } from "@/types/user";
import { config } from "@/config";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = config.app.auth.tokenName;
const USER_COOKIE_NAME = config.app.auth.userDataName;
const COOKIE_EXPIRATION = config.app.auth.cookieExpirationTime;
const SECURE_ONLY = config.app.auth.secureOnly;

// Set authentication cookies
export async function setAuthCookies(user: User, token: string) {
  // Remove password from user object before storing in cookie
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;

  const cookiesInstance = await cookies();

  // In a real app, you would use secure, httpOnly cookies with proper expiration
  cookiesInstance.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: SECURE_ONLY,
    maxAge: COOKIE_EXPIRATION,
  });

  cookiesInstance.set({
    name: USER_COOKIE_NAME,
    value: JSON.stringify(safeUser),
    path: "/",
    secure: SECURE_ONLY,
    maxAge: COOKIE_EXPIRATION,
  });
}

// Clear authentication cookies
export async function clearAuthCookies() {
  const cookiesInstance = await cookies();
  cookiesInstance.delete(AUTH_COOKIE_NAME);
  cookiesInstance.delete(USER_COOKIE_NAME);
}

// Get current user from cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookiesInstance = await cookies();
  const userCookie = cookiesInstance.get(USER_COOKIE_NAME);

  if (!userCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(userCookie.value) as User;
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    // Ignore parse errors
    return null;
  }
}

// Get auth token from cookie
export async function getAuthToken(): Promise<string | null> {
  const cookiesInstance = await cookies();
  const tokenCookie = cookiesInstance.get(AUTH_COOKIE_NAME);
  return tokenCookie?.value || null;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  const user = await getCurrentUser();

  return !!token && !!user;
}

export async function signOut() {
  await clearAuthCookies();
  redirect("/");
}
