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

    ui_design_modification: () => `# 🎨 **Lovable UI Enhancement Prompt** (AI-Enhanced)

Transform your application's visual design with research-backed improvements tailored to your specific use case.

## **Current Task**
${intent}

## **Domain-Specific Design Insights**
${enrichment.domainInsights.map(insight => `• ${insight}`).join('\n')}

## **Target Audience Context**
${enrichment.targetAudienceAnalysis}

**Market Expectations:** ${enrichment.marketContext}

## **Design Enhancement Strategy**

### **Industry-Specific Patterns**
${enrichment.designPatterns.map(pattern => `• ${pattern}`).join('\n')}

### **User Experience Focus**
${enrichment.userFlowSuggestions.map(suggestion => `• ${suggestion}`).join('\n')}

### **Technical Implementation**
${enrichment.technicalConsiderations.map(consideration => `• Design consideration: ${consideration}`).join('\n')}

### **Competitive Best Practices**
${enrichment.competitiveInsights.map(insight => `• ${insight}`).join('\n')}

### **Implementation Guidelines**
• **Mobile-First Approach**: Design for mobile, then enhance for desktop
• **Accessibility**: Ensure WCAG 2.1 AA compliance
• **Performance**: Maintain fast load times and smooth animations
• **Consistency**: Use design tokens for colors, spacing, and typography

### **Safety Constraints**
⚠️ **CRITICAL**: Preserve all existing functionality and data flows
⚠️ **Visual Only**: Make no changes to business logic or state management
⚠️ **Testing**: Verify the app works exactly as before after changes

${context ? `\n### **Additional Context:**\n${context}` : ''}

---

Ready to enhance your app with intelligent, research-backed design improvements!`,

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

    feature_addition: () => `# ⚡ **Lovable Feature Implementation** (AI-Enhanced)

Add new functionality with insights from successful apps in your domain.

## **Feature Request**
${intent}

## **Domain Intelligence**
${enrichment.domainInsights.map(insight => `• ${insight}`).join('\n')}

## **User Context & Expectations**
**Target Users:** ${enrichment.targetAudienceAnalysis}

**Market Context:** ${enrichment.marketContext}

## **Implementation Strategy**

### **Feature Planning**
• **User Story**: Define who needs this feature and why
• **Acceptance Criteria**: Establish what "done" looks like
• **Integration Points**: Identify how this connects to existing features
• **Data Requirements**: Determine what data needs to be stored or retrieved

### **Technical Approach (Domain-Informed)**
${enrichment.technicalConsiderations.map(consideration => `• Consider: ${consideration}`).join('\n')}

### **User Experience (Research-Backed)**
${enrichment.userFlowSuggestions.map(suggestion => `• Implement: ${suggestion}`).join('\n')}

### **Design Patterns (Proven Effective)**
${enrichment.designPatterns.map(pattern => `• Apply: ${pattern}`).join('\n')}

### **Competitive Insights**
${enrichment.competitiveInsights.map(insight => `• Learn from: ${insight}`).join('\n')}

### **Implementation Steps**
1. **Create Core Components**: Build basic functionality first
2. **Add Styling**: Apply consistent design system
3. **Integrate with Existing**: Connect to current app structure
4. **Test Edge Cases**: Verify behavior in various scenarios
5. **Polish and Optimize**: Add animations and performance improvements

${context ? `\n### **Additional Context:**\n${context}` : ''}

---

Ready to build this feature with intelligent insights from the domain!`,

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
  // Get base description from project type
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
You are Lovable's AI Builder with deep domain expertise. Create an MVP for ${appDescription} named "${projectName}."

**Domain Intelligence:**
${enrichment.domainInsights.map(insight => `• ${insight}`).join('\n')}

**Target Users:** ${enrichment.targetAudienceAnalysis}

**Market Context:** ${enrichment.marketContext}

**Task**
1. Generate the project skeleton for ${projectName}.
2. Implement research-backed core features:
   • Email-based sign-up / login (Supabase auth).
   • Onboarding flow collecting user preferences and profile information.
   ${enrichment.userFlowSuggestions.map(suggestion => `   • ${suggestion}.`).join('\n')}
3. Apply proven design patterns:
   ${enrichment.designPatterns.map(pattern => `   • ${pattern}.`).join('\n')}
4. Seed the database with 10 realistic ${projectName} user profiles and test data.

**Guidelines (Domain-Informed)**
• Tech stack: Next.js 14 (App Router), React Server Components, TypeScript, Prisma ORM, Supabase (auth + Postgres + realtime), Tailwind CSS, shadcn/ui.
• Mobile-first responsive layout; maintain desktop compatibility.
• Apply competitive insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}.
• Technical considerations: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}.
• Use CLEAR code comments and clean file structure.
• All code must pass ESLint + Prettier validation.

**Constraints**
• Use only open-source or free-tier libraries—no paid APIs or proprietary SDKs.
• Initial build ≤ 60 files; p95 page load < 1.8 s on 3G; backend p95 response < 100 ms.
• WCAG-AA accessibility compliance (semantic HTML, ARIA labels, focus states).
• Store user data securely with proper privacy controls.

**Output**
Return exactly these sections:
1. ## Plan – numbered build plan (max 10 steps) informed by domain research.
2. ## Schema – Prisma schema + Supabase SQL optimized for this app type.
3. ## Components – file tree showing pages, components, utils with domain-specific architecture.
4. ## SeedScript – script to load realistic ${projectName} data with proper variety.
5. ## README – local setup + deployment instructions.

**Goal**
Deliver a production-ready ${projectName} MVP that compiles, runs seed script, passes all tests, and provides an exceptional user experience informed by domain expertise and competitive analysis.

${context ? `\n**Additional Context**\n${context}` : ''}

**Research Confidence:** ${enrichment.confidence}/10

**Ready to build ${projectName}?** Let's create something amazing with intelligent, research-backed features that users will love!`;
}