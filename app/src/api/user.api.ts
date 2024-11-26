import $api from "./base.api";
import { UserInterface } from "@/interface/user.interface";
import { RoleEnum } from "@/enum/role.enum";
import { UserPhoneType } from "@/types/user.type";
import { QueryGetType } from "@/types/query.type";

export const getMe = async (): Promise<UserInterface> => {
  const { data } = await $api.get<UserInterface>("/user/me");
  return data;
};

type BodyCreateUserType = {
  name: string;
  email: string;
  role: RoleEnum;
  phone: UserPhoneType;
  password: string;
  avatar: string;
};
export const createUser = async (body: BodyCreateUserType) => {
  const { data } = await $api.post<UserInterface>("/user", body);
  return data;
};

export const getAllUsers = async ({
  filter,
  range,
  sort,
}: QueryGetType): Promise<{
  data: UserInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: UserInterface[];
    total: number;
  }>("/user", {
    params,
  });

  return data;
};

export const getUserById = async (id: number): Promise<UserInterface> => {
  const { data } = await $api.get<UserInterface>(`/user/${id}`);
  return data;
};

export const updateUserById = async (
  id: number,
  body: Partial<Omit<BodyCreateUserType, "avatar" | "password">>,
): Promise<void> => {
  await $api.patch(`/user/${id}`, body);
};

export const deleteUserById = async (id: number): Promise<void> => {
  await $api.delete(`/user/${id}`);
};
