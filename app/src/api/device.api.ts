import $api from "@/api/base.api";

import { DeviceInterface } from "@/interface/device.interface";

type BodyCreateDeviceType = {
  name: string;
  interface?: string | null;
  image: string | null;
  edges_to: number[];
};
export const createDevice = async (
  body: BodyCreateDeviceType,
  hallId: number,
): Promise<DeviceInterface> => {
  const { data } = await $api.post<DeviceInterface>(`/device/${hallId}`, body);

  return data;
};

export const updateDevice = async (
  body: Partial<BodyCreateDeviceType>,
  deviceId: number,
): Promise<DeviceInterface> => {
  const { data } = await $api.patch<DeviceInterface>(
    `/device/${deviceId}`,
    body,
  );

  return data;
};

export const getAllDevices = async (
  hallId: number,
): Promise<DeviceInterface[]> => {
  const { data } = await $api.get<DeviceInterface[]>(`/device/${hallId}`);

  return data;
};

export const getDeviceById = async (id: number): Promise<DeviceInterface> => {
  const { data } = await $api.get<DeviceInterface>(`/device/id/${id}`);

  return data;
};

export const deleteDeviceById = async (id: number) => {
  await $api.delete(`/device/${id}`);
};
