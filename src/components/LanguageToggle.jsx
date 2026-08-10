"use client";

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslation } from "@/i18n/LocaleProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageToggle() {
  const { locale, setLocale, t, locales } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-line-strong hover:border-line-strong hover:bg-paper-dim gap-2"
        >
          <Languages className="h-4 w-4" />
          {t(`languages.${locale}`)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-line shadow-xl">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code)}
            className={`cursor-pointer ${code === locale ? "font-semibold text-ink" : ""}`}
          >
            {t(`languages.${code}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
