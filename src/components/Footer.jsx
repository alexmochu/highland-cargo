import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-amber-500 to-amber-400 text-slate-900 p-2.5 rounded-xl shadow-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg tracking-tight">
                  HC
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Highland Cargo
                </h3>
                <p className="text-sm text-slate-400">
                  Global Logistics Solutions
                </p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Your trusted partner for international shipping and logistics solutions across the globe.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-900 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              {[
                "International Air Freight",
                "International Sea Freight", 
                "Overseas Warehouses",
                "Local Delivery",
                "Customs Clearance"
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {[
                "Track Package",
                "File a Claim",
                "Shipping Calculator", 
                "Documentation",
                "FAQ"
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-slate-400">+254 746 888 942</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-slate-400">support@highlandcargoafrica.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          <p>
            &copy; 2025 Highland Cargo. {t("copyright")} | {t("privacy")} | {t("terms")}
          </p>
        </div>
      </div>
    </footer>
  );
};
