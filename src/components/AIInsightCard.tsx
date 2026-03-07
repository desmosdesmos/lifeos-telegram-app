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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-[20px] p-5"
    >
      {Icon && (
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <h3 className="text-base font-medium">{title}</h3>
        </div>
      )}
      {!Icon && <h3 className="text-base font-medium mb-2">{title}</h3>}
      <p className="text-white/70 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
