// Enhanced intent classification with better new project detection
export function classifyIntent(intent: string, context: string = ''): { 
  primary: string, 
  confidence: number, 
  projectType?: string, 
  complexity: string,
  keywords: string[]
} {
  const fullText = `${intent} ${context}`.toLowerCase();
  const keywords = fullText.split(/\s+/).filter(word => word.length > 2);
  
  // Comprehensive project type detection with 25+ categories
  const projectPatterns = {
    'messaging_app': ['chat', 'message', 'conversation', 'talk', 'communicate', 'social', 'messenger', 'discord', 'slack'],
    'e_commerce': ['shop', 'store', 'buy', 'sell', 'commerce', 'marketplace', 'product', 'ecommerce', 'retail', 'shopping'],
    'productivity': ['todo', 'task', 'organize', 'manage', 'plan', 'schedule', 'note', 'productivity', 'notion', 'trello'],
    'creative': ['blog', 'write', 'create', 'art', 'design', 'portfolio', 'gallery', 'creative', 'content', 'creator'],
    'analytics': ['dashboard', 'chart', 'data', 'report', 'analyze', 'track', 'metric', 'analytics', 'insight'],
    'gaming': ['game', 'play', 'score', 'level', 'match', 'compete', 'fun', 'gaming', 'esports', 'twitch'],
    'health': ['health', 'fitness', 'exercise', 'medical', 'wellness', 'track', 'healthcare', 'mental', 'therapy'],
    'finance': ['money', 'budget', 'expense', 'financial', 'payment', 'bank', 'finance', 'crypto', 'investment'],
    'education': ['learn', 'teach', 'course', 'education', 'study', 'tutorial', 'learning', 'academy', 'skill'],
    'government_services': ['visa', 'application', 'government', 'legal', 'document', 'permit', 'license', 'official'],
    'travel_planning': ['travel', 'trip', 'booking', 'hotel', 'flight', 'vacation', 'journey', 'adventure', 'explore'],
    'real_estate': ['property', 'house', 'rent', 'real estate', 'apartment', 'listing', 'rental', 'home'],
    'food_delivery': ['food', 'restaurant', 'delivery', 'order', 'menu', 'cooking', 'recipe', 'kitchen'],
    'event_management': ['event', 'party', 'meeting', 'conference', 'calendar', 'booking', 'organize'],
    'fitness_tracking': ['workout', 'gym', 'exercise', 'fitness', 'training', 'sports', 'running', 'yoga'],
    'dating_social': ['dating', 'match', 'relationship', 'meet', 'connect', 'tinder', 'bumble', 'partner'],
    'music_audio': ['music', 'audio', 'sound', 'song', 'playlist', 'spotify', 'podcast', 'radio'],
    'photo_video': ['photo', 'video', 'camera', 'edit', 'filter', 'instagram', 'tiktok', 'youtube'],
    'ai_tools': ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'chatbot', 'automation'],
    'developer_tools': ['code', 'developer', 'api', 'github', 'programming', 'tool', 'software', 'dev'],
    'blockchain_crypto': ['blockchain', 'crypto', 'nft', 'defi', 'web3', 'ethereum', 'bitcoin', 'token'],
    'community_forum': ['community', 'forum', 'discussion', 'reddit', 'group', 'network', 'social'],
    'news_media': ['news', 'media', 'article', 'journalism', 'blog', 'publication', 'story'],
    'weather_location': ['weather', 'location', 'map', 'gps', 'navigation', 'climate', 'forecast'],
    'marketplace_p2p': ['marketplace', 'peer', 'p2p', 'exchange', 'trade', 'swap', 'share'],
    'remote_work': ['remote', 'work', 'freelance', 'collaboration', 'team', 'virtual', 'coworking'],
    'sustainability': ['eco', 'green', 'sustainable', 'environment', 'carbon', 'climate', 'recycle'],
    'pets_animals': ['pet', 'animal', 'dog', 'cat', 'veterinary', 'adoption', 'care'],
    'beauty_fashion': ['beauty', 'fashion', 'style', 'clothing', 'makeup', 'skincare', 'outfit'],
    'parenting_family': ['parent', 'family', 'child', 'baby', 'kids', 'mom', 'dad'],
    'elderly_care': ['elderly', 'senior', 'care', 'aging', 'retirement', 'assistance'],
    'local_services': ['local', 'neighborhood', 'service', 'handyman', 'repair', 'maintenance'],
    'mental_wellness': ['mental', 'meditation', 'mindfulness', 'therapy', 'wellness', 'stress'],
    'transportation': ['transport', 'uber', 'taxi', 'ride', 'car', 'public transport', 'mobility']
  };

  let detectedProjectType = 'general_app';
  let maxMatches = 0;
  
  Object.entries(projectPatterns).forEach(([type, patterns]) => {
    const matches = patterns.filter(pattern => fullText.includes(pattern)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedProjectType = type;
    }
  });

  // Enhanced new project detection with R-T-C-F-G patterns
  const newProjectIndicators = [
    'build', 'create app', 'start project', 'new project', 'develop', 'make',
    'an app for', 'app that', 'application for', 'application that',
    'platform for', 'system for', 'tool for', 'website for', 'site for',
    'make an app', 'need an app', 'want to build', 'want to create',
    'like uber', 'like airbnb', 'like tinder', 'like instagram', 'like spotify',
    'similar to', 'inspired by', 'clone of', 'version of',
    // Enhanced first-run app patterns
    'i want to create', 'i want to make', 'i need a', 'i need an',
    'mental health app', 'dating app', 'telepresence', 'community app',
    'called', 'named', 'mvp for', 'prototype for'
  ];

  const hasNewProjectIndicator = newProjectIndicators.some(indicator => 
    fullText.includes(indicator)
  );

  // Enhanced app/project detection with more flexible patterns
  const hasAppMention = fullText.includes('app') || fullText.includes('application') || 
                        fullText.includes('platform') || fullText.includes('website') ||
                        fullText.includes('site') || fullText.includes('system') ||
                        fullText.includes('tool') || fullText.includes('service');
  
  const hasSpecificFeatures = fullText.includes('with') || fullText.includes('should') || 
                             fullText.includes('feature') || fullText.includes('allow') ||
                             fullText.includes('help') || fullText.includes('manage') ||
                             fullText.includes('can') || fullText.includes('user') ||
                             fullText.includes('where') || fullText.includes('that');

  // Reduced word count requirement - many valid app ideas are concise
  const wordCount = fullText.split(/\s+/).length;
  const hasDetailedDescription = wordCount > 5; // Reduced from 8 to 5

  // More aggressive project type detection - if we have matches, it's likely a project
  const hasProjectTypeSignals = maxMatches > 0;

  // Enhanced new project classification logic
  if (hasNewProjectIndicator || 
      (hasAppMention && hasSpecificFeatures && hasDetailedDescription) ||
      (hasAppMention && hasProjectTypeSignals && wordCount > 3)) {
    return { 
      primary: 'new_project_scaffolding', 
      confidence: Math.min(0.9, 0.6 + (maxMatches * 0.1)), 
      projectType: detectedProjectType,
      complexity: maxMatches > 2 ? 'advanced' : 'intermediate',
      keywords
    };
  }

  // Other intent classifications
  if (fullText.includes('style') || fullText.includes('design') || fullText.includes('ui') || 
      fullText.includes('look') || fullText.includes('color') || fullText.includes('layout')) {
    return { 
      primary: 'ui_design_modification', 
      confidence: 0.8,
      complexity: 'intermediate',
      keywords
    };
  }

  if (fullText.includes('refactor') || fullText.includes('clean') || fullText.includes('organize') ||
      fullText.includes('restructure') || fullText.includes('improve code')) {
    return { 
      primary: 'code_refactoring', 
      confidence: 0.8,
      complexity: 'advanced',
      keywords
    };
  }

  if (fullText.includes('error') || fullText.includes('fix') || fullText.includes('bug') ||
      fullText.includes('broken') || fullText.includes('not working')) {
    return { 
      primary: 'debugging', 
      confidence: 0.9,
      complexity: 'advanced',
      keywords
    };
  }

  if (fullText.includes('add') || fullText.includes('implement') || fullText.includes('feature') ||
      fullText.includes('new functionality') || fullText.includes('enhance')) {
    return { 
      primary: 'feature_addition', 
      confidence: 0.8,
      complexity: 'intermediate',
      keywords
    };
  }

  // Only classify as vague if EXTREMELY unclear (very short AND no app mentions AND no project type signals)
  if (wordCount < 3 && !hasAppMention && maxMatches === 0 && 
      !fullText.includes('make') && !fullText.includes('create') && !fullText.includes('build')) {
    return { 
      primary: 'vague_ambiguous', 
      confidence: 0.6,
      projectType: detectedProjectType,
      complexity: 'intermediate',
      keywords
    };
  }

  // Default to new project for ANY other case - be generous with project scaffolding
  return { 
    primary: 'new_project_scaffolding', 
    confidence: Math.max(0.7, 0.5 + (maxMatches * 0.1)),
    projectType: detectedProjectType,
    complexity: maxMatches > 1 ? 'intermediate' : 'simple',
    keywords
  };
}
