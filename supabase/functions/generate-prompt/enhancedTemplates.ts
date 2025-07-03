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
  const { primary, projectType, complexity, keywords } = analysis;
  
  // Smart app name extraction
  const extractedAppName = extractAppNameFromIntent(intent);
  const projectName = extractedAppName || generateProjectName(intent, projectType || 'general_app');

  const templates = {
    new_project_scaffolding: () => {
      return generateEnhancedRoleTaskConstraintsFormatGoalTemplate(
        projectName, 
        projectType || 'general_app',
        context, 
        intent, 
        enrichment
      );
    },

    ui_design_modification: () => `**Context (AI-Enhanced)**
You are Lovable's AI Builder with domain expertise in ${projectType || 'application'} interfaces. Execute visual design improvements for "${projectName}" with market intelligence.

**Domain Intelligence:** ${enrichment.domainInsights.slice(0, 2).join('; ')}.

**Target Users:** ${enrichment.targetAudienceAnalysis}

**Market Standards:** ${enrichment.marketContext}

**Task**
${intent}

Apply proven patterns: ${enrichment.designPatterns.slice(0, 2).join(', ')}.
Implement user flows: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}.
Technical requirements: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}.

**Constraints**
• PRESERVE existing functionality - visual changes only
• Mobile-first responsive design with desktop compatibility  
• WCAG 2.1 AA compliance requirements
• Design system consistency using Tailwind + shadcn/ui
• Performance: maintain <1.8s p95 load times
• Apply competitive insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

**Guidelines**
• Use semantic design tokens, avoid hardcoded colors
• Implement smooth transitions and micro-interactions
• Optimize touch targets for mobile (44px minimum)
• Test across breakpoints and validate accessibility

${context ? `\n**Additional Context**\n${context}` : ''}

**Goal**
Deliver visually enhanced ${projectName} that maintains functionality while implementing research-backed design improvements proven effective for this app category.`,

    code_refactoring: () => `# 🔧 **Lovable Code Refactoring Plan** (AI-Enhanced)

Improve your codebase with patterns and practices proven effective for this type of application.

## **Refactoring Target**
${intent}

## **Domain-Specific Technical Insights**
${enrichment.technicalConsiderations.map(consideration => `• ${consideration}`).join('\n')}

## **Architecture Recommendations**
Based on analysis of successful apps in this domain:
${enrichment.competitiveInsights.map(insight => `• Technical insight: ${insight}`).join('\n')}

## **User-Centric Refactoring**
Consider these user needs when restructuring:
${enrichment.userFlowSuggestions.map(suggestion => `• Structure should support: ${suggestion}`).join('\n')}

## **Refactoring Strategy**

### **Analysis Phase** (Do This First)
1. **Map Current Structure**: Document existing components and their relationships
2. **Identify Pain Points**: Find areas with code duplication or complex logic
3. **Plan Incremental Changes**: Break refactoring into small, safe steps
4. **Test Coverage**: Ensure existing functionality is well-tested

### **Implementation Approach**
• **Component Separation**: Extract reusable components from large files
• **Hook Extraction**: Move complex logic to custom hooks
• **Type Safety**: Improve TypeScript usage and type definitions
• **File Organization**: Group related components and utilities

### **Best Practices**
• **Single Responsibility**: Each component should have one clear purpose
• **Reusability**: Create components that can be used across the app
• **Performance**: Use React.memo and useMemo where appropriate
• **Readability**: Clear naming conventions and proper documentation

### **Safety Protocol**
🔒 **ZERO FUNCTIONALITY CHANGES**: The app must work identically after refactoring
🔒 **Incremental Steps**: Make small changes and verify each step
🔒 **Backup Strategy**: Maintain clear rollback options

${context ? `\n### **Additional Context:**\n${context}` : ''}

---

Let's refactor with intelligent insights about what works for this type of application.`,

    debugging: () => `# 🐛 **Lovable Debugging Workflow** (AI-Enhanced)

Systematic debugging approach informed by common issues in this domain.

## **Issue Description**
${intent}

## **Domain-Specific Debug Insights**
Common challenges for this type of application:
${enrichment.technicalConsiderations.map(consideration => `• Watch for: ${consideration}`).join('\n')}

## **User Impact Context**
${enrichment.targetAudienceAnalysis}

This means users expect: ${enrichment.competitiveInsights.slice(0, 2).map(insight => insight.toLowerCase()).join(' and ')}.

## **Debugging Methodology**

### **Step 1: Information Gathering**
• **Reproduce the Issue**: Identify exact steps to trigger the problem
• **Environment Check**: Verify browser, device, and network conditions
• **Console Analysis**: Review browser developer tools for errors
• **Recent Changes**: Identify what was modified before the issue appeared

### **Step 2: Domain-Specific Analysis**
${enrichment.userFlowSuggestions.map(suggestion => `• Check if issue affects: ${suggestion}`).join('\n')}

### **Step 3: Root Cause Analysis**
• **Component Tree**: Trace the error through the React component hierarchy
• **State Flow**: Check how data flows through the application
• **API Calls**: Verify network requests and responses
• **Dependencies**: Check for version conflicts or missing packages

### **Step 4: Solution Strategy**
• **Minimal Fix**: Apply the smallest change that resolves the issue
• **Error Boundaries**: Add proper error handling where needed
• **Validation**: Improve input validation and edge case handling
• **Testing**: Ensure the fix doesn't introduce new problems

### **Prevention Measures**
• **Error Logging**: Add comprehensive error tracking
• **Input Validation**: Strengthen data validation at boundaries
• **Fallback UI**: Implement graceful degradation for errors
• **Monitoring**: Set up alerts for similar future issues

${context ? `\n### **Additional Context:**\n${context}` : ''}

---

Let's debug this systematically with domain expertise guiding our approach.`,

    feature_addition: () => `**Context (AI-Enhanced)**
You are Lovable's AI Builder with ${projectType || 'application'} domain expertise. Implement feature for "${projectName}" using proven market patterns.

**Domain Intelligence:** ${enrichment.domainInsights.slice(0, 2).join('; ')}.

**User Profile:** ${enrichment.targetAudienceAnalysis}

**Market Standards:** ${enrichment.marketContext}

**Task**
${intent}

**Technical Approach**
Apply domain patterns: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}.
Implement proven flows: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}.
Use effective patterns: ${enrichment.designPatterns.slice(0, 2).join(', ')}.
Leverage insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}.

**Implementation Protocol**
1. Create core components with single responsibility
2. Integrate with existing app architecture  
3. Apply consistent design system (Tailwind + shadcn/ui)
4. Implement proper error boundaries and validation
5. Add responsive mobile-first design
6. Test edge cases and user scenarios

**Constraints**
• Tech stack: React, TypeScript, Tailwind CSS, Supabase integration
• Performance: <1.8s p95 load, <100ms backend response
• Accessibility: WCAG 2.1 AA compliance
• Mobile-first responsive design
• Security: proper data validation and sanitization

${context ? `\n**Additional Context**\n${context}` : ''}

**Goal**
Deliver production-ready feature that integrates seamlessly with ${projectName} while implementing research-backed patterns proven effective for this app category.`,

    vague_ambiguous: () => `# 🤔 **Lovable Project Discovery Session** (AI-Enhanced)

Let's transform your idea using insights about what makes apps successful in this space.

## **Your Initial Idea**
"${intent}"

## **Domain Insights We've Discovered**
${enrichment.domainInsights.map(insight => `• ${insight}`).join('\n')}

## **Market Context**
${enrichment.marketContext}

## **Discovery Questions**

To help create the perfect Lovable app for you, I need to understand your vision better:

### **🎯 Core Purpose**
1. **What problem does this solve?** What frustration or need will your app address?
2. **Who is your target user?** ${enrichment.targetAudienceAnalysis}
3. **What's your main goal?** Is this for personal use, business, or sharing with others?

### **📱 App Experience**
4. **How should it feel?** Professional, playful, minimal, feature-rich?
5. **Key actions?** Consider these proven patterns: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
6. **Device priority?** Mobile-first, desktop-focused, or equal priority?

### **🚀 Scope & Timeline**
7. **MVP vs Full Vision?** What's essential for the first version?
8. **Inspiration?** Any apps or websites you admire?
9. **Special requirements?** ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}

## **Next Steps**
Once you answer a few of these questions, I'll create a detailed Lovable app prompt with:
• Complete project specification informed by domain research
• Technical architecture recommendations based on proven patterns
• Step-by-step development plan
• UI/UX guidelines tailored to your vision and user expectations

${context ? `\n### **Context You've Provided:**\n${context}` : ''}

---

**Research Confidence:** ${enrichment.confidence}/10 - These insights come from analyzing successful patterns in your domain.

What aspects of your idea are you most excited about?`
  };

  const templateFunction = templates[primary];
  return templateFunction ? templateFunction() : templates.new_project_scaffolding();
}

// Extract app name from user intent using pattern matching
function extractAppNameFromIntent(intent: string): string | null {
  const patterns = [
    /called\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /named\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /app\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /for\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i
  ];
  
  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Generate AI-enhanced R-T-C-F-G structured template
function generateEnhancedRoleTaskConstraintsFormatGoalTemplate(
  projectName: string, 
  projectType: string,
  context: string, 
  intent: string, 
  enrichment: ContextEnrichment
): string {
  const baseDescriptions = {
    'messaging_app': 'a modern messaging and communication platform',
    'e_commerce': 'a comprehensive e-commerce and shopping platform',
    'government_services': 'a streamlined government services and application platform',
    'travel_planning': 'a comprehensive travel planning and booking platform',
    'productivity': 'a productivity and task management application',
    'creative': 'a creative platform for artists and content creators',
    'health': 'a comprehensive mental health and wellness platform',
    'dating_social': 'a modern dating and social connection platform'
  };

  const appDescription = baseDescriptions[projectType] || 'a modern web application';

  return `**Context (AI-Enhanced)**
You are Lovable's AI Builder with deep ${projectType || 'application'} domain expertise. Create an MVP for ${appDescription} named "${projectName}."

**Domain Intelligence:** ${enrichment.domainInsights.slice(0, 3).join('; ')}.

**Target Users:** ${enrichment.targetAudienceAnalysis}

**Market Standards:** ${enrichment.marketContext}

**Task**
1. Generate project skeleton for ${projectName}
2. Implement core features with domain-informed patterns:
   • Email-based auth (Supabase) with onboarding flow
   • ${enrichment.userFlowSuggestions.slice(0, 3).join(', ')}
   • ${enrichment.designPatterns.slice(0, 2).join(', ')}
3. Apply competitive insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}
4. Seed database with 10 realistic user profiles and test data

**Constraints (Domain-Optimized)**
• Tech stack: React, TypeScript, Tailwind CSS, shadcn/ui, Supabase (auth + Postgres + realtime)
• Technical requirements: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}
• Performance: p95 page load <1.8s on 3G, backend p95 response <100ms
• Build: ≤60 files, open-source libraries only
• Accessibility: WCAG-AA compliance (semantic HTML, ARIA, focus states)
• Security: proper data validation, RLS policies, privacy controls

**Output Format**
1. Plan: Numbered build steps (max 10) with domain research integration
2. Schema: Optimized Prisma/Supabase SQL for this app type  
3. Components: File tree with domain-specific architecture
4. SeedScript: Realistic ${projectName} test data with proper variety
5. README: Setup and deployment instructions

**Goal**
Production-ready ${projectName} MVP with exceptional UX informed by domain expertise and competitive analysis. Must compile, pass tests, and run seed script successfully.

${context ? `\n**Additional Context**\n${context}` : ''}

**Research Confidence:** ${enrichment.confidence}/10 - Ready to build ${projectName} with intelligent, market-proven features.`;
}