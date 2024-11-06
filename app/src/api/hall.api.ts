import $api from "@/api/base.api";

import { HallInterface } from "@/interface/hall.interface";
import { QueryGetType } from "@/types/query.type";

type BodyCreateHallType = {
  name: string;
  notes?: string | null;
};
export const createHall = async (
  body: BodyCreateHallType,
  companyId: number,
): Promise<HallInterface> => {
  const { data } = await $api.post<HallInterface>(`/hall/${companyId}`, body);

  return data;
};

export const updateHall = async (
  id: number,
  body: Partial<BodyCreateHallType>,
): Promise<HallInterface> => {
  const { data } = await $api.patch<HallInterface>(`/hall/${id}`, body);

  return data;
};

export const getAllHalls = async (
  { filter, sort, range }: QueryGetType,
  companyId: number,
): Promise<{
  data: HallInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: HallInterface[];
    total: number;
  }>(`/hall/${companyId}`, {
    params,
  });

  return data;
};

export const getHallById = async (id: number) => {
  const { data } = await $api.get<HallInterface>(`/hall/id/${id}`);

  return data;
};

export const deleteHallById = async (id: number) => {
  await $api.delete(`/hall/${id}`);
};
