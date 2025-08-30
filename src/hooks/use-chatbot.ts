import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  NavigationOption, 
  findBestNavigationMatch, 
  generateContextualSuggestions, 
  parseUserIntent, 
  generateHelpfulResponse,
  generateYearlyForecast
} from '@/lib/chatbot-utils';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'navigation' | 'suggestion' | 'forecast';
  payload?: any;
}

export const useChatbot = (navigationOptions: NavigationOption[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Nova. Ask me to navigate: 'Go to dashboard', 'Contact', 'Back', 'Home', or 'Forecast for 2025'.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<NavigationOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const historyStack = useRef<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Record navigation history
  useEffect(() => {
    if (historyStack.current.length === 0 || historyStack.current[historyStack.current.length - 1] !== location.pathname) {
      historyStack.current.push(location.pathname);
    }
  }, [location.pathname]);

  // Update suggestions when location changes
  useEffect(() => {
    const contextualSuggestions = generateContextualSuggestions(location.pathname, navigationOptions);
    setSuggestions(contextualSuggestions);
  }, [location.pathname, navigationOptions]);

  const generateSuggestions = (): NavigationOption[] => {
    return suggestions.length > 0 ? suggestions : navigationOptions.slice(0, 6);
  };

  const navigateTo = (path: string) => {
    setTimeout(() => navigate(path), 500);
  };

  const goHome = () => {
    setTimeout(() => navigate('/'), 300);
  };

  const goBack = () => {
    if (historyStack.current.length > 1) {
      // current page
      historyStack.current.pop();
      const prev = historyStack.current.pop();
      if (prev) navigate(prev);
    } else {
      navigate('/');
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const { intent, confidence, target, year } = parseUserIntent(text);

      if (intent === 'home') {
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: generateHelpfulResponse('home'), sender: 'bot', timestamp: new Date(), type: 'navigation' }]);
        goHome();
      } else if (intent === 'back') {
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: generateHelpfulResponse('back'), sender: 'bot', timestamp: new Date(), type: 'navigation' }]);
        goBack();
      } else if (intent === 'navigate' || intent === 'search') {
        const match = findBestNavigationMatch(target || text, navigationOptions);
        if (match) {
          setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: `I'll take you to ${match.name}!`, sender: 'bot', timestamp: new Date(), type: 'navigation' }]);
          navigateTo(match.path);
        } else {
          setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: "I couldn't find an exact match. Here are some suggestions:", sender: 'bot', timestamp: new Date(), type: 'suggestion' }]);
        }
      } else if (intent === 'help') {
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: generateHelpfulResponse('help'), sender: 'bot', timestamp: new Date(), type: 'suggestion' }]);
      } else if (intent === 'forecast') {
        const forecast = generateYearlyForecast(year || new Date().getFullYear());
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: `Yearly outlook for ${forecast.year}`, sender: 'bot', timestamp: new Date(), type: 'forecast', payload: forecast }]);
      } else {
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: generateHelpfulResponse('unknown'), sender: 'bot', timestamp: new Date(), type: 'suggestion' }]);
      }

      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue;
    setInputValue('');
    sendMessage(text);
  };

  const handleSuggestionClick = (option: NavigationOption) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text: `Taking you to ${option.name}!`, sender: 'bot', timestamp: new Date(), type: 'navigation' }]);
    navigateTo(option.path);
  };

  const handleQuickAction = (action: string) => {
    const message = action;
    setInputValue(message);
    setTimeout(() => sendMessage(message), 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    inputValue,
    setInputValue,
    isTyping,
    suggestions,
    messagesEndRef,
    generateSuggestions,
    handleSendMessage,
    handleSuggestionClick,
    handleQuickAction,
    handleKeyPress
  };
};
