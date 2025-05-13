// store/phoneStore.ts
import { create } from "zustand";

interface PhoneStore {
  userName: string;
  setUserName: (value: string) => void;
  clearUserName: () => void;
}

export const usePhoneStore = create<PhoneStore>((set) => ({
  userName: "",
  setUserName: (value: string) => set({ userName: value }),
  clearUserName: () => set({ userName: "" }),
}));
