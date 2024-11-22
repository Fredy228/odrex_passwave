import { Permit } from "@/enum/privilege.enum";

export interface PrivilegeInterface {
  id: number;
  access: Permit;
  groupId: number;
  companyId: number | null;
  hallId: number | null;
  deviceId: number | null;
  passwordId: number | null;
}
