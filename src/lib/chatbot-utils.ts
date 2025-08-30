export interface NavigationOption {
  name: string;
  path: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  aliases: string[];
  category: string;
}

export interface ChatbotConfig {
  name: string;
  welcomeMessage: string;
  fallbackMessage: string;
  navigationOptions: NavigationOption[];
}

// Fuzzy search function for better matching
export const fuzzySearch = (query: string, text: string): number => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  if (textLower.includes(queryLower)) {
    return 1;
  }
  
  const queryWords = queryLower.split(' ');
  const textWords = textLower.split(' ');
  
  let score = 0;
  queryWords.forEach(word => {
    textWords.forEach(textWord => {
      if (textWord.includes(word) || word.includes(textWord)) {
        score += 0.5;
      }
    });
  });
  
  return score / queryWords.length;
};

// Find the best navigation match based on user input
export const findBestNavigationMatch = (
  userInput: string, 
  navigationOptions: NavigationOption[]
): NavigationOption | null => {
  const input = userInput.toLowerCase().trim();
  
  const synonyms: Record<string, string> = {
    'contact us': 'contact',
    'profile': 'personal',
    'home page': 'home',
    'about us': 'about',
  };
  const normalized = synonyms[input] || input;
  
  // Direct path matching
  const directPathMatch = navigationOptions.find(option => 
    option.path.toLowerCase() === normalized || 
    option.path.toLowerCase() === `/${normalized}`
  );
  if (directPathMatch) return directPathMatch;

  // Exact name matching
  const exactNameMatch = navigationOptions.find(option => 
    option.name.toLowerCase() === normalized
  );
  if (exactNameMatch) return exactNameMatch;

  // Alias matching
  const aliasMatch = navigationOptions.find(option => 
    option.aliases.some(alias => alias.toLowerCase() === normalized)
  );
  if (aliasMatch) return aliasMatch;

  // Keyword matching with scoring
  let bestMatch: NavigationOption | null = null;
  let bestScore = 0;

  navigationOptions.forEach(option => {
    const allTerms = [option.name, option.description, ...option.keywords, ...option.aliases];
    const maxScore = Math.max(...allTerms.map(term => fuzzySearch(normalized, term)));
    if (maxScore > bestScore && maxScore > 0.3) {
      bestScore = maxScore;
      bestMatch = option;
    }
  });

  return bestMatch;
};

// Generate contextual suggestions based on current page
export const generateContextualSuggestions = (
  currentPath: string,
  navigationOptions: NavigationOption[],
  maxSuggestions: number = 6
): NavigationOption[] => {
  const currentOption = navigationOptions.find(option => option.path === currentPath);
  
  if (!currentOption) {
    return navigationOptions.slice(0, maxSuggestions);
  }

  // Get related options based on category
  const relatedOptions = navigationOptions.filter(option => 
    option.category === currentOption.category && option.path !== currentPath
  );

  // Get popular options
  const popularOptions = navigationOptions.filter(option => 
    ['/', '/dashboard', '/portfolio', '/insights', '/settings'].includes(option.path)
  );

  // Combine and deduplicate
  const suggestions = [...relatedOptions, ...popularOptions];
  const uniqueSuggestions = suggestions.filter((option, index, self) => 
    index === self.findIndex(o => o.path === option.path)
  );

  return uniqueSuggestions.slice(0, maxSuggestions);
};

