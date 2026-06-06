import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Office",
      info: "Eastgate Rd. Mombasa Road<br />Nairobi, Kenya<br />P.O. Box 12345-00100",
      color: { bg: "bg-blue-50", text: "text-blue-600" }
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+254 746 888 942<br />+254 707 126 666",
      color: { bg: "bg-emerald-50", text: "text-emerald-600" }
    },
    {
      icon: Mail,
      title: "Email Us",
      info: "support@highlandcargoafrica.com",
      color: { bg: "bg-amber-50", text: "text-amber-600" }
    }
  ];

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-slate-600 rounded-full" />
            <span className="text-sm font-semibold text-slate-700">Get in Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Contact Us</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ready to ship with us? Get in touch for a personalized quote or any inquiries about our services.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="text-center">
                  <div className={`${item.color.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                    <item.icon className={`w-8 h-8 ${item.color.text}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-bold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600" dangerouslySetInnerHTML={{ __html: item.info }} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 font-bold">Request a Quote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Input placeholder="First Name" className="border-slate-200 focus:border-slate-400 h-12" />
                  <Input placeholder="Last Name" className="border-slate-200 focus:border-slate-400 h-12" />
                </div>
                <Input placeholder="Email Address" className="border-slate-200 focus:border-slate-400 h-12" />
                <Input placeholder="Phone Number" className="border-slate-200 focus:border-slate-400 h-12" />
                <Input placeholder="Service Type" className="border-slate-200 focus:border-slate-400 h-12" />
                <Textarea placeholder="Describe your shipping requirements..." className="min-h-32 border-slate-200 focus:border-slate-400" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-slate-800 font-bold">
                  <Clock className="w-6 h-6 text-amber-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Monday - Friday:</span>
                    <span className="text-slate-800 font-semibold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Saturday:</span>
                    <span className="text-slate-800 font-semibold">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600 font-medium">Sunday:</span>
                    <span className="text-slate-800 font-semibold">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 font-bold">Ship with Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  Ready to start shipping? Create an account and get access to our online shipping platform.
                </p>
                <div className="space-y-4">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white h-12 text-lg">
                    Create Account
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 h-12 text-lg">
                    Track Existing Shipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
