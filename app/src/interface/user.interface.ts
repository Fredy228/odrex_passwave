import { RoleEnum } from "@/enum/role.enum";
import { UserPhoneType } from "@/types/user.type";

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  phone: UserPhoneType | null;
  role: RoleEnum;
  avatarUrl: string | null;
  accessToken?: string;
  refreshToken?: string;
}
