import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Toaster } from '@/components/ui/toaster'
import ClientLayout from "./ClientLayout"
import "./globals.css";
import "../i18n"

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
        <Header/>
        {children}
        <Toaster/>
    </ClientLayout>
  );
}
