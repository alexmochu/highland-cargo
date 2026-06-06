import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Ship, Warehouse, Truck } from "lucide-react";
import { motion } from "framer-motion";

export const Services = () => {
  const services = [
    {
      icon: Plane,
      title: "International Air Freight",
      description: "Fast and reliable air cargo services worldwide. Express delivery for time-sensitive shipments.",
      features: ["Express delivery", "Real-time tracking", "Global coverage", "Customs clearance"],
      color: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" }
    },
    {
      icon: Ship,
      title: "International Sea Freight",
      description: "Cost-effective ocean freight solutions for large shipments. Full container and LCL options.",
      features: ["FCL & LCL options", "Port-to-port service", "Competitive rates", "Documentation support"],
      color: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" }
    },
    {
      icon: Warehouse,
      title: "Overseas Warehouses",
      description: "Strategic warehousing locations in China, Dubai, and UK for efficient distribution.",
      features: ["China warehouse", "Dubai warehouse", "UK warehouse", "Inventory management"],
      color: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" }
    },
    {
      icon: Truck,
      title: "Local Delivery",
      description: "Comprehensive delivery network across Kenya, Uganda, Tanzania, and East Africa.",
      features: ["Kenya coverage", "Uganda delivery", "Tanzania service", "East Africa network"],
      color: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" }
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
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
            <span className="text-sm font-semibold text-slate-700">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Comprehensive Logistics Solutions</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From air freight to local delivery, we've got you covered with tailored solutions for your business needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className={`border-2 ${service.color.border} bg-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="text-center pb-4">
                  <div className={`${service.color.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                    <service.icon className={`w-10 h-10 ${service.color.text}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-slate-600 mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <div className={`w-2 h-2 ${service.color.text} rounded-full mr-3 opacity-70`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};