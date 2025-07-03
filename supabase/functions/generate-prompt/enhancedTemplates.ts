// Enhanced Lovable templates with AI-enriched context
import { generateProjectName } from './projectNames.ts';

interface ContextEnrichment {
  domainInsights: string[];
  targetAudienceAnalysis: string;
  technicalConsiderations: string[];
  marketContext: string;
  competitiveInsights: string[];
  userFlowSuggestions: string[];
  designPatterns: string[];
  confidence: number;
}

export function generateEnhancedLovableTemplate(
  intent: string, 
  context: string, 
  analysis: any, 
  enrichment: ContextEnrichment
): string {
  const { primary, projectType } = analysis;
  
  // Smart app name extraction
  const extractedAppName = extractAppNameFromIntent(intent);
  const projectName = extractedAppName || generateProjectName(intent, projectType || 'general_app');

  const templates = {
    new_project_scaffolding: () => {
      return generateSimpleProjectTemplate(projectName, projectType || 'general_app', context, intent, enrichment);
    },

    ui_design_modification: () => `CONTEXT: Lovable AI Builder specialized in ${projectType || 'application'} interfaces. Domain intelligence indicates ${enrichment.domainInsights.slice(0, 2).join(' and ')}.

TARGET USERS: ${enrichment.targetAudienceAnalysis}

MARKET REQUIREMENTS: ${enrichment.marketContext}

TASK: ${intent}

CONSTRAINTS:
1. PRESERVE existing functionality - visual changes only
2. Mobile-first responsive design with desktop compatibility
3. WCAG 2.1 AA compliance requirements  
4. Design system consistency using Tailwind + shadcn/ui
5. Performance: maintain p95 load times <1.8s
6. Apply proven patterns: ${enrichment.designPatterns.slice(0, 2).join(', ')}
7. Implement flows: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
8. Technical specs: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}
9. Competitive insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

IMPLEMENTATION PROTOCOL:
1. Use semantic design tokens, avoid hardcoded colors
2. Implement smooth transitions and micro-interactions
3. Optimize touch targets for mobile (44px minimum)
4. Test across breakpoints and validate accessibility

${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

GOAL: Deliver visually enhanced ${projectName} that maintains functionality while implementing research-backed design improvements proven effective for this app category.`,

    code_refactoring: () => `CONTEXT: Lovable Code Refactoring Specialist. Domain analysis shows ${enrichment.domainInsights.slice(0, 2).join(' and ')}.

REFACTORING TARGET: ${intent}

DOMAIN INSIGHTS: ${enrichment.technicalConsiderations.slice(0, 3).join(', ')}

ARCHITECTURE REQUIREMENTS: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

USER FLOW CONSIDERATIONS: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}

TASK SEQUENCE:
1. Map Current Structure: Document existing components and their relationships
2. Identify Pain Points: Find areas with code duplication or complex logic  
3. Plan Incremental Changes: Break refactoring into small, safe steps
4. Test Coverage: Ensure existing functionality is well-tested

IMPLEMENTATION APPROACH:
1. Component Separation: Extract reusable components from large files
2. Hook Extraction: Move complex logic to custom hooks
3. Type Safety: Improve TypeScript usage and type definitions
4. File Organization: Group related components and utilities

CONSTRAINTS:
1. ZERO FUNCTIONALITY CHANGES: App must work identically after refactoring
2. Incremental Steps: Make small changes and verify each step
3. Backup Strategy: Maintain clear rollback options
4. Single Responsibility: Each component should have one clear purpose
5. Performance: Use React.memo and useMemo where appropriate

${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

GOAL: Intelligent refactoring based on patterns proven effective for this application type.`,

    debugging: () => `CONTEXT: Lovable Debugging Specialist with domain expertise in ${projectType || 'application'} systems.

ISSUE DESCRIPTION: ${intent}

DOMAIN INSIGHTS: ${enrichment.technicalConsiderations.slice(0, 3).join(', ')}

USER IMPACT: ${enrichment.targetAudienceAnalysis} Users expect ${enrichment.competitiveInsights.slice(0, 2).map(insight => insight.toLowerCase()).join(' and ')}.

DEBUGGING PROTOCOL:
1. Reproduce Issue: Identify exact steps to trigger the problem
2. Environment Check: Verify browser, device, and network conditions
3. Console Analysis: Review browser developer tools for errors
4. Recent Changes: Identify what was modified before the issue appeared

DOMAIN-SPECIFIC ANALYSIS:
Check if issue affects: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}

ROOT CAUSE ANALYSIS:
1. Component Tree: Trace error through React component hierarchy
2. State Flow: Check how data flows through the application
3. API Calls: Verify network requests and responses
4. Dependencies: Check for version conflicts or missing packages

SOLUTION STRATEGY:
1. Minimal Fix: Apply smallest change that resolves the issue
2. Error Boundaries: Add proper error handling where needed
3. Validation: Improve input validation and edge case handling
4. Testing: Ensure fix doesn't introduce new problems

PREVENTION MEASURES:
1. Error Logging: Add comprehensive error tracking
2. Input Validation: Strengthen data validation at boundaries
3. Fallback UI: Implement graceful degradation for errors
4. Monitoring: Set up alerts for similar future issues

${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

GOAL: Systematic debugging with domain expertise guiding the approach.`,

    feature_addition: () => `CONTEXT: Lovable AI Builder with ${projectType || 'application'} domain expertise implementing feature for "${projectName}".

DOMAIN INTELLIGENCE: ${enrichment.domainInsights.slice(0, 2).join(' and ')}.

USER PROFILE: ${enrichment.targetAudienceAnalysis}

MARKET STANDARDS: ${enrichment.marketContext}

TASK: ${intent}

TECHNICAL APPROACH:
1. Apply domain patterns: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}
2. Implement proven flows: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
3. Use effective patterns: ${enrichment.designPatterns.slice(0, 2).join(', ')}
4. Leverage insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

IMPLEMENTATION PROTOCOL:
1. Create core components with single responsibility
2. Integrate with existing app architecture
3. Apply consistent design system (Tailwind + shadcn/ui)
4. Implement proper error boundaries and validation
5. Add responsive mobile-first design
6. Test edge cases and user scenarios

CONSTRAINTS:
1. Tech stack: React, TypeScript, Tailwind CSS, Supabase integration
2. Performance: p95 load <1.8s, backend response <100ms
3. Accessibility: WCAG 2.1 AA compliance
4. Mobile-first responsive design
5. Security: proper data validation and sanitization

${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

GOAL: Production-ready feature that integrates seamlessly with ${projectName} while implementing research-backed patterns proven effective for this app category.`,

    vague_ambiguous: () => `CONTEXT: Lovable Project Discovery Session using insights about successful apps in this domain.

INITIAL IDEA: "${intent}"

DOMAIN INSIGHTS: ${enrichment.domainInsights.slice(0, 3).join(', ')}

MARKET CONTEXT: ${enrichment.marketContext}

DISCOVERY PROTOCOL:

CORE PURPOSE ANALYSIS:
1. What problem does this solve? What frustration or need will your app address?
2. Who is your target user? ${enrichment.targetAudienceAnalysis}
3. What's your main goal? Is this for personal use, business, or sharing with others?

APP EXPERIENCE REQUIREMENTS:
4. How should it feel? Professional, playful, minimal, feature-rich?
5. Key actions? Consider these proven patterns: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
6. Device priority? Mobile-first, desktop-focused, or equal priority?

SCOPE AND TIMELINE:
7. MVP vs Full Vision? What's essential for the first version?
8. Inspiration? Any apps or websites you admire?
9. Special requirements? ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}

NEXT STEPS:
Once you answer these questions, I'll create a detailed Lovable app prompt with:
1. Complete project specification informed by domain research
2. Technical architecture recommendations based on proven patterns
3. Step-by-step development plan
4. UI/UX guidelines tailored to your vision and user expectations

${context ? `CONTEXT PROVIDED: ${context}` : ''}

RESEARCH CONFIDENCE: ${enrichment.confidence}/10 - These insights come from analyzing successful patterns in your domain.

What aspects of your idea are you most excited about?`
  };

  const templateFunction = templates[primary];
  return templateFunction ? templateFunction() : templates.new_project_scaffolding();
}

