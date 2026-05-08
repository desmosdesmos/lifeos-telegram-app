import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Login() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError('Не удалось войти через Google. Убедитесь, что у вас есть интернет.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090B] flex flex-col items-center justify-center px-8 text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-xl">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">LifeOS Cloud</h1>
        <p className="text-white/50 text-base mb-12 leading-relaxed">
          Авторизуйтесь, чтобы ваши данные были доступны на всех устройствах.
        </p>

        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {isLoggingIn ? 'Вход...' : 'Войти через Google'}
          </motion.button>

          <button 
            onClick={() => window.location.reload()} // Просто обновляем, чтобы попробовать еще раз
            className="w-full py-4 glass-card rounded-2xl text-white/40 text-sm font-medium hover:text-white/60 transition-colors"
          >
            Использовать без аккаунта (только локально)
          </button>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
          >
            {error}
          </motion.p>
        )}

        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
            Безопасная синхронизация через Google Firebase
          </p>
        </div>
      </motion.div>
    </div>
  );
}
