function getChangedFields<T extends Record<string, any>>(
  original: T,
  updated: T,
): Partial<T> | null {
  const changes: Partial<T> = {};

  Object.keys(original).forEach((key) => {
    if (!updated[key]) return;
    if (original[key] !== updated[key]) {
      changes[key as keyof T] = updated[key];
    }
  });

  return Object.keys(changes).length > 0 ? changes : null;
}

export default getChangedFields;
