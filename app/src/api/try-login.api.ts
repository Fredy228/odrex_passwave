import $api from "@/api/base.api";

import { QueryGetType } from "@/types/query.type";
import { TryLoginInterface } from "@/interface/try-login.interface";

export const getAllTryLogin = async ({
  filter,
  sort,
  range,
}: QueryGetType): Promise<{
  data: TryLoginInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: TryLoginInterface[];
    total: number;
  }>("/try-login", {
    params,
  });

  return data;
};

export const deleteTryLoginByIds = async (ids: number[] | number) => {
  await $api.delete(`/try-login`, {
    params: {
      ids: JSON.stringify(Array.isArray(ids) ? ids : [ids]),
    },
  });
};

export const getAllBlockedIp = async ({
  filter,
}: QueryGetType): Promise<{
  data: TryLoginInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);

  const { data } = await $api.get<{
    data: TryLoginInterface[];
    total: number;
  }>("/try-login/blocked", {
    params,
  });
  return data;
};

export const unblockIpAddress = async (ip: string) => {
  await $api.delete(`/try-login/blocked/${ip}`);
};
