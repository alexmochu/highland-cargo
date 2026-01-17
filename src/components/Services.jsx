import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Ship, Warehouse, Truck } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Plane,
      title: "International Air Freight",
      description: "Fast and reliable air cargo services worldwide. Express delivery for time-sensitive shipments.",
      features: ["Express delivery", "Real-time tracking", "Global coverage", "Customs clearance"]
    },
    {
      icon: Ship,
      title: "International Sea Freight",
      description: "Cost-effective ocean freight solutions for large shipments. Full container and LCL options.",
      features: ["FCL & LCL options", "Port-to-port service", "Competitive rates", "Documentation support"]
    },
    {
      icon: Warehouse,
      title: "Overseas Warehouses",
      description: "Strategic warehousing locations in China, Dubai, and UK for efficient distribution.",
      features: ["China warehouse", "Dubai warehouse", "UK warehouse", "Inventory management"]
    },
    {
      icon: Truck,
      title: "Local Delivery",
      description: "Comprehensive delivery network across Kenya, Uganda, Tanzania, and East Africa.",
      features: ["Kenya coverage", "Uganda delivery", "Tanzania service", "East Africa network"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-background via-blue-50/50 to-orange-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">What We Offer</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in [animation-delay:200ms]">
            Comprehensive logistics solutions tailored to your business needs.
            From air freight to local delivery, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group animate-fade-in-up [animation-delay:300ms] border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="bg-blue-100/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg hover:bg-orange-100/50">
                  <service.icon className="w-8 h-8 text-blue-600 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-orange-500/80 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full animate-pulse group-hover:bg-orange-500" variant="outline">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};