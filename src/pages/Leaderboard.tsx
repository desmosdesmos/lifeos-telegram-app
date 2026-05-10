import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Medal, Star, Info, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

export function Leaderboard() {
  const navigate = useNavigate();
  const { state, updateProfile, lifeScore: myLifeScore } = useApp();
  const { user: authUser } = useAuth();

  // Формируем финальный список топа
  const displayUsers = useMemo(() => {
    const rawUsers = state.topUsers || [];
    const uid = authUser?.uid;
    
    // Если мы уже есть в списке (по UID), помечаем как isMe
    let users = rawUsers.map(u => ({
      ...u,
      isMe: uid ? u.id === uid : false
    }));

    // Если мы участвуем в топе, но нас нет в списке (например, не попали в топ-100 или еще не обновилось)
    const alreadyInList = users.some(u => u.isMe);
    
    if (state.profile.showInLeaderboard && !alreadyInList) {
      users.push({
        id: 'me-local',
        name: state.profile.name || 'Вы',
        score: myLifeScore,
        avatarUrl: state.profile.avatarUrl,
        isMe: true
      });
    }
    
    return users.sort((a, b) => b.score - a.score);
  }, [state.topUsers, state.profile.showInLeaderboard, state.profile.name, state.profile.avatarUrl, myLifeScore, authUser]);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-16 pb-12 safe-area-top">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Топ пользователей</h1>
        </div>
        <p className="text-white/40 text-sm">Сравните свою эффективность с другими участниками LifeOS</p>
      </motion.div>

      {/* Participation Toggle */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-5 rounded-[24px] mb-8 border transition-all duration-300 ${
          state.profile.showInLeaderboard 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-white/[0.03] border-white/10'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              state.profile.showInLeaderboard ? 'bg-green-500/20' : 'bg-white/10'
            }`}>
              {state.profile.showInLeaderboard ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <ShieldAlert className="w-5 h-5 text-white/40" />}
            </div>
            <div>
              <h3 className="text-sm font-bold">{state.profile.showInLeaderboard ? 'Вы в списке' : 'Вы скрыты'}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Настройки приватности</p>
            </div>
          </div>
          <button 
            onClick={() => updateProfile({ showInLeaderboard: !state.profile.showInLeaderboard })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              state.profile.showInLeaderboard 
                ? 'bg-red-500/20 text-red-500' 
                : 'bg-primary text-white'
            }`}
          >
            {state.profile.showInLeaderboard ? 'Выйти из топа' : 'Участвовать'}
          </button>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">
          Участие в топе позволяет другим пользователям видеть ваш Life Score и имя. Мы не передаем ваши детальные данные (вес, финансы, тренировки).
        </p>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {displayUsers.map((user, index) => {
          const isMe = user.isMe;
          const isTop3 = index < 3;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-[20px] flex items-center gap-4 transition-all ${
                isMe 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-white/[0.02] border border-white/5'
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center shrink-0">
                {index === 0 ? <Trophy className="w-6 h-6 text-yellow-500" /> :
                 index === 1 ? <Medal className="w-6 h-6 text-slate-300" /> :
                 index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                 <span className="text-sm font-bold text-white/20">#{index + 1}</span>}
              </div>

              {/* Avatar */}
              <div className="relative">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    isMe ? 'bg-primary text-white' : 'bg-white/10 text-white/40'
                  }`}>
                    {user.name[0]}
                  </div>
                )}
                {isMe && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-[#0B0B0F] flex items-center justify-center">
                    <Star className="w-2 h-2 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate ${isMe ? 'text-primary' : 'text-white/90'}`}>
                  {user.name} {isMe && '(Вы)'}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isMe ? 'bg-primary' : isTop3 ? 'bg-yellow-500/50' : 'bg-white/20'}`} 
                      style={{ width: `${user.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">{user.score} pt</span>
                </div>
              </div>

              {/* Score Badge */}
              <div className={`px-3 py-1.5 rounded-xl flex items-baseline gap-0.5 ${
                isMe ? 'bg-primary/20' : 'bg-white/5'
              }`}>
                <span className="text-sm font-bold text-white">{user.score}</span>
                <span className="text-[10px] text-white/30">/100</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-5 glass-card rounded-[24px] flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white/80 mb-1">Как рассчитывается рейтинг?</h4>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Ваш рейтинг (Life Score) зависит от выполнения целей, качества сна, активности в тренировках и баланса финансов. Обновление происходит в реальном времени.
          </p>
        </div>
      </div>
    </div>
  );
}
