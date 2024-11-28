import $api from "@/api/base.api";

import {
  EPrivilegeDirection,
  EPrivilegeList,
  EPrivilegeType,
  Permit,
} from "@/enum/privilege.enum";
import { PrivilegeItemInterface } from "@/interface/privilege.interface";
import { QueryGetType } from "@/types/query.type";

type PrivilegeAddParamType = {
  direction: EPrivilegeDirection;
  type: EPrivilegeType;
  list: EPrivilegeList;
  id: number;
  target_id: number;
  access: Permit;
};
export const createOrUpdatePrivilege = async (
  param: PrivilegeAddParamType,
): Promise<void> => {
  const { direction, list, access, target_id, type, id } = param;

  await $api.post(`privilege/${direction}/${type}/${id}/${list}/${target_id}`, {
    access,
  });
};

type PrivilegeGetListType = {
  type: EPrivilegeType;
  list: EPrivilegeList;
  id: number;
};
export const getAllPrivileges = async (
  { type, list, id }: PrivilegeGetListType,
  { filter, sort, range }: QueryGetType,
): Promise<{
  data: PrivilegeItemInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get(`privilege/${type}/${list}/${id}`);

  return data;
};

export const deletePrivilegeById = async (id: number) => {
  await $api.delete(`/privilege/${id}`);
};
