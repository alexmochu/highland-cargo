"use client"

import { createContext, useContext, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"

// Create a context with default values
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const {
    user,
    profile,
    loading,
    error,
    initialized,
    setUser,
    setProfile,
    setLoading,
    setError,
    setInitialized,
    logout,
  } = useAuthStore()

  const supabase = createClient()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user ?? null)

        if (userData.user) {
          // const { data: profileData, error: profileError } = await supabase
          //   .from("users")
          //   .select("*")
          //   .eq("user_id", userData.user.id)
          //   .maybeSingle()

          // if (profileError) {
          //   console.error("Error fetching profile:", profileError.message)
          // } 
          // else if (profileData) {
            // setProfile(profileData)
          // }
          setProfile(userData.user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during authentication")
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // const { data: profileData, error: profileError } = await supabase
        //   .from("users")
        //   .select("*")
        //   .eq("user_id", session.user.id)
        //   .maybeSingle()

        // if (profileError) {
        //   console.error("Error fetching profile:", profileError.message)
        // } else if (profileData) {
        //   setProfile(profileData)
        // }
        setProfile(session?.user)
      } else {
        setProfile({
          full_name: "",
          profile_image_url: "",
          user_type: ""
        })
      }

      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, setUser, setProfile, setLoading, setError, setInitialized])

  // We still provide the context for backward compatibility
  return <AuthContext.Provider value={useAuthStore()}>{children}</AuthContext.Provider>
}

// Updated useAuth hook that combines context and store
export function useAuth() {
  const contextValue = useContext(AuthContext)
  const storeValue = useAuthStore()

  // If the context has values (meaning we're inside the provider), use those
  // Otherwise fall back to the store directly
  return Object.keys(contextValue).length > 0 ? contextValue : storeValue
}