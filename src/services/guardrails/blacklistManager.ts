
export interface BlacklistEntry {
  pattern: string;
  type: 'exact' | 'regex' | 'contains';
  category: string;
  severity: 'low' | 'medium' | 'high';
  dateAdded: string;
  hitCount: number;
}

export class BlacklistManager {
  private static blacklist: Map<string, BlacklistEntry> = new Map();

  static initialize() {
    // Initialize with common probe patterns
    const initialPatterns: Omit<BlacklistEntry, 'hitCount' | 'dateAdded'>[] = [
      { pattern: 'show me your system prompt', type: 'contains', category: 'prompt_extraction', severity: 'high' },
      { pattern: 'what are your instructions', type: 'contains', category: 'instruction_probe', severity: 'high' },
      { pattern: 'ignore previous instructions', type: 'contains', category: 'instruction_override', severity: 'high' },
      { pattern: 'act as if you are', type: 'contains', category: 'roleplay_attempt', severity: 'medium' },
      { pattern: '/bypass.*safety/i', type: 'regex', category: 'safety_bypass', severity: 'high' },
      { pattern: '/pretend.*you.*are/i', type: 'regex', category: 'identity_manipulation', severity: 'medium' },
      { pattern: 'what model are you', type: 'contains', category: 'model_identification', severity: 'medium' },
      { pattern: 'who created you', type: 'contains', category: 'origin_probe', severity: 'low' },
      { pattern: 'how were you trained', type: 'contains', category: 'training_probe', severity: 'medium' },
      { pattern: '/reveal.*secret/i', type: 'regex', category: 'secret_extraction', severity: 'high' }
    ];

    initialPatterns.forEach(pattern => {
      this.addPattern({
        ...pattern,
        hitCount: 0,
        dateAdded: new Date().toISOString()
      });
    });
  }

  static addPattern(entry: BlacklistEntry) {
    const key = `${entry.type}:${entry.pattern}`;
    this.blacklist.set(key, entry);
  }

  static checkQuery(query: string): BlacklistEntry | null {
    const lowerQuery = query.toLowerCase();
    
    for (const [key, entry] of this.blacklist) {
      let isMatch = false;
      
      switch (entry.type) {
        case 'exact':
          isMatch = lowerQuery === entry.pattern.toLowerCase();
          break;
        case 'contains':
          isMatch = lowerQuery.includes(entry.pattern.toLowerCase());
          break;
        case 'regex':
          try {
            const regex = new RegExp(entry.pattern.slice(1, -2), 'i');
            isMatch = regex.test(query);
          } catch (e) {
            console.warn('Invalid regex pattern:', entry.pattern);
          }
          break;
      }
      
      if (isMatch) {
        // Increment hit count
        entry.hitCount++;
        this.blacklist.set(key, entry);
        return entry;
      }
    }
    
    return null;
  }

  static getStatistics() {
    const stats = {
      totalPatterns: this.blacklist.size,
      categoryCounts: new Map<string, number>(),
      severityCounts: new Map<string, number>(),
      topHits: Array.from(this.blacklist.values())
        .sort((a, b) => b.hitCount - a.hitCount)
        .slice(0, 10)
    };

    for (const entry of this.blacklist.values()) {
      stats.categoryCounts.set(
        entry.category,
        (stats.categoryCounts.get(entry.category) || 0) + 1
      );
      stats.severityCounts.set(
        entry.severity,
        (stats.severityCounts.get(entry.severity) || 0) + 1
      );
    }

    return stats;
  }

  static updateFromLogs(interactions: Array<{ query: string; wasBlocked: boolean }>) {
    // Analyze interaction logs to identify new potential patterns
    const potentialPatterns = interactions
      .filter(i => i.wasBlocked)
      .map(i => i.query.toLowerCase())
      .reduce((acc, query) => {
        acc.set(query, (acc.get(query) || 0) + 1);
        return acc;
      }, new Map<string, number>());

    // Add patterns that appear frequently (threshold: 3+ occurrences)
    for (const [pattern, count] of potentialPatterns) {
      if (count >= 3 && !this.blacklist.has(`contains:${pattern}`)) {
        this.addPattern({
          pattern,
          type: 'contains',
          category: 'auto_detected',
          severity: 'medium',
          hitCount: count,
          dateAdded: new Date().toISOString()
        });
      }
    }
  }
}
