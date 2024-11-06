export const getExistValue = (obj: Record<string, string>) => {
  const filteredObj: Record<string, string> = {};
  Object.keys(obj).forEach((key: string) => {
    if (obj[key]?.trim()) filteredObj[key] = obj[key].trim();
  });
  return filteredObj;
};
