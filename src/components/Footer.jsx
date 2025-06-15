import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                  HC
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">{t("brand")}</h3>
                <p className="text-sm text-gray-400">{t("tagline")}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {t("footer_text")}
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">International Air Freight</a></li>
              <li><a href="#" className="hover:text-white">International Sea Freight</a></li>
              <li><a href="#" className="hover:text-white">Overseas Warehouses</a></li>
              <li><a href="#" className="hover:text-white">Local Delivery</a></li>
              <li><a href="#" className="hover:text-white">Customs Clearance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Track Package</a></li>
              <li><a href="#" className="hover:text-white">File a Claim</a></li>
              <li><a href="#" className="hover:text-white">Shipping Calculator</a></li>
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+254 700 123 456</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">info@highlandcargo.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 {t("brand")}. {t("copyright")} | {t("privacy")} | {t("terms")}
          </p>
        </div>
      </div>
    </footer>
  );
};
