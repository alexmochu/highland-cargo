"use client"
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, ChevronDown, BookOpen } from "lucide-react"
import { useState, useTransition } from "react";
import { useAuth } from "@/components/auth-provider"
import { useTranslation } from "@/i18n/LocaleProvider";
import LanguageToggle from "./LanguageToggle";
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation"

export const Header = () => {
  const { user, profile, loading, logout } = useAuth()
  const { t } = useTranslation()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    startTransition(async () => {
      await logout()
      router.push("/")
      router.refresh()
    })
  }

  const getInitials = (name) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const navLinks = [
    { href: "/services", label: t("nav.services") },
    { href: "/products", label: t("nav.products") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header className="bg-paper/90 backdrop-blur-xl sticky top-0 z-50 border-b border-line">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-ink text-paper w-11 h-11 flex items-center justify-center font-display font-extrabold text-lg tracking-tight">
              HC
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl leading-none tracking-tight">
                <span className="text-ink">HIGHLAND </span>
                <span className="text-freight">CARGO</span>
              </h1>
              <p className="text-[11px] text-text-3 font-manifest mt-1 tracking-wide">
                {t("header.tagline")}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "text-ink border-b border-freight"
                    : "text-text-2 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <LanguageToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 ml-2 hover:bg-paper-dim">
                    <Avatar className="h-9 w-9 border-2 border-line">
                      <AvatarImage
                        src={profile.profile_image_url || "/placeholder.svg"}
                        alt={profile.full_name || "User"}
                      />
                      <AvatarFallback className="bg-paper-dim text-text-2 font-medium">
                        {getInitials(profile?.full_name || "") || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-text-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-surface border-line shadow-xl">
                  {profile?.is_admin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="flex items-center p-3 rounded-md hover:bg-paper-dim cursor-pointer"
                        >
                          <User className="mr-3 h-4 w-4 text-text-3" />
                          {t("header.administrator")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {profile?.role === "supplier" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/supplier"
                          className="flex items-center p-3 rounded-md hover:bg-paper-dim cursor-pointer"
                        >
                          <User className="mr-3 h-4 w-4 text-text-3" />
                          {t("header.supplier")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center p-3 rounded-md hover:bg-paper-dim cursor-pointer"
                    >
                      <User className="mr-3 h-4 w-4 text-text-3" />
                      {t("header.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === "partner" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/partner"
                          className="flex items-center p-3 rounded-md hover:bg-paper-dim cursor-pointer"
                        >
                          <User className="mr-3 h-4 w-4 text-text-3" />
                          {t("header.partner")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/docs"
                      className="flex items-center p-3 rounded-md hover:bg-paper-dim cursor-pointer"
                    >
                      <BookOpen className="mr-3 h-4 w-4 text-text-3" />
                      {t("header.documentation")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isPending}
                    className="text-red-600 p-3 rounded-md hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t("header.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="ml-2 bg-ink hover:bg-ink/90 text-paper rounded-none">
                  {t("header.login")}
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden border-line-strong hover:bg-paper-dim"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            <Menu className="w-5 h-5 text-text-2" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-nav" className="md:hidden mt-6 py-6 border-t border-line">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "text-ink bg-paper-dim"
                      : "text-text-2 hover:text-ink hover:bg-paper-dim"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4">
                <LanguageToggle />
              </div>

              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    {profile?.is_admin && (
                      <Link href="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-text-2 hover:text-ink hover:bg-paper-dim">
                        {t("header.administrator")}
                      </Link>
                    )}
                    {profile?.role === "supplier" && (
                      <Link href="/supplier" className="block px-4 py-3 rounded-xl text-sm font-medium text-text-2 hover:text-ink hover:bg-paper-dim">
                        {t("header.supplier")}
                      </Link>
                    )}
                    <Link href="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-text-2 hover:text-ink hover:bg-paper-dim">
                      {t("header.dashboard")}
                    </Link>
                    {profile?.role === "partner" && (
                      <Link href="/partner" className="block px-4 py-3 rounded-xl text-sm font-medium text-text-2 hover:text-ink hover:bg-paper-dim">
                        {t("header.partner")}
                      </Link>
                    )}
                    <Link href="/docs" className="block px-4 py-3 rounded-xl text-sm font-medium text-text-2 hover:text-ink hover:bg-paper-dim">
                      {t("header.documentation")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      {t("header.logout")}
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="block">
                    <Button className="w-full bg-ink hover:bg-ink/90 text-paper rounded-none">
                      {t("header.login")}
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
