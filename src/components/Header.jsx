"use client"
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, ChevronDown } from "lucide-react"
import { useState, useTransition } from "react";
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
  
  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white p-2.5 rounded-xl shadow-lg shadow-slate-800/20 group-hover:shadow-slate-800/30 transition-all">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-lg tracking-tight">
                HC
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-slate-800">Highland</span>
                <span className="text-amber-500">Cargo</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Global Logistics Solutions
              </p>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href 
                    ? "text-slate-800 bg-amber-50" 
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 ml-2 hover:bg-slate-100">
                    <Avatar className="h-9 w-9 border-2 border-slate-200">
                      <AvatarImage
                        src={profile.profile_image_url || "/placeholder.svg"}
                        alt={profile.full_name || "User"}
                      />
                      <AvatarFallback className="bg-slate-100 text-slate-700 font-medium">
                        {getInitials(profile?.full_name || "") || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="flex items-center p-3 rounded-md hover:bg-slate-100 cursor-pointer"
                    >
                      <User className="mr-3 h-4 w-4 text-slate-500" />
                      Administrator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/supplier"
                      className="flex items-center p-3 rounded-md hover:bg-slate-100 cursor-pointer"
                    >
                      <User className="mr-3 h-4 w-4 text-slate-500" />
                      Supplier
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center p-3 rounded-md hover:bg-slate-100 cursor-pointer"
                    >
                      <User className="mr-3 h-4 w-4 text-slate-500" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/partner"
                      className="flex items-center p-3 rounded-md hover:bg-slate-100 cursor-pointer"
                    >
                      <User className="mr-3 h-4 w-4 text-slate-500" />
                      Partner
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isPending}
                    className="text-red-600 p-3 rounded-md hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="ml-2 bg-slate-800 hover:bg-slate-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden border-slate-300 hover:bg-slate-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 py-6 border-t border-slate-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href 
                      ? "text-slate-800 bg-amber-50" 
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Link href="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                      Administrator
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                      Dashboard
                    </Link>
                    <Link href="/partner" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                      Partner
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="block">
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                      Login
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

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }