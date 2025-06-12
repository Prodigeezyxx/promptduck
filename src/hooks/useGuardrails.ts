
import { useState, useEffect } from 'react';
import { GuardrailOrchestrator, GuardrailResult } from '@/services/guardrails/guardrailOrchestrator';

export function useGuardrails() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    GuardrailOrchestrator.initialize({
      enableBlacklist: true,
      enableContextMasking: true,
      enableLogging: true,
      probingThreshold: 0.3,
      satiricalDuckChance: 0.2,
      maxContextMessages: 10
    });
    setIsInitialized(true);
  }, []);

  const processQuery = async (query: string): Promise<GuardrailResult> => {
    if (!isInitialized) {
      throw new Error('Guardrails not initialized');
    }
    
    return await GuardrailOrchestrator.processQuery(query);
  };

  const runSecurityCheck = async (query: string): Promise<boolean> => {
    const result = await processQuery(query);
    return !result.shouldBlock;
  };

  const generateAuditReport = () => {
    return GuardrailOrchestrator.generateAuditReport();
  };

  const runAdversarialTest = async (testQueries: string[]) => {
    return await GuardrailOrchestrator.runAdversarialTest(testQueries);
  };

  return {
    isInitialized,
    processQuery,
    runSecurityCheck,
    generateAuditReport,
    runAdversarialTest
  };
}
