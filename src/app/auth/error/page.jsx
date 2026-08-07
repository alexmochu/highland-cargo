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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-xl">
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-slate-800">Sign-in failed</h2>
        <p className="text-slate-600 mb-8">{message}</p>
        <Button asChild className="bg-slate-800 hover:bg-slate-700 text-white">
          <Link href="/auth">Try Again</Link>
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
