import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

interface CustomSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between active:scale-[0.98] transition-all"
      >
        <div className="text-left">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-sm font-bold text-white">{value}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-[201] bg-[#121217] rounded-t-[32px] p-6 pb-12 max-h-[70vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold mb-6 px-2">{label}</h3>
              <div className="space-y-2">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-colors ${
                      value === option ? 'bg-primary/20 text-primary' : 'bg-white/[0.03] text-white/70'
                    }`}
                  >
                    <span className="font-bold">{option}</span>
                    {value === option && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
