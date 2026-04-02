import { type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface AIInsightCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  color?: string;
  delay?: number;
}

export function AIInsightCard({ title, description, icon: Icon, color = '#4DA3FF', delay = 0 }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="glass-card rounded-[24px] p-5 relative overflow-hidden group"
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      {/* Left accent border */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[24px]"
        style={{ 
          background: `linear-gradient(180deg, ${color}, ${color}00)`,
          boxShadow: `0 0 20px ${color}60`
        }}
      />
      
      <div className="relative z-10 pl-3">
        {Icon && (
          <motion.div 
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 }}
          >
            <motion.div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center backdrop-blur-xl"
              style={{ backgroundColor: `${color}20` }}
              whileHover={{ scale: 1.1, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
            </motion.div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
          </motion.div>
        )}
        {!Icon && <h3 className="text-base font-semibold mb-2 text-white">{title}</h3>}
        <motion.p 
          className="text-white/70 text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}
