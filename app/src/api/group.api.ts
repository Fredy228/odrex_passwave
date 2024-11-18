import $api from "@/api/base.api";

import { GroupInterface } from "@/interface/group.interface";
import { QueryGetType } from "@/types/query.type";

type BodyGroupType = {
  name: string;
};
export const createGroup = async (
  body: BodyGroupType,
): Promise<GroupInterface> => {
  const { data } = await $api.post<GroupInterface>("/privilege-group", body);
  return data;
};

export const updateGroup = async (
  id: number,
  body: Partial<BodyGroupType>,
): Promise<GroupInterface> => {
  const { data } = await $api.patch<GroupInterface>(
    `/privilege-group/${id}`,
    body,
  );

  return data;
};

export const getAllGroup = async ({ filter, sort, range }: QueryGetType) => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: GroupInterface[];
    total: number;
  }>("/privilege-group", {
    params,
  });
  return data;
};

export const deleteGroupById = async (id: number) => {
  await $api.delete(`/privilege-group/${id}`);
};
