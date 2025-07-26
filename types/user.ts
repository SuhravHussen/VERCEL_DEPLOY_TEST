import { Organization } from "./organization";
import { Role } from "./role";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional in responses, but used for authentication
  createdAt: string;
  updatedAt: string;
  role: Role;
  avatar?: string;
  organizations_admin?: Organization[];
  organizations_instructor?: Organization[];
}

export interface UserResponse {
  user: Omit<User, "password">; // Exclude password from response
  token: string;
}
