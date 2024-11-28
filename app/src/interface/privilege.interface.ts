import { Permit } from "@/enum/privilege.enum";
import { RoleEnum } from "@/enum/role.enum";

export interface PrivilegeInterface {
  id: number;
  access: Permit;
  groupId: number;
  companyId: number | null;
  hallId: number | null;
  deviceId: number | null;
  passwordId: number | null;
}

export interface PrivilegeItemInterface {
  id: number;
  name: string;
  access: Permit | null;
  privilege_id: number | null;
  email?: string;
  role?: RoleEnum;
}
