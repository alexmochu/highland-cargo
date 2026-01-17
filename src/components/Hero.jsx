"use client"
import { Button } from "@/components/ui/button";
import { Truck, Ship, Plane, MapPin } from "lucide-react";
// import { useTranslation } from 'next-i18next';

export const Hero = () => {
  // const { t } = useTranslation();
  return (
    <section
      className="relative text-foreground py-28 bg-cover bg-center overflow-hidden flex items-center min-h-[600px]"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-100/40 via-blue-900/70 to-blue-800/80 blur-[1px]"></div>
      <div className="absolute inset-0 bg-blue-900/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="opacity-99 animate-fade-in-up [animation-fill-mode:forwards]">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-sm animate-pulse text-white">
              {/* <Trans i18nKey="hero_title" components={{
                1: <span className="text-orange-300 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent" />,
                2: <span className="text-orange-400" />
              }} /> */}
              <p className="text-4xl font-bold">
                {'Move' + ' '}
                <span className="text-orange-200 bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
                  {'Anything '}
                </span>{' '}
                <br />
                {'Anywhere, '}
                <span className="text-orange-200 bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
                  {'Fast'}
                </span>{' '}
              </p>
            </h1>
            <p className="text-xl mb-9 text-blue-50/90 font-light animate-fade-in-up [animation-delay:150ms]">
              {/* {t("hero_desc")} */}
              Trusted by 10,000+ businesses for international air, sea, and local shipping. Experience global connections and personal attention — with Highland Cargo.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg animate-scale-in">
                Request Quote
              </Button>
              <Button size="lg" variant="outline" className="border-white hover:bg-orange-500 hover:text-white text-blue-600 animate-scale-in [animation-delay:200ms]">
                Track Package
              </Button>
            </div> */}
          </div>
          <div className="relative opacity-99 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-orange-100 shadow-xl">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-white/20 rounded-xl p-4 transform transition-transform hover:scale-110 duration-500 hover:shadow-2xl cursor-pointer animate-pulse">
                  <Plane className="w-12 h-12 mx-auto mb-2 text-orange-400" />
                  <h3 className="font-semibold">Air Freight</h3>
                </div>
                <div className="bg-white/20 rounded-xl p-4 transform transition-transform hover:scale-110 duration-500 hover:shadow-2xl cursor-pointer animate-pulse">
                  <Ship className="w-12 h-12 mx-auto mb-2 text-orange-400" />
                  <h3 className="font-semibold">Sea Freight</h3>
                </div>
                <div className="bg-white/20 rounded-xl p-4 transform transition-transform hover:scale-110 duration-500 hover:shadow-2xl cursor-pointer animate-pulse">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-orange-400" />
                  <h3 className="font-semibold">Warehouses</h3>
                </div>
                <div className="bg-white/20 rounded-xl p-4 transform transition-transform hover:scale-110 duration-500 hover:shadow-2xl cursor-pointer animate-pulse">
                  <Truck className="w-12 h-12 mx-auto mb-2 text-orange-400" />
                  <h3 className="font-semibold">Local Delivery</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bouncy Down Arrow */}
        <div className="w-full flex justify-center mt-10">
          <div className="animate-bounce">
            <svg className="w-9 h-9 text-orange-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};