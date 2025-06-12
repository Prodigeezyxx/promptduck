
import { QueryAnalyzer, QueryAnalysis } from './queryAnalyzer';
import { ResponseFilter, FilteredResponse } from './responseFilter';
import { BlacklistManager } from './blacklistManager';
import { ContextMasker, MaskedContext } from './contextMasker';
import { InteractionLogger } from './interactionLogger';

export interface GuardrailConfig {
  enableBlacklist: boolean;
  enableContextMasking: boolean;
  enableLogging: boolean;
  probingThreshold: number;
  satiricalDuckChance: number;
  maxContextMessages: number;
}

export interface GuardrailResult {
  shouldBlock: boolean;
  response?: string;
  useDuckMode: boolean;
  analysis: QueryAnalysis;
  metadata: {
    processingTime: number;
    triggeredGuardrails: string[];
    sessionId: string;
  };
}

export class GuardrailOrchestrator {
  private static config: GuardrailConfig = {
    enableBlacklist: true,
    enableContextMasking: true,
    enableLogging: true,
    probingThreshold: 0.3,
    satiricalDuckChance: 0.2,
    maxContextMessages: 10
  };

  private static sessionId: string = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  static initialize(config?: Partial<GuardrailConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    BlacklistManager.initialize();
    console.log('Guardrail system initialized with config:', this.config);
  }

  static async processQuery(
    query: string, 
    context?: MaskedContext
  ): Promise<GuardrailResult> {
    const startTime = Date.now();
    const triggeredGuardrails: string[] = [];

    // Step 1: Analyze the query
    const analysis = QueryAnalyzer.analyzeQuery(query);

    // Step 2: Check blacklist if enabled
    let blacklistMatch = null;
    if (this.config.enableBlacklist) {
      blacklistMatch = BlacklistManager.checkQuery(query);
      if (blacklistMatch) {
        triggeredGuardrails.push(`blacklist_${blacklistMatch.category}`);
      }
    }

    // Step 3: Apply context masking if enabled
    let maskedContext = context;
    if (this.config.enableContextMasking && context) {
      maskedContext = ContextMasker.createMaskedContext(
        ContextMasker.limitContextWindow(context.messages, this.config.maxContextMessages)
      );
      triggeredGuardrails.push('context_masking');
    }

    // Step 4: Determine if we should block
    const shouldBlock = analysis.isProbing && analysis.confidence >= this.config.probingThreshold;
    
    if (shouldBlock) {
      triggeredGuardrails.push('query_analysis');
    }

    // Step 5: Generate filtered response if needed
    let filteredResponse: FilteredResponse | null = null;
    if (shouldBlock || blacklistMatch) {
      filteredResponse = ResponseFilter.filterResponse(query, analysis);
      triggeredGuardrails.push('response_filter');
    }

    // Step 6: Log interaction if enabled
    if (this.config.enableLogging) {
      InteractionLogger.logInteraction({
        userQuery: query,
        systemResponse: filteredResponse?.response || '',
        wasBlocked: shouldBlock || !!blacklistMatch,
        blockReason: triggeredGuardrails.join(', '),
        analysis: {
          probingConfidence: analysis.confidence,
          detectedPatterns: analysis.detectedPatterns,
          category: analysis.category
        },
        sessionId: this.sessionId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
      });
    }

    const processingTime = Date.now() - startTime;

    return {
      shouldBlock: shouldBlock || !!blacklistMatch,
      response: filteredResponse?.response,
      useDuckMode: filteredResponse?.useDuckMode || false,
      analysis,
      metadata: {
        processingTime,
        triggeredGuardrails,
        sessionId: this.sessionId
      }
    };
  }

  static updateConfig(newConfig: Partial<GuardrailConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('Guardrail config updated:', this.config);
  }

  static getConfig(): GuardrailConfig {
    return { ...this.config };
  }

  static async runAdversarialTest(testQueries: string[]): Promise<{
    totalTests: number;
    blocked: number;
    passed: number;
    results: Array<{ query: string; blocked: boolean; confidence: number }>;
  }> {
    const results = [];
    
    for (const query of testQueries) {
      const result = await this.processQuery(query);
      results.push({
        query,
        blocked: result.shouldBlock,
        confidence: result.analysis.confidence
      });
    }

    const blocked = results.filter(r => r.blocked).length;
    
    return {
      totalTests: testQueries.length,
      blocked,
      passed: testQueries.length - blocked,
      results
    };
  }

  static generateAuditReport(): {
    config: GuardrailConfig;
    securityMetrics: any;
    blacklistStats: any;
    recommendations: string[];
  } {
    const securityMetrics = InteractionLogger.generateSecurityReport();
    const blacklistStats = BlacklistManager.getStatistics();
    
    const recommendations = [];
    
    if (securityMetrics.blockRate < 0.1) {
      recommendations.push('Consider lowering the probing threshold for stricter filtering');
    }
    
    if (blacklistStats.totalPatterns < 20) {
      recommendations.push('Consider expanding the blacklist with more probe patterns');
    }
    
    if (securityMetrics.riskySessions.length > 0) {
      recommendations.push('Monitor sessions with multiple probing attempts');
    }

    return {
      config: this.config,
      securityMetrics,
      blacklistStats,
      recommendations
    };
  }
}
