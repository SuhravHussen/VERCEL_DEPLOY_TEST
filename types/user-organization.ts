import { Organization } from "./organization";
import { Role } from "./role";

export type UserOrganization = {
  role: Role;
  organization: Organization;
};
