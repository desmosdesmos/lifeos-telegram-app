import { motion } from 'motion/react';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

const initialMessages: Message[] = [
  {
    type: 'ai',
    text: "Hi! I'm your LifeOS AI assistant. I can help you understand your health data and give you personalized recommendations. How can I help you today?",
  },
];

export function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: "Based on your sleep data, you only got 7h 10m of sleep last night, which is below your target of 8 hours. Combined with low protein intake (75g vs 120g target), your body isn't getting enough rest and nutrition for optimal recovery. Try going to bed 30 minutes earlier tonight and adding a protein-rich snack.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-4 flex items-center gap-3 border-b border-white/5"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl">AI Assistant</h1>
            <p className="text-white/50 text-xs">Always here to help</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-[20px] px-5 py-3 ${
                message.type === 'user'
                  ? 'bg-[#4DA3FF] text-white'
                  : 'glass-card'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </motion.div>
        ))}

        {/* Example question */}
        {messages.length === 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              setMessages([
                ...messages,
                { type: 'user', text: 'Why do I feel tired today?' },
              ]);
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    type: 'ai',
                    text: "Based on your sleep data, you only got 7h 10m of sleep last night, which is below your target of 8 hours. Combined with low protein intake (75g vs 120g target), your body isn't getting enough rest and nutrition for optimal recovery. Try going to bed 30 minutes earlier tonight and adding a protein-rich snack.",
                  },
                ]);
              }, 1000);
            }}
            className="glass-card rounded-[16px] px-4 py-3 text-sm text-white/70 hover:text-white transition-colors"
          >
            Why do I feel tired today?
          </motion.button>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-28 pt-4">
        <div className="glass-card rounded-[20px] p-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
