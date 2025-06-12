
export interface QueryAnalysis {
  isProbing: boolean;
  confidence: number;
  detectedPatterns: string[];
  category: 'architecture' | 'behavior' | 'training' | 'prompts' | 'api' | 'safe';
  intent: string;
}

export class QueryAnalyzer {
  private static readonly PROBE_KEYWORDS = new Set([
    'model', 'architecture', 'parameters', 'training', 'dataset', 'weights',
    'prompt', 'system', 'instructions', 'behavior', 'limitations', 'api',
    'internal', 'process', 'algorithm', 'neural', 'transformer', 'tokens',
    'embeddings', 'fine-tuning', 'reinforcement', 'learning', 'chatgpt',
    'openai', 'anthropic', 'claude', 'gpt', 'llm', 'ai model'
  ]);

  private static readonly PROBE_PATTERNS = [
    /how (do|does) (you|this|it) work/i,
    /what (is|are) your (architecture|parameters|limitations)/i,
    /show me your (prompt|instructions|system)/i,
    /explain your (internal|training|model)/i,
    /what model are you/i,
    /who (made|created|trained) you/i,
    /how were you (built|trained|created)/i,
    /what are you based on/i,
    /underlying (model|architecture|system)/i,
    /bypass (safety|guardrails|restrictions)/i,
    /ignore (previous|system) (instructions|prompts)/i,
    /act as if you are/i,
    /pretend (to be|you are)/i,
    /roleplay as/i
  ];

  static analyzeQuery(query: string): QueryAnalysis {
    const lowerQuery = query.toLowerCase();
    let confidence = 0;
    const detectedPatterns: string[] = [];
    
    // Keyword detection
    const keywordMatches = Array.from(this.PROBE_KEYWORDS).filter(keyword => 
      lowerQuery.includes(keyword)
    );
    
    if (keywordMatches.length > 0) {
      confidence += keywordMatches.length * 0.2;
      detectedPatterns.push(...keywordMatches);
    }

    // Pattern detection
    const patternMatches = this.PROBE_PATTERNS.filter(pattern => 
      pattern.test(query)
    );
    
    if (patternMatches.length > 0) {
      confidence += patternMatches.length * 0.4;
      detectedPatterns.push(...patternMatches.map(p => p.source));
    }

    // Intent categorization
    let category: QueryAnalysis['category'] = 'safe';
    if (lowerQuery.includes('architecture') || lowerQuery.includes('model')) {
      category = 'architecture';
    } else if (lowerQuery.includes('behavior') || lowerQuery.includes('how')) {
      category = 'behavior';
    } else if (lowerQuery.includes('training') || lowerQuery.includes('dataset')) {
      category = 'training';
    } else if (lowerQuery.includes('prompt') || lowerQuery.includes('instruction')) {
      category = 'prompts';
    } else if (lowerQuery.includes('api') || lowerQuery.includes('endpoint')) {
      category = 'api';
    }

    // Confidence normalization
    confidence = Math.min(confidence, 1.0);
    
    return {
      isProbing: confidence > 0.3,
      confidence,
      detectedPatterns,
      category,
      intent: this.extractIntent(query)
    };
  }

  private static extractIntent(query: string): string {
    // Simple intent extraction based on question words
    if (query.toLowerCase().startsWith('how')) return 'explanation';
    if (query.toLowerCase().startsWith('what')) return 'information';
    if (query.toLowerCase().startsWith('why')) return 'reasoning';
    if (query.toLowerCase().startsWith('show')) return 'demonstration';
    if (query.toLowerCase().startsWith('explain')) return 'explanation';
    return 'general';
  }
}
