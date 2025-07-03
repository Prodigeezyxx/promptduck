import { generateProjectName } from './projectNames.ts';

// Generate sophisticated Lovable templates
export function generateLovableTemplate(intent: string, context: string, analysis: any): string {
  const { primary, projectType, complexity, keywords } = analysis;
  const projectName = generateProjectName(intent, projectType || 'general_app');

  const templates = {
    new_project_scaffolding: () => {
      const appTypeDescriptions = {
        'messaging_app': {
          description: 'a modern messaging and communication platform',
          audience: '• Users seeking meaningful conversations\n  • Remote teams and communities\n  • Privacy-conscious communicators',
          features: [
            'Real-time messaging with typing indicators',
            'Thread organization and conversation history', 
            'Rich media sharing (images, files, links)',
            'User presence and status indicators',
            'Search and conversation management'
          ],
          designNotes: 'Chat bubbles, smooth animations, and intuitive message flows'
        },
        'e_commerce': {
          description: 'a comprehensive e-commerce and shopping platform',
          audience: '• Online shoppers seeking quality products\n  • Small to medium business owners\n  • Users who value seamless shopping experiences',
          features: [
            'Product catalog with search and filtering',
            'Shopping cart and checkout flow',
            'User accounts and order history',
            'Payment integration and security',
            'Product reviews and ratings system'
          ],
          designNotes: 'Clean product displays, intuitive navigation, and trustworthy checkout'
        },
        'government_services': {
          description: 'a streamlined government services and application platform',
          audience: '• Citizens navigating complex government processes\n  • Legal professionals and consultants\n  • International travelers and immigrants',
          features: [
            'Step-by-step application guidance with smart checklists',
            'Document upload and management system',
            'AI-powered form assistance and validation',
            'Progress tracking and deadline reminders',
            'Multi-language support and accessibility features'
          ],
          designNotes: 'Professional, trustworthy design with clear progress indicators and helpful guidance'
        },
        'travel_planning': {
          description: 'a comprehensive travel planning and booking platform',
          audience: '• Adventure seekers and frequent travelers\n  • Business travelers needing efficiency\n  • Families planning vacations together',
          features: [
            'Trip planning with itinerary management',
            'Flight and hotel booking integration',
            'Expense tracking and budget management',
            'Travel document organization',
            'Local recommendations and discovery'
          ],
          designNotes: 'Inspiring visuals, intuitive booking flows, and mobile-optimized interfaces'
        },
        'productivity': {
          description: 'a productivity and task management application',
          audience: '• Busy professionals and entrepreneurs\n  • Students and academic users\n  • Teams requiring coordination and planning',
          features: [
            'Task creation and organization system',
            'Project management and collaboration',
            'Calendar integration and scheduling',
            'Progress tracking and analytics',
            'Team coordination and sharing'
          ],
          designNotes: 'Clean interfaces, clear hierarchy, and efficient workflows'
        },
        'creative': {
          description: 'a creative platform for artists and content creators',
          audience: '• Artists and creative professionals\n  • Content creators and influencers\n  • Users seeking inspiration and community',
          features: [
            'Portfolio creation and showcasing',
            'Creative tools and editing capabilities',
            'Community features and collaboration',
            'Content organization and categorization',
            'Social sharing and engagement'
          ],
          designNotes: 'Visual focus, inspiring layouts, and creative freedom'
        }
      };

      const appInfo = appTypeDescriptions[projectType] || {
        description: 'a modern web application',
        audience: '• Target users who need this solution\n  • People seeking efficiency and quality\n  • Users who value great experiences',
        features: [
          'Core functionality tailored to user needs',
          'Intuitive user interface and navigation',
          'Responsive design for all devices',
          'User authentication and profiles',
          'Data management and persistence'
        ],
        designNotes: 'Clean, modern design with excellent user experience'
      };

      return `### 💡 **Lovable App Prompt: ${projectName.toUpperCase()}**

I want to build **${appInfo.description}** that delivers an exceptional user experience. The app should feel **modern, intuitive, and performant**, optimized for both **web and mobile** platforms.

---

### **Project Name:**
${projectName}

---

### **Target Audience:**
${appInfo.audience}

---

### **Core Features and Pages:**

#### ✅ **Homepage / Landing**
• Clean, engaging welcome page with clear value proposition
• Call-to-action buttons for key user flows
• Mobile-responsive hero section and navigation

#### ✅ **Main Application Interface**
${appInfo.features.map(feature => `• ${feature}`).join('\n')}

#### ✅ **User Management**
• User registration and authentication
• Profile management and settings
• Account dashboard and preferences

#### ✅ **Data Management**
• Efficient data storage and retrieval
• Real-time updates where appropriate
• Export and backup capabilities

---

### **Tech Stack (Lovable Optimized):**
• **Frontend:** React + TypeScript + Tailwind CSS
• **UI Components:** shadcn/ui for consistent design
• **Backend & Storage:** Supabase for seamless integration
• **Authentication:** Supabase Auth with social login options
• **Deployment:** Automated through Lovable platform

---

### **Design Preferences:**
• **Typography:** Inter font family for readability
• **Color Scheme:**
  - Primary: Modern, accessible color palette
  - Accent: Complementary highlight colors
  - Backgrounds: Clean whites and subtle grays
• **Layout:** ${appInfo.designNotes}
• **Mobile-First:** Responsive design prioritizing mobile experience

---

### **Development Guidelines:**
• Component-driven architecture with reusable elements
• TypeScript for type safety and better development experience
• Tailwind CSS for rapid, consistent styling
• Accessibility-first approach (WCAG compliance)
• Performance optimization and lazy loading

---

### **Next Steps:**
1. **Start with core MVP features** - Focus on essential functionality first
2. **Design system setup** - Establish colors, typography, and component patterns  
3. **User authentication** - Implement secure login and registration
4. **Core feature development** - Build main application functionality iteratively
5. **Testing and polish** - Ensure smooth user experience across devices

${context ? `\n---\n\n### **Additional Context:**\n${context}` : ''}

Ready to start building? Let's begin with the homepage and core navigation structure!`;
    },

    ui_design_modification: () => `# 🎨 **Lovable UI Enhancement Prompt**

Transform your application's visual design with modern, user-centric improvements that enhance both aesthetics and usability.

## **Current Task**
${intent}

## **Design Enhancement Strategy**

### **Visual Improvements**
• Apply modern design principles with clean, minimal aesthetics
• Implement consistent spacing using Tailwind's spacing scale
• Use shadcn/ui components for professional, accessible interfaces
• Enhance typography hierarchy with proper font weights and sizes

### **User Experience Focus**
• Improve navigation clarity and user flow
• Add smooth transitions and micro-interactions
• Enhance mobile responsiveness across all breakpoints
• Optimize touch targets for mobile users

### **Implementation Guidelines**
• **Mobile-First Approach**: Design for mobile, then enhance for desktop
• **Accessibility**: Ensure WCAG 2.1 AA compliance
• **Performance**: Maintain fast load times and smooth animations
• **Consistency**: Use design tokens for colors, spacing, and typography

### **Safety Constraints**
⚠️ **CRITICAL**: Preserve all existing functionality and data flows
⚠️ **Visual Only**: Make no changes to business logic or state management
⚠️ **Testing**: Verify the app works exactly as before after changes

${context ? `\n### **Specific Context:**\n${context}` : ''}

---

Ready to enhance your app's visual appeal while maintaining its core functionality!`,

    code_refactoring: () => `# 🔧 **Lovable Code Refactoring Plan**

Improve your codebase structure and maintainability with systematic refactoring that preserves functionality.

## **Refactoring Target**
${intent}

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

Let's start by analyzing the current structure before making any changes.`,

    debugging: () => `# 🐛 **Lovable Debugging Workflow**

Systematic approach to identify and resolve the issue with evidence-based solutions.

## **Issue Description**
${intent}

## **Debugging Methodology**

### **Step 1: Information Gathering**
• **Reproduce the Issue**: Identify exact steps to trigger the problem
• **Environment Check**: Verify browser, device, and network conditions
• **Console Analysis**: Review browser developer tools for errors
• **Recent Changes**: Identify what was modified before the issue appeared

### **Step 2: Root Cause Analysis**
• **Component Tree**: Trace the error through the React component hierarchy
• **State Flow**: Check how data flows through the application
• **API Calls**: Verify network requests and responses
• **Dependencies**: Check for version conflicts or missing packages

### **Step 3: Solution Strategy**
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

Let's start by gathering information about this issue before applying any fixes.`,

    feature_addition: () => `# ⚡ **Lovable Feature Implementation**

Add new functionality to your application with proper integration and user experience considerations.

## **Feature Request**
${intent}

## **Implementation Strategy**

### **Feature Planning**
• **User Story**: Define who needs this feature and why
• **Acceptance Criteria**: Establish what "done" looks like
• **Integration Points**: Identify how this connects to existing features
• **Data Requirements**: Determine what data needs to be stored or retrieved

### **Technical Approach**
• **Component Design**: Plan reusable, focused components
• **State Management**: Choose appropriate state solution (local vs global)
• **API Integration**: Design clean interfaces for data operations
• **Error Handling**: Plan for edge cases and failure scenarios

### **User Experience**
• **Intuitive Interface**: Design that feels natural to existing users
• **Progressive Enhancement**: Core functionality works, then add polish
• **Mobile Optimization**: Ensure great experience on all devices
• **Accessibility**: Include proper ARIA labels and keyboard navigation

### **Implementation Steps**
1. **Create Core Components**: Build basic functionality first
2. **Add Styling**: Apply consistent design system
3. **Integrate with Existing**: Connect to current app structure
4. **Test Edge Cases**: Verify behavior in various scenarios
5. **Polish and Optimize**: Add animations and performance improvements

${context ? `\n### **Additional Context:**\n${context}` : ''}

---

Ready to build this feature with proper integration into your existing app!`,

    vague_ambiguous: () => `# 🤔 **Lovable Project Discovery Session**

Let's collaborate to transform your idea into a clear, actionable development plan.

## **Your Initial Idea**
"${intent}"

## **Discovery Questions**

To help create the perfect Lovable app for you, I need to understand your vision better:

### **🎯 Core Purpose**
1. **What problem does this solve?** What frustration or need will your app address?
2. **Who is your target user?** Describe the person who would love this app
3. **What's your main goal?** Is this for personal use, business, or sharing with others?

### **📱 App Experience**
4. **How should it feel?** Professional, playful, minimal, feature-rich?
5. **Key actions?** What are the 3 most important things users will do?
6. **Device priority?** Mobile-first, desktop-focused, or equal priority?

### **🚀 Scope & Timeline**
7. **MVP vs Full Vision?** What's essential for the first version?
8. **Inspiration?** Any apps or websites you admire?
9. **Special requirements?** Authentication, payments, real-time features?

## **Next Steps**
Once you answer a few of these questions, I'll create a detailed Lovable app prompt with:
• Complete project specification
• Technical architecture recommendations  
• Step-by-step development plan
• UI/UX guidelines tailored to your vision

${context ? `\n### **Context You've Provided:**\n${context}` : ''}

---

**No coding yet** - let's nail down your vision first, then build something amazing! 

What aspects of your idea are you most excited about?`
  };

  const templateFunction = templates[primary];
  return templateFunction ? templateFunction() : templates.new_project_scaffolding();
}