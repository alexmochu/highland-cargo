"use client";

import { motion } from "framer-motion";

const ComingSoon = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-white p-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-4">Coming Soon</h1>
        <p className="text-xl text-slate-600 mb-8">
          This page or feature is under construction. Check back soon!
        </p>
        <div className="inline-flex items-center gap-2">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white p-2 rounded-xl">
            <div className="w-6 h-6 flex items-center justify-center font-bold text-sm">
              HC
            </div>
          </div>
          <span className="text-sm text-slate-500">Highland Cargo &copy; {new Date().getFullYear()}</span>
        </div>
      </motion.div>
    </div>
  );
  
  export default ComingSoon;
  