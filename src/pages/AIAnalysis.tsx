import { motion } from 'motion/react';
import { ChevronLeft, Zap, AlertCircle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router';

const issues = [
  { text: 'Lack of sleep', severity: 'high' },
  { text: 'Low protein intake', severity: 'medium' },
  { text: 'Missed workout', severity: 'low' },
];

const recommendations = [
  'Go to bed 30 minutes earlier tonight',
  'Add 25g protein to your lunch',
  'Schedule 20-min workout for tomorrow morning',
  'Drink 2 more glasses of water today',
];

export function AIAnalysis() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">AI Daily Analysis</h1>
          <p className="text-white/50 text-xs mt-1">Powered by LifeOS Intelligence</p>
        </div>
      </motion.div>

      {/* Energy Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/60 flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <p className="text-white/60 text-sm mb-1">Energy Score</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl tracking-tight">68</span>
              <span className="text-xl text-white/40 mb-1">/ 100</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detected Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="text-lg">Detected Issues</h2>
        </div>

        <div className="space-y-3">
          {issues.map((issue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="glass-card rounded-[16px] px-4 py-3 flex items-center gap-3"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  issue.severity === 'high'
                    ? 'bg-red-500'
                    : issue.severity === 'medium'
                    ? 'bg-[#F59E0B]'
                    : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm">{issue.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#4DA3FF]" />
          <h2 className="text-lg">Recommendations for Tomorrow</h2>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="glass-card rounded-[16px] px-4 py-3 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-[#4DA3FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#4DA3FF] text-xs">{index + 1}</span>
              </div>
              <span className="text-sm text-white/90">{rec}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
