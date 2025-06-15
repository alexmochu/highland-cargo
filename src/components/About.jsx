import { Button } from "@/components/ui/button";
import { Globe, Users, Award, Clock } from "lucide-react";

export const About = () => {
  const stats = [
    { icon: Globe, value: "50+", label: "Countries Served" },
    { icon: Users, value: "10K+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "99.9%", label: "On-Time Delivery" }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-r from-orange-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-center mb-20 animate-fade-in-up">
          <div className="space-y-7 mt-10 lg:mt-0">
            <div className="flex items-center gap-3">
              <div className="bg-orange-400 w-4 h-4 rounded-full animate-pulse" />
              <span className="uppercase text-sm font-semibold tracking-wider text-orange-400">About Us</span>
            </div>
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4 leading-tight">
              Who We Are
            </h2>
            <p className="text-lg text-gray-700">
              Highland Cargo is a leading logistics and freight forwarding company with over <span className="font-bold text-orange-500">15 years</span> of experience in international trade.
            </p>
            <p className="text-lg text-gray-600">
              We connect Africa’s businesses to the world with smart solutions for air and sea freight, warehousing, and delivery. Join <span className="font-bold text-blue-600">10,000+ clients</span> who trust us with their cargo journeys!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg animate-pulse">
                Learn More About Us
              </Button>
              <Button variant="outline" className="font-semibold">
                View Our Certifications
              </Button>
            </div>
          </div>
          <div className="relative w-full h-full group">
            <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop" alt="Our Team discussing logistics" className="rounded-2xl shadow-2xl w-full h-full object-cover transform group-hover:scale-105 duration-500"/>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl max-w-xs animate-fade-in-up group-hover:scale-110 duration-300">
              <p className="font-bold text-lg mb-1">Over 15 Years of Experience</p>
              <p className="text-sm text-blue-200">Delivering excellence in logistics, globally.</p>
            </div>
            {/* Parallax floating shapes */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-orange-300 opacity-30 rounded-full blur-2xl animate-bounce-slow" />
            <div className="absolute bottom-10 right-10 w-6 h-6 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse-slow" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-orange-600 group-hover:animate-bounce" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-md text-gray-600">{stat.label}</div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
