"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n/LocaleProvider";

export const ComingSoon = ({
  title,
  description,
  icon: Icon,
  backHref = "/",
  backLabel,
  children,
}) => {
  const { t } = useTranslation();
  return (
  <div className="min-h-screen flex items-center justify-center bg-paper-dim p-8">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-2xl"
    >
      {Icon && (
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-ink flex items-center justify-center">
          <Icon className="w-8 h-8 text-beacon" />
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">{title ?? t("comingSoon.title")}</h1>
      <p className="text-lg text-text-2 mb-8">{description ?? t("comingSoon.description")}</p>

      {children && <div className="mb-8">{children}</div>}

      <Button asChild variant="outline" className="border-line-strong mb-8">
        <Link href={backHref}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel ?? t("comingSoon.backHome")}
        </Link>
      </Button>

      <div className="inline-flex items-center gap-2">
        <div className="bg-gradient-to-br bg-ink text-white p-2 rounded-xl">
          <div className="w-6 h-6 flex items-center justify-center font-bold text-sm">
            HC
          </div>
        </div>
        <span className="text-sm text-text-3">Highland Cargo &copy; {new Date().getFullYear()}</span>
      </div>
    </motion.div>
  </div>
  );
};

export default ComingSoon;
