import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-ink text-paper/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-beacon text-ink w-10 h-10 flex items-center justify-center font-display font-extrabold text-base">
                HC
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-paper leading-none">
                  HIGHLAND CARGO
                </h3>
                <p className="text-xs text-paper/50 font-manifest mt-1">
                  {t("header.tagline")}
                </p>
              </div>
            </div>
            <p className="text-paper/55 mb-6 leading-relaxed text-sm">
              {t("footer.description")}
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-9 h-9 border border-paper/20 flex items-center justify-center text-paper/60 hover:border-beacon hover:text-beacon transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-6 text-paper font-manifest tracking-wide">{t("footer.servicesTitle").toUpperCase()}</h4>
            <ul className="space-y-3">
              {t("footer.services").map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-paper/55 hover:text-beacon transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-6 text-paper font-manifest tracking-wide">{t("footer.supportTitle").toUpperCase()}</h4>
            <ul className="space-y-3">
              {t("footer.support").map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-paper/55 hover:text-beacon transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-6 text-paper font-manifest tracking-wide">{t("footer.contactTitle").toUpperCase()}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-beacon mt-0.5 flex-shrink-0" />
                <span className="text-paper/55 text-sm">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-beacon flex-shrink-0" />
                <span className="text-paper/55 text-sm">+254 746 888 942</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-beacon flex-shrink-0" />
                <span className="text-paper/55 text-sm">support@highlandcargoafrica.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-paper/15 mt-12 pt-8 text-center text-paper/40 text-sm font-manifest">
          <p>
            &copy; 2026 Highland Cargo. {t("footer.copyright")} | {t("footer.privacy")} | {t("footer.terms")}
          </p>
        </div>
      </div>
    </footer>
  );
};
