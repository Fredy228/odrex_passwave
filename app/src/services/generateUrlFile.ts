export const generateUrlFile = (url?: string | null) => {
  if (url) return `${process.env.REACT_APP_SERVER_URL}/${url}`;
  return undefined;
};
