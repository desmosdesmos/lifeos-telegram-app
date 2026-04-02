import { motion } from 'motion/react';
import { ChevronRight, Check, User, Apple, Moon, Dumbbell, DollarSign, Target, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Добро пожаловать в LifeOS',
    description: 'Ваш персональный AI-помощник для улучшения всех сфер жизни',
    icon: Sparkles,
    color: '#4DA3FF',
  },
  {
    title: 'Заполните профиль',
    description: 'Укажите ваши данные: возраст, вес, рост и цели. Это поможет AI давать персональные рекомендации',
    icon: User,
    color: '#22C55E',
  },
  {
    title: 'Отслеживайте питание',
    description: 'Добавляйте приёмы пищи, сканируйте продукты, следите за макронутриентами',
    icon: Apple,
    color: '#EF4444',
  },
  {
    title: 'Контролируйте сон',
    description: 'Записывайте время отхода ко сну и пробуждения, получайте рекомендации по улучшению',
    icon: Moon,
    color: '#F59E0B',
  },
  {
    title: 'Занимайтесь фитнесом',
    description: 'Планируйте тренировки, отслеживайте прогресс, получайте AI-советы',
    icon: Dumbbell,
    color: '#4DA3FF',
  },
  {
    title: 'Управляйте финансами',
    description: 'Ведите учёт доходов и расходов, ставьте финансовые цели',
    icon: DollarSign,
    color: '#22C55E',
  },
  {
    title: 'Ставьте цели',
    description: 'Создавайте цели в разных сферах жизни, отслеживайте прогресс',
    icon: Target,
    color: '#F59E0B',
  },
  {
    title: 'Получайте AI-анализ',
    description: 'AI проанализирует все данные и даст рекомендации по улучшению',
    icon: Sparkles,
    color: '#4DA3FF',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0F] overflow-y-auto">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="gradient-orb gradient-orb-1" style={{ top: '10%', left: '-10%', width: '300px', height: '300px' }} />
        <div className="gradient-orb gradient-orb-2" style={{ bottom: '20%', right: '-5%', width: '250px', height: '250px' }} />
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <motion.div 
          className="p-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center glow-blue"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">LifeOS</span>
          </motion.div>
          <motion.button
            onClick={onComplete}
            className="text-white/40 text-sm hover:text-white/70 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Пропустить
          </motion.button>
        </motion.div>

        {/* Steps */}
        <div className="flex-1 px-6 py-4">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className="glass-card rounded-[24px] p-5 relative overflow-hidden group"
                >
                  {/* Hover gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${step.color}20, transparent 70%)`
                    }}
                  />
                  
                  {/* Animated orb */}
                  <motion.div 
                    className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundColor: step.color }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-[18px] flex items-center justify-center flex-shrink-0 backdrop-blur-xl"
                      style={{ backgroundColor: `${step.color}20` }}
                      whileHover={{ scale: 1.1, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon className="w-7 h-7" style={{ color: step.color }} strokeWidth={2.5} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 text-white">{step.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                    </div>
                    <motion.div 
                      className="w-9 h-9 rounded-full bg-[#22C55E]/20 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.08, type: 'spring' }}
                    >
                      <Check className="w-5 h-5 text-[#22C55E]" strokeWidth={3} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sticky bottom-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F] to-transparent pt-12">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-[24px] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Начать использовать
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
          <motion.p 
            className="text-center text-white/40 text-xs mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Настройте профиль после завершения
          </motion.p>
        </div>
      </div>
    </div>
  );
}
