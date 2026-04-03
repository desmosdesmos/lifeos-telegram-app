import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Camera, MessageSquare, TrendingUp, Crown, Check } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const premiumFeatures = [
  {
    icon: Camera,
    title: 'AI анализ по фото',
    description: 'Сфотографируйте еду — AI автоматически определит КБЖУ и размер порции',
    color: '#22C55E',
  },
  {
    icon: MessageSquare,
    title: 'Персональные AI-консультанты',
    description: '5 экспертов: нутрициолог, врач сна, тренер, финансист, коуч',
    color: '#4DA3FF',
  },
  {
    icon: Sparkles,
    title: 'AI Ассистент',
    description: 'Умный помощник с доступом ко всем вашим данным LifeOS',
    color: '#F59E0B',
  },
  {
    icon: TrendingUp,
    title: 'Безлимитные AI-запросы',
    description: 'Бесплатно — 3 запроса в день. Подписка снимает ограничение',
    color: '#A855F7',
  },
];

export function PaywallModal() {
  const { paywallFeature, hidePaywall, activatePremium } = useSubscription();

  if (!paywallFeature) return null;

  const getTitle = () => {
    switch (paywallFeature) {
      case 'photo-analysis':
        return 'AI анализ по фото';
      case 'ai-chat':
        return 'AI Ассистент';
      case 'ai-consultant':
        return 'AI Консультант';
      case 'ai-limit':
        return 'Дневной лимит исчерпан';
      default:
        return 'LifeOS Premium';
    }
  };

  const getDescription = () => {
    switch (paywallFeature) {
      case 'ai-limit':
        return 'Вы использовали 3 бесплатных AI-запроса сегодня. Оформите подписку для безлимита.';
      default:
        return 'Эта функция доступна с подпиской LifeOS Premium';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm"
        onClick={hidePaywall}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#0B0B0F] rounded-t-[32px] overflow-hidden"
        >
          {/* Header gradient */}
          <div className="relative h-2 bg-gradient-to-r from-[#4DA3FF] via-[#A855F7] to-[#F59E0B]" />

          <div className="p-6 pb-8 max-h-[85vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={hidePaywall}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title section */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#4DA3FF]/20 to-[#A855F7]/20 flex items-center justify-center"
              >
                <Crown className="w-8 h-8 text-[#F59E0B]" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">{getTitle()}</h2>
              <p className="text-white/50 text-sm">{getDescription()}</p>
            </div>

            {/* Features list */}
            <div className="space-y-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white/5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{feature.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#4DA3FF]/10 to-[#A855F7]/10 border border-white/10 mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Подписка Premium</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">299₽</span>
                  <span className="text-white/40 text-sm">/мес</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Check className="w-3 h-3 text-[#22C55E]" />
                <span>Все AI-функции без ограничений</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={activatePremium}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4DA3FF] to-[#A855F7] text-white font-semibold text-base active:scale-[0.98] transition-transform"
            >
              Активировать Premium
            </motion.button>

            {/* Demo hint */}
            <p className="text-center text-white/30 text-xs mt-4">
              Демо: нажмите кнопку для активации бесплатной подписки
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
