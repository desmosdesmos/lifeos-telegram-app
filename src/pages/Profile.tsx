import { motion } from 'motion/react';
import { ChevronLeft, User, Ruler, Weight, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

const profileData = [
  { label: 'Weight', value: '75 kg', icon: Weight, color: '#4DA3FF' },
  { label: 'Height', value: '180 cm', icon: Ruler, color: '#22C55E' },
  { label: 'Goal', value: 'Build muscle', icon: Target, color: '#F59E0B' },
  { label: 'Lifestyle', value: 'Active', icon: Zap, color: '#4DA3FF' },
];

export function Profile() {
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
        <h1 className="text-3xl">Profile</h1>
      </motion.div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl mb-1">Alex Johnson</h2>
            <p className="text-white/60 text-sm">Member since March 2026</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Info */}
      <div className="space-y-3 mb-6">
        <p className="text-white/60 text-sm px-1">Personal Information</p>

        {profileData.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card rounded-[20px] p-5 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: item.color }} />
              </div>

              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">{item.label}</p>
                <p className="text-lg">{item.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full glass-card rounded-[20px] p-5 text-center active:scale-95 transition-transform"
      >
        <span className="text-[#4DA3FF]">Edit Profile</span>
      </motion.button>
    </div>
  );
}
