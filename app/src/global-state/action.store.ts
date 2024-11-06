import { create } from "zustand";

interface StoreInterface {
  deleteUserId: number | null;
  setDeleteUser: (id: number | null) => void;
  navMap: Array<{
    path: string | number;
    name: string;
  }>;
  setNavMap: (map: Array<{ name: string; path: string }>) => void;
}

const useActionStore = create<StoreInterface>((set) => ({
  deleteUserId: null,
  setDeleteUser: (id: number | null) => set(() => ({ deleteUserId: id })),
  navMap: [],
  setNavMap: (map: Array<{ name: string; path: string }>) =>
    set(() => ({ navMap: map })),
}));

export default useActionStore;
