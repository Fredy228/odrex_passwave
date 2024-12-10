import $api from "@/api/base.api";

import { QueryGetType } from "@/types/query.type";
import { UserDeviceInterface } from "@/interface/user.interface";

export const getAllSession = async ({
  filter,
  sort,
  range,
}: QueryGetType): Promise<{
  data: UserDeviceInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: UserDeviceInterface[];
    total: number;
  }>("/user-device", {
    params,
  });

  return data;
};

export const deleteSessionById = async (id: number) => {
  await $api.delete(`/user-device/${id}`);
};
