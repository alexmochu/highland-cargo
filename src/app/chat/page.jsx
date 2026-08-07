"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { useTranslation } from "@/i18n/LocaleProvider";

function ChatComingSoon() {
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplier");
  const { t } = useTranslation();

  return (
    <ComingSoon
      icon={MessageCircle}
      title={t("comingSoon.chatTitle")}
      description={t("comingSoon.chatDescription")}
      backHref={supplierId ? "/products" : "/"}
      backLabel={supplierId ? t("comingSoon.chatBackToProducts") : t("comingSoon.backHome")}
    >
      <a
        href="tel:+254707126666"
        className="text-slate-700 font-semibold underline underline-offset-4 hover:text-amber-600"
      >
        {t("comingSoon.chatCallCta")}
      </a>
    </ComingSoon>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ChatComingSoon />
    </Suspense>
  );
}
