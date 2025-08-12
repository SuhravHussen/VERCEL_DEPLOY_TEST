import jwt from "jsonwebtoken";

export interface JitsiUserInfo {
  name: string;
  email: string;
  affiliation: "owner" | "member";
}

export interface JitsiTokenConfig {
  user: JitsiUserInfo;
  room: string;
  aud?: string; // audience
  iss?: string; // issuer
  sub?: string; // subject (domain)
  expiresIn?: string | number; // expiration time (e.g., '3m', '180s', or 180)
  secretKey: string; // JWT signing secret
}

export interface JitsiTokenPayload {
  aud: string;
  iss: string;
  sub: string;
  iat: number;
  nbf?: number; // not before (optional)
  exp: number;
  room: string;
  context: {
    user: {
      name?: string; // optional
      email?: string; // optional
      affiliation: "owner" | "member";
    };
  };
}

/**
 * Generates a Jitsi Meet JSON Web Token
 * @param config Configuration object for generating the JWT
 * @returns Signed JWT token string
 */
export function generateJitsiToken(config: JitsiTokenConfig): string {
  const now = Math.floor(Date.now() / 1000);

  // Default values
  const {
    user,
    room,
    aud = "myappid",
    iss = "myappid",
    sub = "*",
    expiresIn = "3m", // 3 minutes default
    secretKey,
  } = config;

  // Calculate expiration time
  let exp: number;
  if (typeof expiresIn === "string") {
    // Parse string format like '3m', '180s', etc.
    const timeValue = parseInt(expiresIn.slice(0, -1));
    const timeUnit = expiresIn.slice(-1);

    switch (timeUnit) {
      case "s":
        exp = now + timeValue;
        break;
      case "m":
        exp = now + timeValue * 60;
        break;
      case "h":
        exp = now + timeValue * 60 * 60;
        break;
      default:
        exp = now + 180; // default 3 minutes
    }
  } else {
    exp = now + expiresIn;
  }

  const payload: JitsiTokenPayload = {
    aud,
    iss,
    sub,
    iat: now,
    nbf: now, // Add not-before field to match working token
    exp,
    room,
    context: {
      user: {
        affiliation: user.affiliation, // Only include affiliation like working token
      },
    },
  };

  return jwt.sign(payload, secretKey, { algorithm: "HS256" });
}

/**
 * Validates and decodes a Jitsi JWT token
 * @param token JWT token string
 * @param secretKey Secret key for verification
 * @returns Decoded payload or null if invalid
 */
export function verifyJitsiToken(
  token: string,
  secretKey: string
): JitsiTokenPayload | null {
  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ["HS256"] });
    return decoded as JitsiTokenPayload;
  } catch (error) {
    console.error("Error verifying Jitsi token:", error);
    return null;
  }
}

/**
 * Helper function to create a token for a meeting owner
 * @param name User's display name
 * @param email User's email
 * @param room Room name/ID
 * @param secretKey JWT signing secret
 * @param expiresIn Token expiration time (default: '3m')
 * @returns JWT token string
 */
export function createOwnerToken(
  name: string,
  email: string,
  room: string,
  secretKey: string,
  expiresIn: string | number = "3m"
): string {
  return generateJitsiToken({
    user: {
      name,
      email,
      affiliation: "owner",
    },
    room,
    secretKey,
    expiresIn,
  });
}

/**
 * Helper function to create a token for a meeting member
 * @param name User's display name
 * @param email User's email
 * @param room Room name/ID
 * @param secretKey JWT signing secret
 * @param expiresIn Token expiration time (default: '3m')
 * @returns JWT token string
 */
export function createMemberToken(
  name: string,
  email: string,
  room: string,
  secretKey: string,
  expiresIn: string | number = "3m"
): string {
  return generateJitsiToken({
    user: {
      name,
      email,
      affiliation: "member",
    },
    room,
    secretKey,
    expiresIn,
  });
}

/**
 * Environment variables configuration for Jitsi
 */
export const jitsiConfig = {
  secretKey: process.env.JITSI_SECRET_KEY || "your-secret-key",
  domain: process.env.JITSI_DOMAIN || "*",
  appId: process.env.JITSI_APP_ID || "myappid",
} as const;

/**
 * Creates a Jitsi token using environment configuration
 * @param user User information
 * @param room Room name/ID
 * @param expiresIn Token expiration (default: '3m')
 * @returns JWT token string
 */
export function createJitsiTokenWithConfig(
  user: JitsiUserInfo,
  room: string,
  expiresIn: string | number = "3m"
): string {
  return generateJitsiToken({
    user,
    room,
    aud: jitsiConfig.appId,
    iss: jitsiConfig.appId,
    sub: jitsiConfig.domain,
    secretKey: jitsiConfig.secretKey,
    expiresIn,
  });
}