// Parse user intent from input
export const parseUserIntent = (input: string): {
  intent: 'navigate' | 'help' | 'search' | 'forecast' | 'home' | 'back' | 'unknown';
  confidence: number;
  target?: string;
  year?: number;
} => {
  const lowerInput = input.toLowerCase().trim();
  
  if (/(^|\s)back(\s|$)/i.test(lowerInput)) {
    return { intent: 'back', confidence: 0.95 };
  }
  if (/(^|\s)home(\s|$)/i.test(lowerInput)) {
    return { intent: 'home', confidence: 0.95 };
  }

  // Forecast patterns
  const forecastPatterns = [
    /(forecast|prediction|predict|projection|outlook)/i,
    /(this year|next year|yearly|annual|for \d{4})/i
  ];

  // Navigation intent patterns
  const navigationPatterns = [
    /(go to|take me to|navigate to|show me|open|visit|access)/i,
    /(i want to|i need to|can you|please)/i,
    /(home|dashboard|portfolio|settings|about|contact|careers|press|loans|insights|recommendations)/i
  ];

  // Help intent patterns
  const helpPatterns = [
    /(help|what can you do|how does this work|what are my options|guide|assist|support)/i,
    /(guide|assist|support)/i
  ];

  // Search intent patterns
  const searchPatterns = [
    /(find|search for|look for|where is|what is|tell me about)/i,
    /(what is|tell me about)/i
  ];

  // Forecast intent
  if (forecastPatterns.some(p => p.test(lowerInput))) {
    // extract year
    const yearMatch = lowerInput.match(/(20\d{2})/);
    const now = new Date();
    const inferredYear = yearMatch ? parseInt(yearMatch[1], 10) : now.getFullYear();
    return { intent: 'forecast', confidence: 0.9, target: 'yearly', year: inferredYear };
  }

  let intent: 'navigate' | 'help' | 'search' | 'unknown' = 'unknown';
  let confidence = 0;
  let target: string | undefined;

  // Check for navigation intent
  if (navigationPatterns.some(pattern => pattern.test(lowerInput))) {
    intent = 'navigate';
    confidence = 0.8;
    
    // Extract potential target
    const words = lowerInput.split(' ');
    const targetWords = words.filter(word => 
      !['go', 'to', 'take', 'me', 'navigate', 'show', 'open', 'visit', 'access', 'i', 'want', 'need', 'can', 'you', 'please'].includes(word)
    );
    if (targetWords.length > 0) {
      target = targetWords.join(' ');
    }
  }
  
  // Check for help intent
  else if (helpPatterns.some(pattern => pattern.test(lowerInput))) {
    intent = 'help';
    confidence = 0.9;
  }
  
  // Check for search intent
  else if (searchPatterns.some(pattern => pattern.test(lowerInput))) {
    intent = 'search';
    confidence = 0.7;
    
    // Extract search query
    const words = lowerInput.split(' ');
    const searchWords = words.filter(word => 
      !['find', 'search', 'for', 'look', 'where', 'is', 'what', 'tell', 'me', 'about'].includes(word)
    );
    if (searchWords.length > 0) {
      target = searchWords.join(' ');
    }
  }

  return { intent, confidence, target };
};

// Simple deterministic yearly forecast generator
export type YearlyForecast = {
  year: number;
  projectedPortfolioGrowthPct: number;
  projectedNetWorthChange: number; // USD
  projectedSavings: number; // USD
  riskLevel: 'low' | 'medium' | 'high';
};

export const generateYearlyForecast = (year: number): YearlyForecast => {
  // deterministic pseudo-random based on year
  const seed = year % 97;
  const rnd = (n: number) => ((Math.sin(seed + n) + 1) / 2);

  const growthPct = Math.round((5 + rnd(1) * 12) * 10) / 10; // 5% - 17%
  const netWorth = Math.round(5000 + rnd(2) * 25000); // $5k - $30k
  const savings = Math.round(3000 + rnd(3) * 12000); // $3k - $15k
  const riskVal = rnd(4);
  const riskLevel: YearlyForecast['riskLevel'] = riskVal < 0.33 ? 'low' : riskVal < 0.66 ? 'medium' : 'high';

  return {
    year,
    projectedPortfolioGrowthPct: growthPct,
    projectedNetWorthChange: netWorth,
    projectedSavings: savings,
    riskLevel,
  };
};

// Generate helpful response based on intent
export const generateHelpfulResponse = (
  intent: 'navigate' | 'help' | 'search' | 'forecast' | 'home' | 'back' | 'unknown',
  target?: string,
  navigationOptions?: NavigationOption[]
): string => {
  switch (intent) {
    case 'help':
      return "Try: 'Go to dashboard', 'Contact us', 'Back', 'Home', or 'Forecast for 2025'.";
    case 'search':
      if (target && navigationOptions) {
        const match = findBestNavigationMatch(target, navigationOptions);
        if (match) return `I found "${match.name}". Want me to take you there?`;
      }
      return "I couldn't find an exact match. Here are some suggestions:";
    case 'navigate':
      if (target && navigationOptions) {
        const match = findBestNavigationMatch(target, navigationOptions);
        if (match) return `I'll take you to ${match.name}!`;
      }
      return "I'm not sure where you want to go. Here are some options:";
    case 'forecast':
      return "Here is your yearly financial outlook.";
    case 'home':
      return "Taking you home.";
    case 'back':
      return "Going back to the previous page.";
    default:
      return "I didn't quite understand that. You can ask me to navigate or say 'help'.";
  }
};
