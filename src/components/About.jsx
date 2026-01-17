import { Button } from "@/components/ui/button";
import { Globe, Users, Award, Clock } from "lucide-react";

export const About = () => {
  const stats = [
    { icon: Globe, value: "5+", label: "Countries Served" },
    { icon: Users, value: "1K+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    // { icon: Clock, value: "99.9%", label: "On-Time Delivery" }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-r from-orange-50/30 via-background to-blue-50/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-center mb-20 animate-fade-in-up">
          <div className="space-y-7 mt-10 lg:mt-0">
            <div className="flex items-center gap-3">
              <div className="bg-orange-400/80 w-4 h-4 rounded-full animate-pulse" />
              <span className="uppercase text-sm font-semibold tracking-wider text-orange-400/90">About Us</span>
            </div>
            <h2 className="text-4xl font-extrabold text-blue-900/90 mb-4 leading-tight">
              Who We Are
            </h2>
            <p className="text-lg text-foreground/80">
              Highland Cargo is a leading logistics and freight forwarding company with over <span className="font-bold text-orange-500">15 years</span> (since 2009) of experience in international trade.
            </p>
            <p className="text-lg text-muted-foreground">
              We connect Africa’s businesses to the world with smart solutions for air and sea freight, warehousing, and delivery. Join <span className="font-bold text-blue-600">1000+ clients</span> who trust us with their cargo journeys!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg animate-pulse">
                Learn More About Us
              </Button>
              {/* <Button variant="outline" className="font-semibold">
                View Our Certifications
              </Button> */}
            </div>
          </div>
          <div className="relative w-full h-full group">
            <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop" alt="Our Team discussing logistics" className="rounded-2xl shadow-2xl w-full h-full object-cover transform group-hover:scale-105 duration-500" />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl max-w-xs animate-fade-in-up group-hover:scale-110 duration-300">
              <p className="font-bold text-lg mb-1">Over 15 Years of Experience</p>
              <p className="text-sm text-blue-200">Delivering excellence in logistics, globally.</p>
            </div>
            {/* Parallax floating shapes */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-orange-300 opacity-30 rounded-full blur-2xl animate-bounce-slow" />
            <div className="absolute bottom-10 right-10 w-6 h-6 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse-slow" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 text-center shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group border border-border/50">
              <div className="bg-orange-100/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 text-orange-600 group-hover:animate-bounce" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-md text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
