export const parseJson = <T>(data: string | null): T | null => {
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
