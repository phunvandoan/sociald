import { create } from "zustand";
import { DEFAULT_USER } from "../const/_common.const";

const useAppStore = create((set) => ({
  // ================= USER =================
  user: DEFAULT_USER,
  userLoading: false,
  userError: null,

  setUser: (user) => set({ user }),
  setUserLoading: (value) => set({ userLoading: value }),
  setUserError: (error) => set({ userError: error }),

  // ================= COMMENT =================
  comments: [],
  commentLoading: false,
  commentError: null,

  setComments: (comments) => set({ comments }),
  setCommentLoading: (value) => set({ commentLoading: value }),
  setCommentError: (error) => set({ commentError: error }),
}));

export default useAppStore;
