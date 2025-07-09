"use client"
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from "@/components/ui/button";
import { Menu, Search, User, LogOut, Settings, ChevronDown, Building2, Globe, Sparkles } from "lucide-react"

import { useState, useTransition, useEffect } from "react";
// import { useTranslation } from 'next-i18next';
import { useAuth } from "@/components/auth-provider"
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
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { t } = useTranslation();

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
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                HC
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                {/* {t("brand")} */}
                <span className="text-blue-600">Highland{' '}</span>
                <span className="text-orange-500">Cargo</span>
                </h1>
              <p className="text-sm text-gray-600">
                {/* {t("tagline")} */}
                Global Logistics Solutions
                </p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">{"Services"}</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">{"Products"}</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">{"About"}</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">{"Contact"}</Link>
            {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 ml-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile.profile_image_url || "/placeholder.svg"}
                      alt={profile.full_name || "User"}
                    />
                    <AvatarFallback>{getInitials(profile?.full_name || "")}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{profile?.full_name || user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800">
              <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Administrator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/supplier"
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Supplier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/partner"
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Partner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isPending}
                  className="text-red-600 dark:text-red-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            ): (
            <Link href="/auth" className="text-gray-700 hover:text-orange-500 transition-colors">{'Login'}</Link>
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {/* <LanguageToggle /> */}
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              {/* {t("get_quote")} */}
              Get Quote
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/services" className="text-gray-700 hover:text-blue-600">{"Services"}</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">{"About"}</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">{"Contact"}</Link>
              {user ? (
                <>
                <Link href="/admin" className="text-gray-700 hover:text-blue-600">{"Administrator"}</Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">{"Dashboard"}</Link>
                <Link href="/Partner" className="text-gray-700 hover:text-blue-600">{"Partner"}</Link>
                <span
                  onClick={handleLogout}
                  disabled={isPending}
                  className="text-red-600 flex dark:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Logout
                </span>
                </>
              ) : (
              <Link href="/auth" className="text-gray-700 hover:text-orange-500">{"Login"}</Link>
              )}
              <div className="flex flex-col space-y-2 pt-4">
                <LanguageToggle />
                <Button className="bg-orange-500 hover:bg-orange-600">{"Get Quote"}</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }