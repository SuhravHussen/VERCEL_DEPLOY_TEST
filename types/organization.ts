import { User } from "./user";

export interface Organization {
  id: number;
  name: string;
  logo: string;
  description: string;
  users?: User[];
  instructors?: User[];
}
