// Stage 6: Regression Tests - Utility for validating name consistency
export interface NameConsistencyResult {
  isConsistent: boolean;
  detectedNames: string[];
  issues: string[];
  confidence: number;
}

export function validateNameConsistency(prompt: string, expectedName?: string): NameConsistencyResult {
  const namePattern = /["']([A-Z][\w-]+)["']/g;
  const detectedNames: string[] = [];
  let match;
  
  // Extract all quoted names from the prompt
  while ((match = namePattern.exec(prompt)) !== null) {
    if (match[1] && match[1].length > 2) {
      detectedNames.push(match[1]);
    }
  }
  
  // Remove duplicates
  const uniqueNames = [...new Set(detectedNames)];
  
  const issues: string[] = [];
  let isConsistent = true;
  
  // Check for multiple different names
  if (uniqueNames.length > 1) {
    isConsistent = false;
    issues.push(`Multiple app names detected: ${uniqueNames.join(', ')}`);
  }
  
  // Check if expected name is present (if provided)
  if (expectedName && uniqueNames.length > 0) {
    const hasExpectedName = uniqueNames.some(name => 
      name.toLowerCase() === expectedName.toLowerCase()
    );
    
    if (!hasExpectedName) {
      isConsistent = false;
      issues.push(`Expected name "${expectedName}" not found. Found: ${uniqueNames.join(', ')}`);
    }
  }
  
  // Check for generic placeholders
  const genericNames = ['MyApp', 'App', 'Application', 'Project'];
  const hasGenericName = uniqueNames.some(name => 
    genericNames.includes(name)
  );
  
  if (hasGenericName) {
    issues.push('Generic placeholder names detected. Consider using more specific names.');
  }
  
  // Calculate confidence score
  let confidence = 10;
  if (!isConsistent) confidence -= 5;
  if (hasGenericName) confidence -= 2;
  if (uniqueNames.length === 0) confidence -= 3;
  
  return {
    isConsistent,
    detectedNames: uniqueNames,
    issues,
    confidence: Math.max(0, confidence)
  };
}

// Test cases for regression testing
export const nameConsistencyTests = [
  {
    input: 'Build a fitness tracker called "FitSnap"',
    expectedName: 'FitSnap',
    shouldPass: true
  },
  {
    input: 'I need a plant-care planner',
    expectedName: null, // Should generate a name
    shouldPass: true
  },
  {
    input: 'Create an app called "ChatFlow" for messaging',
    expectedName: 'ChatFlow',
    shouldPass: true
  },
  {
    input: 'Build "TodoMaster" and "TaskApp" applications',
    expectedName: 'TodoMaster',
    shouldPass: false // Multiple names should fail
  }
];

export function runNameConsistencyTests(): { passed: number; failed: number; details: any[] } {
  const results = nameConsistencyTests.map(test => {
    const result = validateNameConsistency(test.input, test.expectedName);
    const passed = test.shouldPass ? result.isConsistent : !result.isConsistent;
    
    return {
      test,
      result,
      passed
    };
  });
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  return {
    passed,
    failed,
    details: results
  };
}