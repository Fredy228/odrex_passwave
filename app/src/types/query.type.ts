export type QueryGetType = {
  range?: [number, number];
  sort?: [string, string];
  filter?: Record<string, any>;
};
