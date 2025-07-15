// Stage 4: Fallback Name Generator - Generate brand-safe candidates
export function generateBrandSafeCandidates(intent: string, projectType: string): string[] {
  const domainKeywords = extractDomainKeywords(intent, projectType);
  const brandSuffixes = ['ly', 'fy', 'Hub', 'App', 'Pro', 'Go', 'Flow', 'Sync', 'Zone', 'Nest'];
  const brandPrefixes = ['Smart', 'Quick', 'Easy', 'Super', 'Ultra', 'Meta', 'Neo', 'Pro'];
  
  const candidates: string[] = [];
  
  // Strategy 1: Domain keyword + suffix
  for (const keyword of domainKeywords.slice(0, 2)) {
    for (const suffix of brandSuffixes.slice(0, 3)) {
      const name = capitalizeFirst(keyword) + suffix;
      if (name.length <= 15 && isValidBrandName(name)) {
        candidates.push(name);
      }
    }
  }
  
  // Strategy 2: Prefix + domain keyword
  for (const prefix of brandPrefixes.slice(0, 2)) {
    for (const keyword of domainKeywords.slice(0, 2)) {
      const name = prefix + capitalizeFirst(keyword);
      if (name.length <= 15 && isValidBrandName(name)) {
        candidates.push(name);
      }
    }
  }
  
  // Strategy 3: Compound words
  if (domainKeywords.length >= 2) {
    const compound = capitalizeFirst(domainKeywords[0]) + capitalizeFirst(domainKeywords[1]);
    if (compound.length <= 15 && isValidBrandName(compound)) {
      candidates.push(compound);
    }
  }
  
  // Strategy 4: Project type based names
  const typeNames = generateTypeBasedNames(projectType);
  candidates.push(...typeNames.slice(0, 2));
  
  // Return top 3 candidates, ensuring we always have at least one
  const uniqueCandidates = [...new Set(candidates)];
  return uniqueCandidates.slice(0, 3).length > 0 
    ? uniqueCandidates.slice(0, 3) 
    : ['MyApp', 'QuickStart', 'AppHub'];
}

function extractDomainKeywords(intent: string, projectType: string): string[] {
  // Extract meaningful words from intent
  const words = intent.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !isStopWord(word))
    .slice(0, 5);
    
  // Add project type keywords
  const typeKeywords = getProjectTypeKeywords(projectType);
  
  return [...words, ...typeKeywords].slice(0, 4);
}

function getProjectTypeKeywords(projectType: string): string[] {
  const typeMap: Record<string, string[]> = {
    'messaging_app': ['Chat', 'Talk', 'Message'],
    'e_commerce': ['Shop', 'Store', 'Market'],
    'productivity': ['Task', 'Plan', 'Work'],
    'creative': ['Create', 'Design', 'Art'],
    'analytics': ['Data', 'Chart', 'Insight'],
    'gaming': ['Game', 'Play', 'Score'],
    'health': ['Health', 'Fit', 'Wellness'],
    'finance': ['Money', 'Budget', 'Finance'],
    'education': ['Learn', 'Study', 'Skill'],
    'social_media': ['Social', 'Share', 'Connect'],
    'fitness_tracking': ['Fit', 'Track', 'Gym'],
    'dating_social': ['Meet', 'Match', 'Date'],
    'music_audio': ['Music', 'Sound', 'Audio'],
    'travel_planning': ['Travel', 'Trip', 'Journey']
  };
  
  return typeMap[projectType] || ['App', 'Tool', 'Hub'];
}

function generateTypeBasedNames(projectType: string): string[] {
  const typeNames: Record<string, string[]> = {
    'messaging_app': ['ChatFlow', 'TalkHub', 'MessagePro'],
    'e_commerce': ['ShopZone', 'MarketPlace', 'StoreGo'],
    'productivity': ['TaskFlow', 'WorkHub', 'PlanPro'],
    'creative': ['CreateSpace', 'ArtFlow', 'DesignHub'],
    'analytics': ['DataInsight', 'ChartPro', 'MetricHub'],
    'gaming': ['GameZone', 'PlayHub', 'ScorePro'],
    'health': ['HealthTrack', 'WellnessHub', 'FitPro'],
    'finance': ['MoneyFlow', 'BudgetHub', 'FinancePro'],
    'education': ['LearnHub', 'StudyPro', 'SkillZone'],
    'social_media': ['SocialHub', 'ShareFlow', 'ConnectPro'],
    'fitness_tracking': ['FitTrack', 'GymFlow', 'WorkoutPro'],
    'dating_social': ['MeetHub', 'MatchPro', 'DateFlow'],
    'music_audio': ['MusicHub', 'SoundPro', 'AudioFlow'],
    'travel_planning': ['TravelPro', 'TripHub', 'JourneyFlow']
  };
  
  return typeNames[projectType] || ['AppHub', 'QuickTool', 'SmartPro'];
}

function isStopWord(word: string): boolean {
  const stopWords = [
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'will',
    'app', 'application', 'system', 'platform', 'tool', 'website', 'site', 'project',
    'make', 'build', 'create', 'need', 'want', 'like', 'help', 'user', 'users'
  ];
  return stopWords.includes(word.toLowerCase());
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function isValidBrandName(name: string): boolean {
  // Check if it's a valid brand name (no special chars, reasonable length, etc.)
  return /^[A-Z][a-zA-Z0-9]*$/.test(name) && 
         name.length >= 4 && 
         name.length <= 15 &&
         !name.toLowerCase().includes('undefined') &&
         !name.toLowerCase().includes('null');
}