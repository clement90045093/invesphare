// app/store/walletStore.ts
import { create } from "zustand";
import type { Wallet } from "ethers";

interface State {
  wallet: Wallet | null;
  setWallet: (w: Wallet | null) => void;
  clear: () => void;
}

export const useWalletStore = create<State>((set) => ({
  wallet: null,
  setWallet: (w) => set({ wallet: w }),
  clear: () => set({ wallet: null }),
}));
