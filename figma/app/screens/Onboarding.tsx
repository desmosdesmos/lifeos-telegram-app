import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated gradient blur elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 bg-[#4DA3FF]/20 rounded-full blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-40 right-10 w-48 h-48 bg-[#22C55E]/10 rounded-full blur-[100px]"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 w-28 h-28 rounded-[28px] glass-card flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/20 to-[#22C55E]/20" />
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center relative z-10">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-6xl mb-3 tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent"
        >
          LifeOS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/50 text-lg mb-16 max-w-[300px] leading-relaxed"
        >
          AI system for optimizing your life
        </motion.p>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={() => navigate("/app")}
          className="w-full max-w-[300px] h-16 rounded-[20px] bg-gradient-to-r from-[#4DA3FF] to-[#4DA3FF]/80 text-white text-lg hover:from-[#4DA3FF]/90 hover:to-[#4DA3FF]/70 transition-all shadow-xl shadow-[#4DA3FF]/25 active:scale-95 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <span className="relative z-10">Start</span>
        </motion.button>

        {/* Version info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-white/30 text-xs mt-8"
        >
          Powered by AI · v1.0
        </motion.p>
      </motion.div>
    </div>
  );
}