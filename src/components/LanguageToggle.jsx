"use client"
// import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
// import { usePathname } from 'next/navigation';
// import { useParams } from 'next/navigation';
// import { useTranslation } from 'next-i18next';

const LANGS = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" }
];

export default function LanguageToggle() {
  // const router = useRouter();
  // const pathname = usePathname();
  // const { locale } = useParams();
  // const { t } = useTranslation()

  // const changeLanguage = (lng) => {
  //   if (pathname.startsWith(`/${locale}`)) {
  //     const newPath = pathname.replace(`/${locale}`, `/${lng}`);
  //     router.push(newPath);
  //   } else {
  //     router.push(`/${lng}${pathname}`);
  //   }
  // };

  return (
    <div className="flex gap-1">
      {LANGS.map(l => (
        <Button
          key={l.code}
          variant={l.code ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage(l.code)}
        >
          {l.label}
        </Button>
      ))}
      {/* <select
        className="p-2 border rounded"
        value={locale}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">{t('english')}</option>
        <option value="zh">{t('chinese')}</option>
        <option value="ar">{t('arabic')}</option>
      </select> */}
    </div>
  );
}