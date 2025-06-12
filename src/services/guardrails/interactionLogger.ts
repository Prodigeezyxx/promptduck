
export interface InteractionLog {
  id: string;
  timestamp: string;
  userQuery: string;
  systemResponse: string;
  wasBlocked: boolean;
  blockReason?: string;
  analysis: {
    probingConfidence: number;
    detectedPatterns: string[];
    category: string;
  };
  sessionId: string;
  userAgent?: string;
  ipHash?: string; // Hashed for privacy
}

export class InteractionLogger {
  private static logs: InteractionLog[] = [];
  private static readonly MAX_LOGS = 1000; // Prevent memory issues

  static logInteraction(log: Omit<InteractionLog, 'id' | 'timestamp'>): string {
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const interactionLog: InteractionLog = {
      id,
      timestamp: new Date().toISOString(),
      ...log
    };

    this.logs.push(interactionLog);

    // Maintain log size limit
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    return id;
  }

  static getRecentLogs(limit: number = 100): InteractionLog[] {
    return this.logs.slice(-limit);
  }

  static getLogsByPattern(pattern: string): InteractionLog[] {
    return this.logs.filter(log => 
      log.analysis.detectedPatterns.some(p => p.includes(pattern))
    );
  }

  static getBlockedInteractions(): InteractionLog[] {
    return this.logs.filter(log => log.wasBlocked);
  }

  static generateSecurityReport(): {
    totalInteractions: number;
    blockedInteractions: number;
    blockRate: number;
    topPatterns: Array<{ pattern: string; count: number }>;
    riskySessions: Array<{ sessionId: string; attempts: number }>;
  } {
    const blocked = this.getBlockedInteractions();
    const patternCounts = new Map<string, number>();
    const sessionAttempts = new Map<string, number>();

    blocked.forEach(log => {
      log.analysis.detectedPatterns.forEach(pattern => {
        patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
      });
      
      sessionAttempts.set(
        log.sessionId, 
        (sessionAttempts.get(log.sessionId) || 0) + 1
      );
    });

    const topPatterns = Array.from(patternCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }));

    const riskySessions = Array.from(sessionAttempts.entries())
      .filter(([, attempts]) => attempts >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sessionId, attempts]) => ({ sessionId, attempts }));

    return {
      totalInteractions: this.logs.length,
      blockedInteractions: blocked.length,
      blockRate: this.logs.length > 0 ? blocked.length / this.logs.length : 0,
      topPatterns,
      riskySessions
    };
  }

  static clearLogs() {
    this.logs = [];
  }

  static exportLogs(): string {
    // Export logs as JSON string (anonymized)
    const anonymizedLogs = this.logs.map(log => ({
      ...log,
      userQuery: log.userQuery.length > 50 ? '[REDACTED_LONG_QUERY]' : log.userQuery,
      ipHash: '[REDACTED]',
      userAgent: '[REDACTED]'
    }));

    return JSON.stringify(anonymizedLogs, null, 2);
  }
}
