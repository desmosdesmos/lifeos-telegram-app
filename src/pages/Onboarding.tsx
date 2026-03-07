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
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">LifeOS</span>
          </div>
          <button
            onClick={onComplete}
            className="text-white/40 text-sm hover:text-white/70 transition-colors"
          >
            Пропустить
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-[20px] p-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#22C55E]" />
                    </div>
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
            transition={{ delay: 0.8 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-[20px] text-white font-bold text-lg flex items-center justify-center gap-2"
          >
            Начать использовать
            <ChevronRight className="w-5 h-5" />
          </motion.button>
          <p className="text-center text-white/40 text-xs mt-4">
            Настройте профиль после завершения
          </p>
        </div>
      </div>
    </div>
  );
}
