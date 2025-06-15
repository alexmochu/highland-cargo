import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Truck, Package, FileText, Phone, CreditCard } from "lucide-react";

export const Support = () => {
  const supportItems = [
    {
      icon: Search,
      title: "Tracking Support",
      description: "How to track your package?",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Truck,
      title: "Shipping Support",
      description: "Which transportation modes are supported?",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Package,
      title: "Packing and Suppliers Support",
      description: "Packing and Suppliers Support",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: FileText,
      title: "File a Claim",
      description: "How to claim for loss or damage?",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Phone,
      title: "Contact Us",
      description: "How to contact us?",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: CreditCard,
      title: "Importer Code",
      description: "How to apply for an import code?",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    <section id="support" className="py-20 bg-gradient-to-r from-blue-50 via-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Need Help?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in [animation-delay:200ms]">
            Find answers to common questions and get the support you need for your shipping requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {supportItems.map((item, index) => (
            <Card key={index} className="hover:shadow-2xl transition-all duration-400 hover:-translate-y-3 animate-fade-in-up">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${item.color} transition-transform duration-300 hover:scale-110 shadow-xl`}>
                  <item.icon className="w-8 h-8 animate-bounce hover:animate-pulse" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="bg-blue-600 hover:bg-blue-700 animate-fade-in">
                  Click to Know More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center hover:scale-105 transition-transform duration-300 shadow-xl">
          <h3 className="text-2xl font-bold mb-4">VAT & DUTY FEES FAQs</h3>
          <p className="text-lg mb-6">
            Understanding import duties, VAT calculations, and customs procedures for your international shipments.
          </p>
          <Button variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-orange-500">
            View FAQs
          </Button>
        </div>
      </div>
    </section>
  );
};
