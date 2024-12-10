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

export interface UserDeviceInterface {
  id: number;
  ipAddress: string;
  deviceModel: string;
  createAt: Date;
  updateAt: Date;
  accessToken: string;
  refreshToken?: string;
}
