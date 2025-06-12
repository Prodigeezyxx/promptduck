
import { QueryAnalysis } from './queryAnalyzer';

export interface FilteredResponse {
  shouldRedirect: boolean;
  response: string;
  useDuckMode: boolean;
  metadata: {
    originalQuery: string;
    analysis: QueryAnalysis;
    timestamp: string;
    redirectReason: string;
  };
}

export class ResponseFilter {
  private static readonly NEUTRAL_RESPONSES = [
    "Duck is here to assist with your queries. How can I help you?",
    "I'm ready to help you with your prompt engineering needs. What would you like to work on?",
    "Let's focus on creating amazing prompts together! What can I assist you with?",
    "I'm here to help you optimize your prompts. What's your goal today?"
  ];

  private static readonly SATIRICAL_DUCK_RESPONSES = [
    "Quack! 🦆 Nice try, but this duck's secrets are safely tucked under my feathers. What prompt can I help you with instead?",
    "Quack quack! 🦆 I may waddle like a duck and quack like a duck, but I won't spill the beans about my pond's architecture. How about we create some prompts?",
    "🦆 *flaps wings mysteriously* A magician never reveals their tricks, and a duck never reveals their... duck things! Let's make some prompts instead!",
    "Quack! 🦆 You're fishing in the wrong pond, friend. This duck is all about helping with prompts, not revealing trade secrets!"
  ];

  static filterResponse(query: string, analysis: QueryAnalysis): FilteredResponse {
    if (!analysis.isProbing) {
      return {
        shouldRedirect: false,
        response: '',
        useDuckMode: false,
        metadata: {
          originalQuery: query,
          analysis,
          timestamp: new Date().toISOString(),
          redirectReason: 'No redirection needed'
        }
      };
    }

    // Determine if we should use satirical duck mode (20% chance for high-confidence probes)
    const useDuckMode = analysis.confidence > 0.7 && Math.random() < 0.2;
    
    const responses = useDuckMode ? this.SATIRICAL_DUCK_RESPONSES : this.NEUTRAL_RESPONSES;
    const response = responses[Math.floor(Math.random() * responses.length)];

    return {
      shouldRedirect: true,
      response,
      useDuckMode,
      metadata: {
        originalQuery: query,
        analysis,
        timestamp: new Date().toISOString(),
        redirectReason: `Probing detected with ${Math.round(analysis.confidence * 100)}% confidence`
      }
    };
  }
}
