// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from "@/components/ui/button";
import { Menu, Globe, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'next-i18next';
import LanguageToggle from "./LanguageToggle";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  console.log('ge', t("brand"))
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                HC
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">{t("brand")}</h1>
              <p className="text-sm text-gray-600">{t("tagline")}</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">{t("services")}</a>
            <a href="/support" className="text-gray-700 hover:text-blue-600 transition-colors">{t("support")}</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">{t("about")}</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">{t("contact")}</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-500 transition-colors">{t("dashboard")}</a>
            <a href="/admin" className="text-gray-700 hover:text-orange-600 transition-colors">{t("admin")}</a>
            <a href="/login" className="text-gray-700 hover:text-orange-500 transition-colors">{t("login")}</a>
            <a href="/signup" className="text-gray-700 hover:text-blue-400 transition-colors">{t("signup")}</a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Button className="bg-orange-500 hover:bg-orange-600">
              {t("get_quote")}
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
              <a href="/services" className="text-gray-700 hover:text-blue-600">{t("services")}</a>
              <a href="/support" className="text-gray-700 hover:text-blue-600">{t("support")}</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600">{t("about")}</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600">{t("contact")}</a>
              <a href="/login" className="text-gray-700 hover:text-orange-500">{t("login")}</a>
              <a href="/signup" className="text-gray-700 hover:text-blue-400">{t("signup")}</a>
              <div className="flex flex-col space-y-2 pt-4">
                <LanguageToggle />
                <Button className="bg-orange-500 hover:bg-orange-600">{t("get_quote")}</Button>
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