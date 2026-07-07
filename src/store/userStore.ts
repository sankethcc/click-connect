import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Session } from "@/types/auth";
import { getCookie } from "@/lib/cookies";
import { clearTokens } from "@/lib/token-handler";

interface UserState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loginUser: (user: User, session: Session) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,

      loginUser: (user, session) => {
        set({ user, session, isAuthenticated: true });
      },

      logout: () => {
        clearTokens();
        set({ user: null, session: null, isAuthenticated: false });
      },

      hydrate: () => {
        try {
          const userCookie = getCookie("user_data");
          const sessionCookie = getCookie("session");

          if (userCookie && sessionCookie) {
            const user = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
            const session = typeof sessionCookie === "string" ? JSON.parse(sessionCookie) : sessionCookie;
            set({ user, session, isAuthenticated: true });
          } else {
            set({ user: null, session: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, session: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "click-connect-user",
    }
  )
);
