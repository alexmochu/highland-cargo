import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" }
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  return (
    <div className="flex gap-1">
      {LANGS.map(l => (
        <Button
          key={l.code}
          variant={i18n.resolvedLanguage === l.code ? "default" : "outline"}
          size="sm"
          onClick={() => i18n.changeLanguage(l.code)}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}