import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, KeyRound, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buses as demoBuses, routes as demoRoutes } from '../data/demoData';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am Tracer AI. I can help you track buses, check schedules, and more. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setHasKey(true);
      setApiKey(storedKey);
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setHasKey(true);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setHasKey(false);
    setApiKey('');
  };

  const getSystemContext = () => {
    const buses = demoBuses;
    const routes = demoRoutes;
    
    let context = `You are Tracer AI, a helpful, professional, and friendly customer support assistant for the Tracer Smart Bus Tracking platform in Rajasthan, India.\n\n`;
    context += `Here is the real-time data of our bus network. Use this information to answer user queries accurately. If a user asks about a bus, refer to this data.\n\n`;
    
    context += `AVAILABLE BUSES:\n`;
    buses.forEach(b => {
      context += `- Bus ${b.busNumber} (Route ID: ${b.routeId}, Status: ${b.isAvailable ? 'Available' : 'Unavailable'})\n`;
    });

    context += `\nROUTES & SCHEDULES:\n`;
    routes.forEach(r => {
      context += `Route: ${r.name} (${r.source} to ${r.destination})\n`;
      context += `Stops:\n`;
      r.stops.forEach(s => {
        context += `  - ${s.name} (Arrival: ${s.plannedArrival}, Departure: ${s.plannedDeparture})\n`;
      });
      context += '\n';
    });
    
    context += `Keep your answers concise, helpful, and beautifully formatted using markdown. Do not hallucinate buses or routes that are not in the list.`;
    return context;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: getSystemContext() });

      // Format previous messages for Gemini
      const history = messages.slice(1).map(m => ({ // Skip the first generic welcome message for history
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: `**Error:** I'm sorry, I couldn't process that request. Please check if your API key is valid. (${error.message})` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[500px] glass-panel rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden backdrop-blur-2xl bg-slate-900/90"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-blue-600/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Tracer AI</h3>
                  <p className="text-[10px] text-blue-300">Live Support Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasKey && (
                  <button onClick={clearKey} title="Clear API Key" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <KeyRound size={14} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!hasKey ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 mb-4">
                  <KeyRound size={32} />
                </div>
                <h4 className="text-white font-bold mb-2">Gemini API Required</h4>
                <p className="text-xs text-slate-400 mb-6">
                  To power this AI prototype, please provide your Google Gemini API Key. It will be stored securely in your browser's local storage.
                </p>
                <form onSubmit={handleSaveKey} className="w-full flex flex-col gap-3">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API Key..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-xl text-sm transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    Save Key & Start Chat
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-blue-600 text-white'}`}>
                        {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5 prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-sm max-w-none'}`}>
                        {msg.role === 'user' ? (
                          msg.text
                        ) : (
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                        <Bot size={12} />
                      </div>
                      <div className="px-4 py-3 bg-slate-800 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-1.5 text-slate-400">
                         <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                         <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                         <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-white/10 bg-slate-900/50 flex-shrink-0">
                  <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me about a bus..."
                      className="w-full bg-slate-800/80 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                      disabled={isLoading}
                    />
                    <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 w-8 h-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-[-1px] mt-[1px]" />}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] flex items-center justify-center border-2 border-slate-900 hover:bg-blue-500 transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
