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
    const createUserProfile = async (user) => {
      try {
        const fullName = user.user_metadata.full_name || ""
        const firstName = user.user_metadata.first_name || (fullName ? fullName.split(" ")[0] : "")
        const lastName = user.user_metadata.last_name || (fullName ? fullName.split(" ").slice(1).join(" ") : "")
        const avatarUrl = user.user_metadata.avatar_url || ""
        const email = user.user_metadata.email || ""

        const { data: existingProfile, error: selectError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (selectError) {
          console.error("Error checking for existing profile:", selectError.message)
          return
        }

        if (existingProfile) {
          console.log("Profile already exists. Skipping creation.")
          setProfile(existingProfile)
          return
        }

        const { data: insertedUser, error: insertUserError } = await supabase
          .from("profiles")
          .insert({
            email: email,
            avatar_url: avatarUrl,
            full_name: fullName,
            user_id: user.id
          })
          .select()

        if (insertUserError) {
          console.error("Error creating profile:", insertUserError.message)
        } else {
          console.log("Profile created successfully.")
          if (insertedUser && insertedUser.length > 0) {
            setProfile(insertedUser[0])
          }
        }

        // Verify the inserted user exists before inserting the role.
        if (!insertedUser || insertedUser.length === 0) {
          console.error("User insertion did not return a valid user row.")
          return
        }

        // Insert corresponding user role into the "user_roles" table.
        // const { error: insertRoleError } = await supabase.from("user_roles").insert({
        //   role: role,
        // })

        // if (insertRoleError) {
        //   console.error("Error inserting user role:", insertRoleError.message)
        // } else {
        //   console.log("User role inserted successfully in the user_roles table.")
        // }
      } catch (error) {
        console.error("Error in createUserProfile:", error)
      }
    }
    // const syncProfile = async (user) => {

    // try {if (user) {
    //     // Call Edge Function to sync profile
    //     await fetch(`
    //       /api/sync-profile`, {
    //       method: 'POST',
    //       body: JSON.stringify({ user: user }),
    //       headers: { 'Content-Type': 'application/json' }
    //     });

    //     // Redirect to dashboard after syncing
    //     router.push('/dashboard');
    //   } 
    // } catch (error){
    //     console.error("Error inrofile syncProfile:", error)
    // }
    // };
    const handleAuthCallback = async () => {
      try {
        const { hash, searchParams } = new URL(window.location.href)
        const next = searchParams.get("next") || "/dashboard"
        const role = searchParams.get("role")

        // Handle email confirmation with hash parameters
        if (hash) {
          const params = new URLSearchParams(hash.replace("#", "?"))
          const access_token = params.get("access_token")
          const refresh_token = params.get("refresh_token")

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            })

            const {
              data: { session },
            } = await supabase.auth.getSession()
            if (session?.user) {
              setUser(session.user)
              await createUserProfile(session.user)
            }

            router.refresh()
            return router.push(next)
          }
        }

        // Handle OAuth flow with code parameter
        const code = searchParams.get("code")
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)

          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (session?.user) {
            setUser(session.user)
            await createUserProfile(session.user)
          }

          router.refresh()
          return router.push(next)
        }

        throw new Error("No authentication tokens found in URL")
      } catch (error) {
        console.error("Authentication error:", error)
        router.push(`/auth/error?message=${encodeURIComponent((error).message)}`)
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