import axios from "axios";

import $api from "./base.api";
import { TLoginBody } from "@/types/auth.type";
import { UserInterface } from "@/interface/user.interface";

export const loginUser = async (
  credentials: TLoginBody,
): Promise<UserInterface> => {
  const { data } = await axios.post("/auth/login", credentials, {
    withCredentials: true,
  });
  return data;
};

export const logoutUser = async (): Promise<void> => {
  await $api.get("/auth/logout");
};

export const changeUserPassword = async (
  currentPass: string,
  newPass: string,
) => {
  await $api.patch("/auth/change-pass", { currentPass, newPass });
};
