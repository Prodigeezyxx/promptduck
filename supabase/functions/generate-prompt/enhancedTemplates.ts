
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
      return generateInstructionalProjectTemplate(projectName, projectType || 'general_app', context, intent, enrichment);
    },

    ui_design_modification: () => `I need you to enhance the visual design of ${projectName} with these specific requirements:

**Your Mission:** ${intent}

**What I know about this domain:** ${enrichment.domainInsights.slice(0, 2).join('. ')}.

**Target users expect:** ${enrichment.targetAudienceAnalysis}

**Market requirements:** ${enrichment.marketContext}

**Here's what you need to do:**
1. Keep all existing functionality intact - this is purely visual enhancement
2. Apply mobile-first responsive design principles
3. Ensure WCAG 2.1 AA accessibility compliance
4. Use our design system (Tailwind + shadcn/ui) consistently
5. Maintain sub-1.8s load times
6. Implement these proven patterns: ${enrichment.designPatterns.slice(0, 2).join(', ')}
7. Focus on these user flows: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
8. Consider these technical aspects: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}
9. Apply competitive insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

**Implementation approach:**
- Use semantic design tokens instead of hardcoded values
- Add smooth transitions and delightful micro-interactions  
- Ensure 44px minimum touch targets for mobile
- Test across all breakpoints

${context ? `**Additional context:** ${context}` : ''}

**Goal:** Transform ${projectName} into a visually stunning application that users love to interact with, while maintaining all current functionality.`,

    code_refactoring: () => `I need you to refactor the codebase for ${projectName} to make it cleaner and more maintainable.

**Your task:** ${intent}

**Domain context:** ${enrichment.domainInsights.slice(0, 2).join('. ')}.

**Technical priorities:** ${enrichment.technicalConsiderations.slice(0, 3).join(', ')}

**Architecture considerations:** ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

**Critical user flows to preserve:** ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}

**Here's your refactoring plan:**
1. **Map the current structure** - Document existing components and relationships
2. **Identify pain points** - Find code duplication and overly complex logic
3. **Plan incremental changes** - Break refactoring into safe, testable steps
4. **Maintain test coverage** - Ensure existing functionality is protected

**Your refactoring approach:**
- Extract reusable components from large files
- Move complex logic to custom hooks
- Improve TypeScript usage and type safety
- Organize files by feature/domain
- Use React.memo and useMemo for performance where appropriate

**Non-negotiable constraints:**
- Zero functionality changes - the app must work identically
- Make incremental steps and verify each one
- Keep rollback options clear
- Each component should have a single responsibility
- Maintain current performance characteristics

${context ? `**Additional context:** ${context}` : ''}

**Outcome:** A cleaner, more maintainable ${projectName} codebase that's easier to work with and extend.`,

    debugging: () => `Help me debug this issue in ${projectName}:

**The problem:** ${intent}

**Domain expertise needed:** ${enrichment.technicalConsiderations.slice(0, 3).join(', ')}

**User impact:** ${enrichment.targetAudienceAnalysis} Users are experiencing issues with ${enrichment.competitiveInsights.slice(0, 2).map(insight => insight.toLowerCase()).join(' and ')}.

**Your debugging approach:**
1. **Reproduce the issue** - Find exact steps to trigger the problem
2. **Check the environment** - Verify browser, device, and network conditions  
3. **Analyze console output** - Review browser dev tools for errors
4. **Trace recent changes** - Identify what was modified before the issue

**Focus areas for this domain:**
Check if the issue affects: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}

**Your investigation steps:**
1. **Component tree analysis** - Trace error through React hierarchy
2. **State flow tracking** - Check how data moves through the app
3. **API verification** - Verify network requests and responses
4. **Dependency check** - Look for version conflicts or missing packages

**Your solution strategy:**
- Apply the minimal fix that resolves the core issue
- Add proper error boundaries where needed
- Strengthen input validation and edge case handling
- Ensure the fix doesn't introduce new problems

**Prevention measures to implement:**
- Add comprehensive error logging
- Strengthen data validation at all boundaries
- Implement graceful degradation for errors
- Set up monitoring for similar future issues

${context ? `**Additional context:** ${context}` : ''}

**Goal:** Get ${projectName} working perfectly again with systematic debugging and robust error prevention.`,

    feature_addition: () => `I want you to add a new feature to ${projectName}:

**Build this:** ${intent}

**Domain intelligence:** ${enrichment.domainInsights.slice(0, 2).join('. ')}.

**Your users:** ${enrichment.targetAudienceAnalysis}

**Market expectations:** ${enrichment.marketContext}

**Your implementation strategy:**
1. Apply these domain patterns: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}
2. Implement these proven flows: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
3. Use these effective patterns: ${enrichment.designPatterns.slice(0, 2).join(', ')}
4. Leverage these insights: ${enrichment.competitiveInsights.slice(0, 2).join(', ')}

**Your development approach:**
1. Create focused components with single responsibilities
2. Integrate seamlessly with existing architecture
3. Apply consistent design system (Tailwind + shadcn/ui)
4. Add proper error boundaries and validation
5. Implement responsive mobile-first design
6. Test edge cases and user scenarios thoroughly

**Technical requirements:**
- Tech stack: React, TypeScript, Tailwind CSS, Supabase
- Performance: Sub-1.8s load times, <100ms backend response
- Accessibility: Full WCAG 2.1 AA compliance
- Mobile-first responsive design
- Security: Proper data validation and sanitization

${context ? `**Additional context:** ${context}` : ''}

**Deliverable:** A production-ready feature that integrates perfectly with ${projectName} and delights users with research-backed patterns proven effective in this domain.`,

    vague_ambiguous: () => `Let's turn your idea into an amazing Lovable app! I need to understand your vision better.

**Your initial idea:** "${intent}"

**What I've learned about successful apps in this space:** ${enrichment.domainInsights.slice(0, 3).join(', ')}

**Market context:** ${enrichment.marketContext}

**Let's clarify your vision together:**

**🎯 Purpose & Problem**
- What specific problem will your app solve?
- What frustration or need are you addressing?
- Who exactly will use this? ${enrichment.targetAudienceAnalysis}

**✨ Experience & Feel**
- How should using your app feel? (Professional, playful, minimal, feature-rich?)
- What are the key things users should be able to do?
- Consider these proven patterns: ${enrichment.userFlowSuggestions.slice(0, 2).join(', ')}
- Will this be mobile-first, desktop-focused, or equal priority?

**🚀 Scope & Vision**  
- What's essential for your first version (MVP)?
- What's your bigger vision down the road?
- Any apps or websites you admire as inspiration?
- Special considerations: ${enrichment.technicalConsiderations.slice(0, 2).join(', ')}

**Once you share these details, I'll create:**
1. A complete project specification informed by domain research
2. Technical architecture recommendations using proven patterns  
3. Step-by-step development plan
4. UI/UX guidelines tailored to your vision and user expectations

${context ? `**Context you've provided:** ${context}` : ''}

