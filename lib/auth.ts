"use server";

import { cookies } from "next/headers";
import { User } from "@/types/user";
import { config } from "@/config";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = config.app.auth.tokenName;
const USER_COOKIE_NAME = config.app.auth.userDataName;
const COOKIE_EXPIRATION = config.app.auth.cookieExpirationTime;
const SECURE_ONLY = config.app.auth.secureOnly;

// Get the domain for cookie sharing across subdomains
function getCookieDomain(): string | undefined {
  if (process.env.NODE_ENV === "development") {
    // Use your custom local domain for development
    return ".fluency-checker-local.com";
  } else {
    // For production, use your actual domain
    return process.env.NEXT_PUBLIC_DOMAIN
      ? `.${process.env.NEXT_PUBLIC_DOMAIN}`
      : undefined;
  }
}

// Set authentication cookies
export async function setAuthCookies(user: User, token: string) {
  // Remove password from user object before storing in cookie
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;

  const cookiesInstance = await cookies();
  const cookieDomain = getCookieDomain();

  console.log("Setting cookies with domain:", cookieDomain);

  // Set auth token cookie
  cookiesInstance.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: SECURE_ONLY,
    maxAge: COOKIE_EXPIRATION,
    domain: cookieDomain,
    sameSite: "lax",
  });

  // Set user data cookie
  cookiesInstance.set({
    name: USER_COOKIE_NAME,
    value: JSON.stringify(safeUser),
    path: "/",
    secure: SECURE_ONLY,
    maxAge: COOKIE_EXPIRATION,
    domain: cookieDomain,
    sameSite: "lax",
  });
}

// Clear authentication cookies
export async function clearAuthCookies() {
  const cookiesInstance = await cookies();
  const cookieDomain = getCookieDomain();

  console.log("Clearing cookies with domain:", cookieDomain);

  // When clearing cookies, you need to use the same domain
  cookiesInstance.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    secure: SECURE_ONLY,
    maxAge: 0,
    domain: cookieDomain,
    sameSite: "lax",
  });

  cookiesInstance.set({
    name: USER_COOKIE_NAME,
    value: "",
    path: "/",
    secure: SECURE_ONLY,
    maxAge: 0,
    domain: cookieDomain,
    sameSite: "lax",
  });
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

// Debug function to check cookie domain (optional)
export async function debugCookieInfo() {
  const cookiesInstance = await cookies();
  const authCookie = cookiesInstance.get(AUTH_COOKIE_NAME);
  const userCookie = cookiesInstance.get(USER_COOKIE_NAME);

  console.log("Cookie Domain:", getCookieDomain());
  console.log("Auth Cookie Present:", !!authCookie);
  console.log("User Cookie Present:", !!userCookie);
  console.log(
    "Auth Cookie Value:",
    authCookie?.value ? "***EXISTS***" : "NOT_FOUND"
  );
  console.log(
    "User Cookie Value:",
    userCookie?.value ? "***EXISTS***" : "NOT_FOUND"
  );

  return {
    domain: getCookieDomain(),
    hasAuthCookie: !!authCookie,
    hasUserCookie: !!userCookie,
  };
}
