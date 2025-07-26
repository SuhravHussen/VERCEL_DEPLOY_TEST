import { Icons } from "@/resources/icons";

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons | unknown;
  iconImage?: string; // Path to a PNG or other image file
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}
