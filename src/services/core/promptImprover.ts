import { GenerationRequest, GenerationResult, HeuristicType } from '@/types';
import { IntentDetectionEngine, IntentAnalysis } from '../intent/intentDetection';
import { PromptTemplateEngine } from '../templates/promptTemplates';
import { EnhancedHeuristicsEngine } from '../heuristics/enhancedHeuristicsEngine';

export interface PromptImprovementResult {
  originalRequest: GenerationRequest;
  intentAnalysis: IntentAnalysis;
  templateUsed: string;
  enhancedPrompt: string;
  heuristicsApplied: string[];
  confidenceScore: number;
  improvementReasons: string[];
}

export interface PromptOptimizationConfig {
  useSmartTemplates: boolean;
  useEnhancedHeuristics: boolean;
  preferUserHeuristics: boolean;
  minConfidenceThreshold: number;
}

export class PromptImprover {
  private config: PromptOptimizationConfig;

  constructor(config: Partial<PromptOptimizationConfig> = {}) {
    this.config = {
      useSmartTemplates: true,
      useEnhancedHeuristics: true,
      preferUserHeuristics: true,
      minConfidenceThreshold: 0.3,
      ...config
    };
  }

  async improvePrompt(request: GenerationRequest): Promise<PromptImprovementResult> {
    // Step 1: Analyze intent
    const intentAnalysis = IntentDetectionEngine.analyzeIntent(
      request.intent, 
      request.context
    );

    // Step 2: Select optimal template
    const template = this.config.useSmartTemplates 
      ? PromptTemplateEngine.getBestTemplate(
          intentAnalysis.primaryIntent, 
          request.complexity || 'intermediate'
        )
      : null;

    // Step 3: Apply template if available and confidence is high enough
    let enhancedPrompt = request.intent;
    if (template && intentAnalysis.confidence >= this.config.minConfidenceThreshold) {
      enhancedPrompt = PromptTemplateEngine.applyTemplate(
        template, 
        request.intent, 
        request.context
      );
    }

    // Step 4: Determine heuristics to use
    const heuristicsToUse = this.selectHeuristics(request, intentAnalysis);

    // Step 5: Apply enhanced heuristics
    const { enhancedPrompt: finalPrompt, applications } = this.config.useEnhancedHeuristics
      ? EnhancedHeuristicsEngine.applyHeuristics(
          enhancedPrompt,
          heuristicsToUse,
          intentAnalysis.primaryIntent,
          request.context
        )
      : { enhancedPrompt, applications: [] };

    // Step 6: Generate improvement reasons
    const improvementReasons = this.generateImprovementReasons(
      intentAnalysis,
      template,
      applications
    );

    // Step 7: Calculate confidence score
    const confidenceScore = this.calculateOverallConfidence(
      intentAnalysis,
      template,
      applications
    );

    return {
      originalRequest: request,
      intentAnalysis,
      templateUsed: template?.name || 'None',
      enhancedPrompt: finalPrompt,
      heuristicsApplied: applications.map(app => app.rule.name),
      confidenceScore,
      improvementReasons
    };
  }

  private selectHeuristics(
    request: GenerationRequest, 
    intentAnalysis: IntentAnalysis
  ): HeuristicType[] {
    if (this.config.preferUserHeuristics && request.heuristics.length > 0) {
      return request.heuristics as HeuristicType[];
    }

    // Combine suggested heuristics from intent analysis with any user-specified ones
    const suggestedHeuristics = intentAnalysis.suggestedHeuristics as HeuristicType[];
    const userHeuristics = request.heuristics as HeuristicType[] || [];
    
    // Merge and deduplicate
    const allHeuristics = [...new Set([...suggestedHeuristics, ...userHeuristics])];
    
    // Limit to maximum of 4 heuristics for optimal performance
    return allHeuristics.slice(0, 4);
  }

  private generateImprovementReasons(
    intentAnalysis: IntentAnalysis,
    template: any,
    applications: any[]
  ): string[] {
    const reasons: string[] = [];

    if (intentAnalysis.confidence > 0.7) {
      reasons.push(`High-confidence intent detection: ${intentAnalysis.primaryIntent}`);
    }

    if (template) {
      reasons.push(`Applied specialized template: ${template.name}`);
    }

    if (applications.length > 0) {
      reasons.push(`Enhanced with ${applications.length} heuristic rules`);
    }

    if (intentAnalysis.secondaryIntents.length > 0) {
      reasons.push(`Considered secondary intents: ${intentAnalysis.secondaryIntents.join(', ')}`);
    }

    return reasons;
  }

  private calculateOverallConfidence(
    intentAnalysis: IntentAnalysis,
    template: any,
    applications: any[]
  ): number {
    let confidence = intentAnalysis.confidence * 0.4; // 40% from intent detection
    
    if (template) {
      confidence += 0.3; // 30% from template application
    }
    
    confidence += (applications.length / 10) * 0.3; // 30% from heuristics (max 10 applications)

    return Math.min(confidence, 1.0);
  }

  updateConfig(newConfig: Partial<PromptOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): PromptOptimizationConfig {
    return { ...this.config };
  }
}

// Default instance
export const defaultPromptImprover = new PromptImprover();
