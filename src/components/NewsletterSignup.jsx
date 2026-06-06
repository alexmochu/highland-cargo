"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    if (email.length > 5 && email.includes('@')) setSubmitted(true);
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-tr from-slate-100 via-amber-50 to-slate-100 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto shadow-xl flex flex-col items-center space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Mail className="text-amber-600 w-8 h-8" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Newsletter</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 text-center">Get trade tips & exclusive offers</h3>
          <form onSubmit={onSubmit} className="flex w-full max-w-md gap-3 flex-col sm:flex-row">
            <Input 
              className="flex-1 h-12 border-slate-300 focus:border-amber-500"
              disabled={submitted}
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white h-12 px-8" disabled={submitted}>
              {submitted ? "Subscribed!" : "Sign Up"}
            </Button>
          </form>
          {submitted && <p className="text-emerald-600 font-medium">Thank you! Check your inbox soon.</p>}
        </motion.div>
      </div>
    </section>
  );
}
