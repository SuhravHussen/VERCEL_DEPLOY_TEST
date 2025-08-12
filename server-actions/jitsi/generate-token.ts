"use server";

import {
  createJitsiTokenWithConfig,
  type JitsiUserInfo,
} from "@/lib/services/jitsiTokenService";

interface GenerateJitsiTokenParams {
  user: JitsiUserInfo;
  expiresIn?: string | number;
}

/**
 * Server action to generate Jitsi JWT token
 * This must run on the server side because jsonwebtoken library requires Node.js environment
 */
export async function generateJitsiToken({
  user,
  expiresIn = "2h",
}: GenerateJitsiTokenParams): Promise<string | null> {
  try {
    // Use wildcard room "*" to match working token format
    const token = createJitsiTokenWithConfig(user, "*", expiresIn);
    return token;
  } catch (error) {
    console.error("Failed to generate Jitsi token on server:", error);
    return null;
  }
}
