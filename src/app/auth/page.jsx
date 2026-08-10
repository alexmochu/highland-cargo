"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AuthForm } from "@/components/AuthForm"
import { useTranslation } from "@/i18n/LocaleProvider"

function AuthPageContent() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && user) {
      router.replace(searchParams.get("redirect") || "/dashboard")
    }
  }, [loading, user, router, searchParams])

  if (loading || user) {
    return <div className="min-h-screen flex items-center justify-center">{t("auth.loading")}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-paper-dim">
      <AuthForm />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AuthPageContent />
    </Suspense>
  );
}
