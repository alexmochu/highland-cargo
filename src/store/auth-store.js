import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"

// const UserProfile = {
//   id: string,
//   user_id: string,
//   full_name: string,
//   email: string,
//   profile_image_url: string,
//   user_type: string,
// }

// const AuthState = {
//   user: any | null,
//   profile: UserProfile,
//   loading: boolean,
//   error: string | null,
//   initialized: boolean,
//   setUser: (user),
//   setProfile: (profile),
//   setLoading: (loading),
//   setError: (error),
//   setInitialized: (initialized),
//   logout: (null),
//   clearStore: (null),
// }

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      profile: {
        full_name: "",
        profile_image_url: "",
        user_type: ""
      },
      loading: true,
      error: null,
      initialized: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ initialized }),
      logout: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        get().clearStore()
      },
      clearStore: () =>
        set({
          user: null,
          profile: {
            full_name: "",
            profile_image_url: "",
          },
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    },
  ),
)