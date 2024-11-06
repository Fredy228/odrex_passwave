import $api from "@/api/base.api";

import { QueryGetType } from "@/types/query.type";
import { PasswordInterface } from "@/interface/password.interface";

type BodyCreatePassType = {
  name: string;
  entry?: string;
  address?: string;
  access?: string;
  login?: string;
  password?: string;
  notes?: string | null;
};
export const createPass = async (
  body: BodyCreatePassType,
  files: File[],
  deviceId: number,
): Promise<PasswordInterface> => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value) formData.set(key, value);
  }
  files.forEach((file: File) => {
    formData.append("files", file);
  });

  const { data } = await $api.post<PasswordInterface>(
    `/password/${deviceId}`,
    formData,
  );

  return data;
};

export const updatePass = async (
  id: number,
  body: Partial<BodyCreatePassType>,
  files?: File[],
): Promise<PasswordInterface> => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value) formData.set(key, value);
  }
  files?.forEach((file: File) => {
    formData.append("files", file);
  });

  const { data } = await $api.patch<PasswordInterface>(
    `/password/${id}`,
    formData,
  );

  return data;
};

export const getAllPass = async (
  { filter, sort, range }: QueryGetType,
  deviceId: number,
): Promise<{
  data: PasswordInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: PasswordInterface[];
    total: number;
  }>(`/password/${deviceId}`, {
    params,
  });

  return data;
};

export const getPassById = async (id: number) => {
  const { data } = await $api.get<PasswordInterface>(`/password/id/${id}`);

  return data;
};

export const deletePassById = async (id: number) => {
  await $api.delete(`/password/${id}`);
};

export const deleteFilePassById = async (id: number, key: string) => {
  await $api.delete(`/password/file/${id}/${key}`);
};