**My research confidence:** ${enrichment.confidence}/10 - These insights come from analyzing successful patterns in your domain.

What aspect of your idea excites you most? Let's build something amazing together!`
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

// Instructional template for robust generation
function generateInstructionalProjectTemplate(
  projectName: string, 
  projectType: string,
  context: string, 
  intent: string, 
  enrichment: ContextEnrichment
): string {
  return `Build me a ${projectType.replace('_', ' ')} application called "${projectName}".

**What I want:** ${intent}

**What you should know about this domain:** ${enrichment.domainInsights.slice(0, 2).join('. ')}.

**Target users:** ${enrichment.targetAudienceAnalysis}

**Here's what I need you to build:**

**🗄️ Database & Backend**
1. Set up ${enrichment.technicalConsiderations[0] || 'user authentication and data storage'}
2. Implement ${enrichment.technicalConsiderations[1] || 'efficient data retrieval and updates'}
3. Configure Supabase with Row Level Security policies
4. Design the database schema for ${projectName}

**🔐 Authentication System**
1. Implement Supabase Auth with email/password
2. Create protected routes and session management
3. Handle ${enrichment.domainInsights[0] || 'secure user data management'}

**⚡ Core Features**
1. Build ${enrichment.userFlowSuggestions[0] || 'the main application functionality'}
2. Implement ${enrichment.userFlowSuggestions[1] || 'key user interaction patterns'}
3. Create ${enrichment.designPatterns[0] || 'modern UI components'}

**🎨 Technical Implementation**
1. Use React TypeScript component architecture
2. Style with Tailwind CSS and shadcn/ui component library
3. Implement responsive mobile-first design
4. Focus on ${enrichment.technicalConsiderations[0] || 'performance optimized code structure'}

**🏗️ Build it in this order:**
1. Initialize project structure and authentication system
2. Design and setup Supabase database tables
3. Create core UI components and navigation
4. Implement the main application features
5. Add comprehensive data validation and error handling
6. Test all functionality and optimize performance
7. Deploy MVP with realistic test data

**📋 Requirements:**
- Tech Stack: React, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- Performance: Under 2-second load times, fully responsive
- Security: Input validation, secure authentication
- Accessibility: WCAG 2.1 AA compliance

${context ? `**Additional context:** ${context}` : ''}

**Goal:** Deliver a fully functional ${projectName} MVP that users can immediately start using, with all features working and a complete database setup.`;
}
