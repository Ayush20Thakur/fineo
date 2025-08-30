import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type Sender = 'user' | 'bot';

type Message = {
  id: string;
  text: string;
  sender: Sender;
  type?: 'text' | 'navigation' | 'forecast';
  payload?: any;
};

const ROUTE_MAP: Record<string, string> = {
  home: '/',
  dashboard: '/dashboard',
  personal: '/personal',
  portfolio: '/portfolio',
  insights: '/insights',
  loans: '/loans',
  'financial analysis': '/financial-analysis',
  settings: '/settings',
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  press: '/press',
  recommendations: '/recommendations',
};

const helpText = "Try: 'go to dashboard', 'back', 'home', or 'forecast 2025'.";

const generateForecast = (year: number) => {
  const seed = year % 97;
  const rnd = (n: number) => ((Math.sin(seed + n) + 1) / 2);
  return {
    year,
    projectedPortfolioGrowthPct: Math.round((5 + rnd(1) * 12) * 10) / 10,
    projectedNetWorthChange: Math.round(5000 + rnd(2) * 25000),
    projectedSavings: Math.round(3000 + rnd(3) * 12000),
    riskLevel: rnd(4) < 0.33 ? 'low' : rnd(4) < 0.66 ? 'medium' : 'high',
  };
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 'w1', text: "Hi, I'm Nova. " + helpText, sender: 'bot', type: 'text' }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const listEndRef = React.useRef<HTMLDivElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const historyRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    if (historyRef.current[historyRef.current.length - 1] !== location.pathname) {
      historyRef.current.push(location.pathname);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  const addBotMessage = (text: string, type: Message['type'] = 'text', payload?: any) => {
    setMessages((prev) => [...prev, { id: String(Date.now()), text, sender: 'bot', type, payload }]);
  };

  const goBack = () => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const prev = historyRef.current.pop();
      if (prev) navigate(prev);
    } else {
      navigate('/');
    }
  };

  const handleCommand = (raw: string) => {
    const text = raw.toLowerCase().trim();

    if (text === 'help' || /what can you do|how.*work/.test(text)) {
      addBotMessage(helpText);
      return;
    }

    if (text === 'home' || /\b(go to|navigate to|open|take me to)\s+home\b/.test(text)) {
      addBotMessage('Taking you home...', 'navigation');
      setTimeout(() => navigate('/'), 300);
      return;
    }

    if (text === 'back') {
      addBotMessage('Going back...', 'navigation');
      setTimeout(goBack, 300);
      return;
    }

    const forecastMatch = text.match(/forecast(\s*(for)?\s*(20\d{2}))?/);
    if (forecastMatch) {
      const yearMatch = text.match(/(20\d{2})/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      const f = generateForecast(year);
      addBotMessage(`Yearly outlook for ${f.year}\n- Growth: ${f.projectedPortfolioGrowthPct}%\n- Net worth: $${f.projectedNetWorthChange.toLocaleString()}\n- Savings: $${f.projectedSavings.toLocaleString()}\n- Risk: ${f.riskLevel}`, 'forecast', f);
      return;
    }

    const navIntent = text.match(/\b(go to|navigate to|open|take me to|visit|show me)\b\s+([a-z ]+)/);
    const target = navIntent ? navIntent[2].trim() : text;
    const key = Object.keys(ROUTE_MAP).find(k => target.includes(k));
    if (key) {
      addBotMessage(`Opening ${key}...`, 'navigation');
      setTimeout(() => navigate(ROUTE_MAP[key]), 300);
      return;
    }

    addBotMessage("I didn't get that. " + helpText);
  };

  const send = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: String(Date.now()), text: input, sender: 'user', type: 'text' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      handleCommand(userMsg.text);
      setIsTyping(false);
    }, 400);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') send();
  };

  const quickNavigate = (key: string) => {
    if (key === 'back') {
      addBotMessage('Going back...', 'navigation');
      setTimeout(goBack, 300);
      return;
    }
    if (key === 'home') {
      addBotMessage('Taking you home...', 'navigation');
      setTimeout(() => navigate('/'), 300);
      return;
    }
    if (key === 'forecast') {
      const year = new Date().getFullYear();
      const f = generateForecast(year);
      addBotMessage(`Yearly outlook for ${f.year}\n- Growth: ${f.projectedPortfolioGrowthPct}%\n- Net worth: $${f.projectedNetWorthChange.toLocaleString()}\n- Savings: $${f.projectedSavings.toLocaleString()}\n- Risk: ${f.riskLevel}`, 'forecast', f);
      return;
    }
    const path = ROUTE_MAP[key as keyof typeof ROUTE_MAP];
    if (path) {
      addBotMessage(`Opening ${key}...`, 'navigation');
      setTimeout(() => navigate(path), 300);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-50 grid place-items-center text-xl"
        aria-label="Open chat"
      >
        {isOpen ? '✖' : '💬'}
      </button>

      {isOpen && (
        <div ref={chatRef} className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 max-h-[80vh]">
        <Card className="h-full shadow-lg border border-gray-200 bg-white rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-gray-700" />
                Nova Helper
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-4 pt-2">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-700" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-md px-3 py-2 border ${m.sender === 'user' ? 'bg-white border-blue-100' : 'bg-white border-gray-200'}`}>
                        <p className="text-sm whitespace-pre-line text-gray-900">{m.text}</p>
                                  </div>
                      {m.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-800/5 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-700" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-md px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                  <div ref={listEndRef} />
              </div>
            </ScrollArea>
            
            <div className="border-t p-3 bg-white">
                                 <div className="flex flex-wrap gap-2 mb-3">
                   {['dashboard','portfolio','insights','loans','financial analysis','settings','personal','recommendations','about','contact','careers','press','home','back','forecast'].map((key) => (
                     <Button key={key} variant="outline" size="sm" className="text-xs" onClick={() => quickNavigate(key)}>
                       {key.charAt(0).toUpperCase() + key.slice(1)}
                 </Button>
                   ))}
              </div>
              <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="e.g. 'go to dashboard' or 'forecast 2025'"
                  className="flex-1"
                />
                  <Button onClick={send} disabled={!input.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}
    </>
  );
};

export default Chatbot;