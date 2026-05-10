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
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
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
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-[24px] p-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-0.5">{step.title}</h3>
                      <p className="text-white/50 text-xs leading-relaxed">{step.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-12">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full py-4 bg-primary rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Начать использовать
            <ChevronRight className="w-5 h-5" />
          </motion.button>
          <p className="text-center text-white/30 text-[10px] mt-4 font-medium uppercase tracking-wider">
            Оптимизация вашей эффективности
          </p>
        </div>
      </div>
    </div>
  );
}