// Extract app name from user intent using pattern matching
function extractAppNameFromIntent(intent: string): string | null {
  // Extract explicit app names
  const explicitPatterns = [
    /app\s+called\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /named\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /(?:make|build|create)\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?\s+app/i
  ];
  
  for (const pattern of explicitPatterns) {
    const match = intent.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      return match[1].trim();
    }
  }
  
  return null; // Let generateProjectName handle it based on project type
}

// Simple enhanced template for robust generation
function generateSimpleProjectTemplate(
  projectName: string, 
  projectType: string,
  context: string, 
  intent: string, 
  enrichment: ContextEnrichment
): string {
  return `CONTEXT: Lovable Development Environment. Building ${projectType.replace('_', ' ')} application named "${projectName}".

TASK: ${intent}

DATABASE REQUIREMENTS:
1. ${enrichment.technicalConsiderations[0] || 'Standard user authentication and data storage'}
2. ${enrichment.technicalConsiderations[1] || 'Efficient data retrieval and updates'}
3. Supabase integration with Row Level Security policies

AUTHENTICATION SYSTEM:
1. Supabase Auth implementation with email/password
2. Protected routes and user session management
3. ${enrichment.domainInsights[0] || 'Secure user data handling'}

CORE FEATURES:
1. ${enrichment.userFlowSuggestions[0] || 'Main application functionality'}
2. ${enrichment.userFlowSuggestions[1] || 'User interaction patterns'}
3. ${enrichment.designPatterns[0] || 'Modern UI components'}

TECHNICAL IMPLEMENTATION:
1. React TypeScript component architecture
2. Tailwind CSS with shadcn/ui component library
3. Responsive mobile-first design approach
4. ${enrichment.technicalConsiderations[0] || 'Performance optimized code structure'}

BUILD SEQUENCE:
1. Initialize project structure and authentication
2. Design database schema and setup Supabase tables
3. Create core UI components and navigation
4. Implement main application features
5. Add data validation and error handling
6. Test functionality and optimize performance
7. Deploy MVP with realistic test data

CONSTRAINTS:
- Tech Stack: React, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- Performance: Sub-2s load times, responsive design
- Security: Input validation, secure authentication
- Accessibility: WCAG 2.1 AA compliance

${context ? `CONTEXT: ${context}` : ''}

DELIVERABLE: Fully functional ${projectName} MVP with complete feature set and database integration.`;
}