"use client";

import { Button } from "@/components/ui/button";
import { Globe, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export const About = () => {
  const stats = [
    { icon: Globe, value: "5+", label: "Countries Served", color: { bg: "bg-blue-50", text: "text-blue-600" } },
    { icon: Users, value: "1K+", label: "Happy Clients", color: { bg: "bg-emerald-50", text: "text-emerald-600" } },
    { icon: Award, value: "15+", label: "Years Experience", color: { bg: "bg-amber-50", text: "text-amber-600" } },
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-7 mt-10 lg:mt-0"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-200 w-4 h-4 rounded-full" />
              <span className="uppercase text-sm font-semibold tracking-wider text-slate-600">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
              Connecting Africa to the World
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Highland Cargo is a leading logistics and freight forwarding company with over <span className="font-bold text-amber-500">15 years</span> (since 2009) of experience in international trade.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              We connect Africa’s businesses to the world with smart solutions for air and sea freight, warehousing, and delivery. Join <span className="font-bold text-slate-800">1000+ clients</span> who trust us with their cargo journeys!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white shadow-lg">
                Learn More About Us
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full group"
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop" 
                alt="Our Team discussing logistics" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" 
              />
              <div className="absolute -bottom-8 -left-8 bg-slate-800 text-white p-8 rounded-3xl shadow-xl max-w-xs group-hover:scale-105 transition-transform duration-300">
                <p className="font-bold text-2xl mb-2">Over 15 Years</p>
                <p className="text-slate-300">Delivering excellence in logistics, globally.</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="bg-slate-50 rounded-3xl p-10 text-center shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className={`${stat.color.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                  <stat.icon className={`w-10 h-10 ${stat.color.text}`} />
                </div>
                <div className="text-5xl font-bold text-slate-800 mb-2">{stat.value}</div>
                <div className="text-lg text-slate-600 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
