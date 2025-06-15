
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    if (email.length > 5 && email.includes('@')) setSubmitted(true);
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-tr from-blue-100 via-orange-50 to-orange-200 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto shadow-md flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2">
            <Mail className="text-orange-500 w-7 h-7 animate-bounce" />
            <span className="text-xl font-bold text-gray-900">Newsletter</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 text-center">Get trade tips & exclusive offers</h3>
          <form onSubmit={onSubmit} className="flex w-full max-w-md gap-3">
            <input 
              className="flex-1 px-4 py-3 rounded-l-lg bg-white border border-orange-300 placeholder-gray-400 focus:outline-none"
              disabled={submitted}
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-orange-500 rounded-r-lg" disabled={submitted}>
              {submitted ? "Subscribed!" : "Sign Up"}
            </Button>
          </form>
          {submitted && <p className="text-green-500 font-medium animate-fade-in">Thank you! Check your inbox soon.</p>}
        </div>
      </div>
    </section>
  );
}
