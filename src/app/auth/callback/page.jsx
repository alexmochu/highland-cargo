"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const { setUser, setProfile } = useAuthStore()

  useEffect(() => {
    const createProfileIfNeeded = async (user) => {
      try {
        // 1. Check if profile already exists
        const { data: existingProfile, error: selectError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (selectError) {
          console.error("Error checking for existing profile:", selectError.message)
          return null
        }

        if (existingProfile) {
          console.log("Profile already exists, using it.")
          return existingProfile
        }

        // 2. Create new profile (for passwordless signups, not invited ones)
        const fullName = user.user_metadata.full_name || ""
        const firstName = user.user_metadata.first_name || (fullName ? fullName.split(" ")[0] : "")
        const lastName = user.user_metadata.last_name || (fullName ? fullName.split(" ").slice(1).join(" ") : "")
        const avatarUrl = user.user_metadata.avatar_url || ""
        const email = user.email || ""

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            email,
            full_name: fullName || `${firstName} ${lastName}`.trim(),
            avatar_url: avatarUrl,
          })
          .select()
          .single()

        if (insertError) {
          console.error("Error creating profile:", insertError.message)
          return null
        }

        console.log("Profile created successfully.")
        return newProfile
      } catch (error) {
        console.error("Error in createProfileIfNeeded:", error)
        return null
      }
    }

    const handleAuthCallback = async () => {
      try {
        const { hash, searchParams } = new URL(window.location.href)
        const next = searchParams.get("next") || "/products"

        // Email invite or magic link flow
        if (hash) {
          const params = new URLSearchParams(hash.replace("#", "?"))
          const access_token = params.get("access_token")
          const refresh_token = params.get("refresh_token")

          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token })

            const {
              data: { session },
            } = await supabase.auth.getSession()

            if (session?.user) {
              setUser(session.user)
              const profile = await createProfileIfNeeded(session.user)
              if (profile) setProfile(profile)
            }

            router.refresh()
            return router.push(next)
          }
        }

        // OAuth / PKCE flow
        const code = searchParams.get("code")
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)

          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session?.user) {
            setUser(session.user)
            const profile = await createProfileIfNeeded(session.user)
            if (profile) setProfile(profile)
          }

          router.refresh()
          return router.push(next)
        }

        throw new Error("No authentication tokens found in URL")
      } catch (error) {
        console.error("Authentication error:", error)
        router.push(`/auth/error?message=${encodeURIComponent(error.message)}`)
      }
    }

    handleAuthCallback()
  }, [router, supabase, setUser, setProfile])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
        <p className="text-muted-foreground">You will be redirected automatically.</p>
      </div>
    </div>
  )
}
