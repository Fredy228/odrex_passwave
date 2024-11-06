export const getFirstFieldValue = (
  obj: Record<string, any> | null | undefined,
): string | null => {
  if (obj && Object.keys(obj).length) {
    return Object.keys(obj)[0];
  }
  return null;
};
