import { LoginDTO, RegisterDTO } from "@/types/dto/auth.dto";
import { UserResponse } from "@/types/user";
import mockdb from "@/mockdb";
import { setAuthCookies } from "@/lib/auth";

// In a real app, this would make actual API calls
// For now, we'll use our mockdb

const generateToken = (userId: string): string => {
  // In a real app, this would be a JWT token
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Simulate sending a verification email
const sendVerificationEmail = (email: string): void => {
  console.log(`Sending verification email to: ${email}`);
  console.log(
    `Email content: Please verify your email by clicking on this link: https://fluencychecker.com/verify?token=${btoa(
      email
    )}`
  );
  // In a real app, this would make an API call to an email service
};

export const authService = {
  async login(data: LoginDTO): Promise<UserResponse> {
    console.log("Login request with data:", data);

    // Validate credentials against mockdb
    const user = mockdb.validateCredentials(data);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user.id);
    console.log(user);
    // Return user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  },

  async register(data: RegisterDTO): Promise<UserResponse> {
    console.log("Register request with data:", data);

    // Check if user already exists
    const existingUser = mockdb.findUserByEmail(data.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create new user in mockdb
    const user = mockdb.createUser(data);

    // Generate token
    const token = generateToken(user.id);

    // Simulate sending verification email
    sendVerificationEmail(user.email);

    // Set cookies (in a real app, this would be done on the server)
    await setAuthCookies(user, token);

    // Return user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  },
};
