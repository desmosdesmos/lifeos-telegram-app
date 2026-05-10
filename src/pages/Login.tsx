import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, User, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { setLocalMode } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState<'options' | 'email-login' | 'email-signup'>('options');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError('Не удалось войти через Google. Используйте вход через почту.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return;
    try {
      setIsLoggingIn(true);
      setError(null);
      if (mode === 'email-login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      setError(err.message.includes('auth/user-not-found') ? 'Пользователь не найден' : 
              err.message.includes('auth/wrong-password') ? 'Неверный пароль' :
              err.message.includes('auth/email-already-in-use') ? 'Email уже занят' :
              'Ошибка авторизации. Проверьте данные.');
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
        
        <AnimatePresence mode="wait">
          {mode === 'options' ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
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
                  onClick={() => setMode('email-login')}
                  className="w-full py-4 glass-card rounded-2xl text-white font-bold flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Через почту
                </button>

                <button 
                  onClick={() => setLocalMode()}
                  className="w-full py-4 rounded-2xl text-white/40 text-sm font-medium hover:text-white/60 transition-colors"
                >
                  Использовать без аккаунта
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-left"
            >
              <button 
                onClick={() => { setMode('options'); setError(null); }}
                className="flex items-center gap-2 text-white/40 mb-6 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>

              <h2 className="text-xl font-bold mb-4">
                {mode === 'email-login' ? 'Вход по почте' : 'Регистрация'}
              </h2>

              {mode === 'email-signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50"
                />
              </div>

              <button 
                onClick={handleEmailAuth}
                disabled={isLoggingIn}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? '...' : mode === 'email-login' ? 'Войти' : 'Создать аккаунт'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center pt-2">
                <button 
                  onClick={() => setMode(mode === 'email-login' ? 'email-signup' : 'email-login')}
                  className="text-white/40 text-sm"
                >
                  {mode === 'email-login' ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
