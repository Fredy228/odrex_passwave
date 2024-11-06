import { RoleEnum } from "../enum/role.enum";

type TBaseAuthBody = {
  email: string;
  password: string;
};

export type TLoginBody = TBaseAuthBody;

export type TRegisterBody = {
  name: string;
  role: RoleEnum;
} & TBaseAuthBody;
