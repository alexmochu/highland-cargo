"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "Something went wrong while signing you in."

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-dim p-8">
      <div className="text-center max-w-md bg-surface border border-line p-10 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-red-500" />
        <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center border border-red-200 bg-red-50">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <h2 className="font-display font-extrabold text-2xl mb-2">Sign-in failed</h2>
        <p className="text-text-2 mb-8">{message}</p>
        <Button asChild className="bg-ink hover:bg-ink/90 text-paper rounded-none">
          <Link href="/auth">Try again</Link>
        </Button>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AuthErrorContent />
    </Suspense>
  )
}
