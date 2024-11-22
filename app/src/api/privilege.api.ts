import $api from "@/api/base.api";

import {
  EPrivilegeDirection,
  EPrivilegeList,
  EPrivilegeType,
  Permit,
} from "@/enum/privilege.enum";

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
