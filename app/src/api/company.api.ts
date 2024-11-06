import $api from "@/api/base.api";

import { CompanyInterface } from "@/interface/company.interface";
import { QueryGetType } from "@/types/query.type";

type BodyCompanyType = {
  name: string;
  notes?: string | null;
};
export const createCompany = async (
  body: BodyCompanyType,
): Promise<CompanyInterface> => {
  const { data } = await $api.post<CompanyInterface>("/company", body);

  return data;
};

export const updateCompany = async (
  id: number,
  body: Partial<BodyCompanyType>,
): Promise<CompanyInterface> => {
  const { data } = await $api.patch<CompanyInterface>(`/company/${id}`, body);

  return data;
};

export const getAllCompanies = async ({
  filter,
  sort,
  range,
}: QueryGetType): Promise<{
  data: CompanyInterface[];
  total: number;
}> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<{
    data: CompanyInterface[];
    total: number;
  }>("/company", {
    params,
  });

  return data;
};

export const getCompanyById = async (id: number) => {
  const { data } = await $api.get<CompanyInterface>(`/company/${id}`);

  return data;
};

export const deleteCompanyById = async (id: number) => {
  await $api.delete(`/company/${id}`);
};
