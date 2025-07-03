import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced mode configurations
const MODES = {
  general: {
    id: 'general',
    name: 'General',
    systemPromptModifier: 'Generate versatile, well-structured prompts suitable for any AI platform.',
    contextInjection: [
      'Maintain broad applicability',
      'Focus on clear communication',
      'Provide structured output'
    ],
    formatRules: [
      'Use clear, concise language',
      'Structure with headers and bullet points',
      'Include examples when helpful'
    ],
    targetPlatform: 'Any AI Platform'
  },
  lovable: {
    id: 'lovable',
    name: 'Lovable Transformer',
    systemPromptModifier: `You are the Lovable Prompt Transformer with advanced contextual intelligence.`,
    targetPlatform: 'Lovable.dev'
  }
};

// Enhanced intent classification with better new project detection
function classifyIntent(intent: string, context: string = ''): { 
  primary: string, 
  confidence: number, 
  projectType?: string, 
  complexity: string,
  keywords: string[]
} {
  const fullText = `${intent} ${context}`.toLowerCase();
  const keywords = fullText.split(/\s+/).filter(word => word.length > 2);
  
  // Comprehensive project type detection with 25+ categories
  const projectPatterns = {
    'messaging_app': ['chat', 'message', 'conversation', 'talk', 'communicate', 'social', 'messenger', 'discord', 'slack'],
    'e_commerce': ['shop', 'store', 'buy', 'sell', 'commerce', 'marketplace', 'product', 'ecommerce', 'retail', 'shopping'],
    'productivity': ['todo', 'task', 'organize', 'manage', 'plan', 'schedule', 'note', 'productivity', 'notion', 'trello'],
    'creative': ['blog', 'write', 'create', 'art', 'design', 'portfolio', 'gallery', 'creative', 'content', 'creator'],
    'analytics': ['dashboard', 'chart', 'data', 'report', 'analyze', 'track', 'metric', 'analytics', 'insight'],
    'gaming': ['game', 'play', 'score', 'level', 'match', 'compete', 'fun', 'gaming', 'esports', 'twitch'],
    'health': ['health', 'fitness', 'exercise', 'medical', 'wellness', 'track', 'healthcare', 'mental', 'therapy'],
    'finance': ['money', 'budget', 'expense', 'financial', 'payment', 'bank', 'finance', 'crypto', 'investment'],
    'education': ['learn', 'teach', 'course', 'education', 'study', 'tutorial', 'learning', 'academy', 'skill'],
    'government_services': ['visa', 'application', 'government', 'legal', 'document', 'permit', 'license', 'official'],
    'travel_planning': ['travel', 'trip', 'booking', 'hotel', 'flight', 'vacation', 'journey', 'adventure', 'explore'],
    'real_estate': ['property', 'house', 'rent', 'real estate', 'apartment', 'listing', 'rental', 'home'],
    'food_delivery': ['food', 'restaurant', 'delivery', 'order', 'menu', 'cooking', 'recipe', 'kitchen'],
    'event_management': ['event', 'party', 'meeting', 'conference', 'calendar', 'booking', 'organize'],
    'fitness_tracking': ['workout', 'gym', 'exercise', 'fitness', 'training', 'sports', 'running', 'yoga'],
    'dating_social': ['dating', 'match', 'relationship', 'meet', 'connect', 'tinder', 'bumble', 'partner'],
    'music_audio': ['music', 'audio', 'sound', 'song', 'playlist', 'spotify', 'podcast', 'radio'],
    'photo_video': ['photo', 'video', 'camera', 'edit', 'filter', 'instagram', 'tiktok', 'youtube'],
    'ai_tools': ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'chatbot', 'automation'],
    'developer_tools': ['code', 'developer', 'api', 'github', 'programming', 'tool', 'software', 'dev'],
    'blockchain_crypto': ['blockchain', 'crypto', 'nft', 'defi', 'web3', 'ethereum', 'bitcoin', 'token'],
    'community_forum': ['community', 'forum', 'discussion', 'reddit', 'group', 'network', 'social'],
    'news_media': ['news', 'media', 'article', 'journalism', 'blog', 'publication', 'story'],
    'weather_location': ['weather', 'location', 'map', 'gps', 'navigation', 'climate', 'forecast'],
    'marketplace_p2p': ['marketplace', 'peer', 'p2p', 'exchange', 'trade', 'swap', 'share'],
    'remote_work': ['remote', 'work', 'freelance', 'collaboration', 'team', 'virtual', 'coworking'],
    'sustainability': ['eco', 'green', 'sustainable', 'environment', 'carbon', 'climate', 'recycle'],
    'pets_animals': ['pet', 'animal', 'dog', 'cat', 'veterinary', 'adoption', 'care'],
    'beauty_fashion': ['beauty', 'fashion', 'style', 'clothing', 'makeup', 'skincare', 'outfit'],
    'parenting_family': ['parent', 'family', 'child', 'baby', 'kids', 'mom', 'dad'],
    'elderly_care': ['elderly', 'senior', 'care', 'aging', 'retirement', 'assistance'],
    'local_services': ['local', 'neighborhood', 'service', 'handyman', 'repair', 'maintenance'],
    'mental_wellness': ['mental', 'meditation', 'mindfulness', 'therapy', 'wellness', 'stress'],
    'transportation': ['transport', 'uber', 'taxi', 'ride', 'car', 'public transport', 'mobility']
  };

  let detectedProjectType = 'general_app';
  let maxMatches = 0;
  
  Object.entries(projectPatterns).forEach(([type, patterns]) => {
    const matches = patterns.filter(pattern => fullText.includes(pattern)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedProjectType = type;
    }
  });

  // Enhanced new project detection - more flexible patterns
  const newProjectIndicators = [
    'build', 'create app', 'start project', 'new project', 'develop', 'make',
    'an app for', 'app that', 'application for', 'application that',
    'platform for', 'system for', 'tool for', 'website for', 'site for',
    'make an app', 'need an app', 'want to build', 'want to create',
    'like uber', 'like airbnb', 'like tinder', 'like instagram', 'like spotify',
    'similar to', 'inspired by', 'clone of', 'version of'
  ];

  const hasNewProjectIndicator = newProjectIndicators.some(indicator => 
    fullText.includes(indicator)
  );

  // Enhanced app/project detection with more flexible patterns
  const hasAppMention = fullText.includes('app') || fullText.includes('application') || 
                        fullText.includes('platform') || fullText.includes('website') ||
                        fullText.includes('site') || fullText.includes('system') ||
                        fullText.includes('tool') || fullText.includes('service');
  
  const hasSpecificFeatures = fullText.includes('with') || fullText.includes('should') || 
                             fullText.includes('feature') || fullText.includes('allow') ||
                             fullText.includes('help') || fullText.includes('manage') ||
                             fullText.includes('can') || fullText.includes('user') ||
                             fullText.includes('where') || fullText.includes('that');

  // Reduced word count requirement - many valid app ideas are concise
  const wordCount = fullText.split(/\s+/).length;
  const hasDetailedDescription = wordCount > 5; // Reduced from 8 to 5

  // More aggressive project type detection - if we have matches, it's likely a project
  const hasProjectTypeSignals = maxMatches > 0;

  // Enhanced new project classification logic
  if (hasNewProjectIndicator || 
      (hasAppMention && hasSpecificFeatures && hasDetailedDescription) ||
      (hasAppMention && hasProjectTypeSignals && wordCount > 3)) {
    return { 
      primary: 'new_project_scaffolding', 
      confidence: Math.min(0.9, 0.6 + (maxMatches * 0.1)), 
      projectType: detectedProjectType,
      complexity: maxMatches > 2 ? 'advanced' : 'intermediate',
      keywords
    };
  }

  // Other intent classifications
  if (fullText.includes('style') || fullText.includes('design') || fullText.includes('ui') || 
      fullText.includes('look') || fullText.includes('color') || fullText.includes('layout')) {
    return { 
      primary: 'ui_design_modification', 
      confidence: 0.8,
      complexity: 'intermediate',
      keywords
    };
  }

  if (fullText.includes('refactor') || fullText.includes('clean') || fullText.includes('organize') ||
      fullText.includes('restructure') || fullText.includes('improve code')) {
    return { 
      primary: 'code_refactoring', 
      confidence: 0.8,
      complexity: 'advanced',
      keywords
    };
  }

  if (fullText.includes('error') || fullText.includes('fix') || fullText.includes('bug') ||
      fullText.includes('broken') || fullText.includes('not working')) {
    return { 
      primary: 'debugging', 
      confidence: 0.9,
      complexity: 'advanced',
      keywords
    };
  }

  if (fullText.includes('add') || fullText.includes('implement') || fullText.includes('feature') ||
      fullText.includes('new functionality') || fullText.includes('enhance')) {
    return { 
      primary: 'feature_addition', 
      confidence: 0.8,
      complexity: 'intermediate',
      keywords
    };
  }

  // Only classify as vague if EXTREMELY unclear (very short AND no app mentions AND no project type signals)
  if (wordCount < 3 && !hasAppMention && maxMatches === 0 && 
      !fullText.includes('make') && !fullText.includes('create') && !fullText.includes('build')) {
    return { 
      primary: 'vague_ambiguous', 
      confidence: 0.6,
      projectType: detectedProjectType,
      complexity: 'intermediate',
      keywords
    };
  }

  // Default to new project for ANY other case - be generous with project scaffolding
  return { 
    primary: 'new_project_scaffolding', 
    confidence: Math.max(0.7, 0.5 + (maxMatches * 0.1)),
    projectType: detectedProjectType,
    complexity: maxMatches > 1 ? 'intermediate' : 'simple',
    keywords
  };
}

// Generate project name suggestions for all categories
function generateProjectName(intent: string, projectType: string): string {
  const projectNames = {
    'messaging_app': ['ChatFlow', 'MessageSpace', 'TalkStream', 'ConversaHub', 'ChatVibe'],
    'e_commerce': ['ShopFlow', 'MarketPlace', 'BuyNow', 'CommerceHub', 'StoreVibe'],
    'productivity': ['TaskFlow', 'ProductiveSpace', 'OrganizeHub', 'PlannerPro', 'TaskVibe'],
    'creative': ['CreateFlow', 'ArtSpace', 'DesignHub', 'CreativeVibe', 'PortfolioPro'],
    'analytics': ['DataFlow', 'AnalyticsHub', 'ChartSpace', 'MetricsVibe', 'DashboardPro'],
    'gaming': ['GameFlow', 'PlaySpace', 'GameHub', 'FunVibe', 'PlayPro'],
    'health': ['HealthFlow', 'WellnessSpace', 'FitnessHub', 'HealthVibe', 'WellnessPro'],
    'finance': ['FinanceFlow', 'MoneySpace', 'BudgetHub', 'FinanceVibe', 'MoneyPro'],
    'education': ['LearnFlow', 'EduSpace', 'StudyHub', 'LearnVibe', 'EduPro'],
    'government_services': ['GovFlow', 'DocumentHub', 'VisaSpace', 'LegalVibe', 'ApplicationPro'],
    'travel_planning': ['TravelFlow', 'JourneySpace', 'TripHub', 'TravelVibe', 'VoyagePro'],
    'real_estate': ['PropertyFlow', 'RealtySpace', 'HomeHub', 'PropertyVibe', 'EstatePro'],
    'food_delivery': ['FoodFlow', 'DeliverySpace', 'OrderHub', 'FoodVibe', 'TastePro'],
    'event_management': ['EventFlow', 'PlannerSpace', 'EventHub', 'PartyVibe', 'EventPro'],
    'fitness_tracking': ['FitFlow', 'WorkoutSpace', 'FitnessHub', 'GymVibe', 'FitPro'],
    'dating_social': ['MatchFlow', 'LoveSpace', 'ConnectHub', 'HeartVibe', 'DatePro'],
    'music_audio': ['SoundFlow', 'MusicSpace', 'TuneHub', 'AudioVibe', 'BeatPro'],
    'photo_video': ['PixelFlow', 'VisualSpace', 'CreativeHub', 'MediaVibe', 'PhotoPro'],
    'ai_tools': ['AIFlow', 'SmartSpace', 'IntelliHub', 'AIVibe', 'CognitoPro'],
    'developer_tools': ['CodeFlow', 'DevSpace', 'BuildHub', 'DevVibe', 'CodePro'],
    'blockchain_crypto': ['CryptoFlow', 'Web3Space', 'BlockHub', 'CryptoVibe', 'ChainPro'],
    'community_forum': ['CommunityFlow', 'SocialSpace', 'ForumHub', 'CommunityVibe', 'SocialPro'],
    'news_media': ['NewsFlow', 'MediaSpace', 'InfoHub', 'NewsVibe', 'MediaPro'],
    'weather_location': ['WeatherFlow', 'LocationSpace', 'MapHub', 'WeatherVibe', 'GeoLogic'],
    'marketplace_p2p': ['TradeFlow', 'MarketSpace', 'ExchangeHub', 'TradeVibe', 'MarketPro'],
    'remote_work': ['WorkFlow', 'RemoteSpace', 'TeamHub', 'WorkVibe', 'RemotePro'],
    'sustainability': ['EcoFlow', 'GreenSpace', 'SustainHub', 'EcoVibe', 'GreenPro'],
    'pets_animals': ['PetFlow', 'AnimalSpace', 'PetHub', 'PetVibe', 'AnimalPro'],
    'beauty_fashion': ['StyleFlow', 'BeautySpace', 'FashionHub', 'StyleVibe', 'BeautyPro'],
    'parenting_family': ['FamilyFlow', 'ParentSpace', 'FamilyHub', 'ParentVibe', 'FamilyPro'],
    'elderly_care': ['CareFlow', 'SeniorSpace', 'ElderHub', 'CareVibe', 'SeniorPro'],
    'local_services': ['ServiceFlow', 'LocalSpace', 'ServiceHub', 'LocalVibe', 'ServicePro'],
    'mental_wellness': ['WellnessFlow', 'MindSpace', 'WellnessHub', 'MindVibe', 'WellnessPro'],
    'transportation': ['RideFlow', 'TransportSpace', 'MoveHub', 'RideVibe', 'TransportPro']
  };

  const names = projectNames[projectType] || ['AppFlow', 'ProjectSpace', 'MyApp', 'AppVibe', 'ProjectPro'];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate sophisticated Lovable templates
function generateLovableTemplate(intent: string, context: string, analysis: any): string {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('AI service not configured');
    }

    const { intent, context, heuristics, complexity, mode } = await req.json();

    if (!intent?.trim()) {
      throw new Error('Intent is required');
    }

    // Get mode configuration
    const currentMode = MODES[mode] || MODES.general;
    console.log(`Processing request with mode: ${currentMode.name}`);

    let result;

    // Handle Lovable Transformer mode with advanced processing
    if (mode === 'lovable') {
      const analysis = classifyIntent(intent, context);
      console.log(`Detected intent: ${analysis.primary}, Project type: ${analysis.projectType}`);
      
      // Generate sophisticated template-based prompt for Lovable mode
      const templatePrompt = generateLovableTemplate(intent, context, analysis);
      
      result = {
        optimized_prompt: templatePrompt,
        preview_title: `Lovable-Optimized: ${intent.slice(0, 60)}${intent.length > 60 ? '...' : ''}`,
        tags: ['lovable', 'prompt-engineering', analysis.primary.replace('_', '-'), analysis.projectType?.replace('_', '-') || 'general'].filter(Boolean),
        variables: [
          {
            name: 'detected_intent',
            type: 'text',
            required: true,
            description: `Primary intent: ${analysis.primary}`
          },
          {
            name: 'project_type',
            type: 'text',
            required: false,
            description: `Detected project type: ${analysis.projectType || 'general'}`
          },
          {
            name: 'complexity_level',
            type: 'text',
            required: false,
            description: `Estimated complexity: ${analysis.complexity}`
          }
        ],
        metadata: {
          complexity_score: analysis.complexity === 'advanced' ? 9 : analysis.complexity === 'intermediate' ? 7 : 5,
          creativity_score: 8,
          coherence_score: 10,
          estimated_tokens: Math.max(400, templatePrompt.length / 4),
          mode: 'lovable',
          target_platform: 'Lovable.dev',
          detected_intent: analysis.primary,
          project_type: analysis.projectType,
          template_applied: analysis.primary,
          confidence_score: analysis.confidence,
          keywords_detected: analysis.keywords.slice(0, 10)
        },
        remix_suggestions: [
          'Add advanced component architecture patterns',
          'Integrate comprehensive error handling',
          'Include accessibility and SEO optimizations',
          'Add real-time features with Supabase',
          'Implement progressive web app capabilities'
        ]
      };
    } else {
      // Handle other modes with OpenAI API
      const systemPrompt = `${currentMode.systemPromptModifier}

CURRENT REQUEST:
- Intent: ${intent}
- Context: ${context || 'No additional context'}
- Heuristics: ${heuristics?.join(', ') || 'None specified'}
- Complexity: ${complexity || 'intermediate'}
- Mode: ${currentMode.name} (${currentMode.targetPlatform})

${currentMode.contextInjection ? `
MODE-SPECIFIC CONTEXT:
- ${currentMode.contextInjection.join('\n- ')}` : ''}

${currentMode.formatRules ? `
MODE-SPECIFIC FORMAT RULES:
- ${currentMode.formatRules.join('\n- ')}` : ''}

OUTPUT FORMAT: Return ONLY valid JSON with no markdown formatting.

Required structure:
{
  "optimized_prompt": "The enhanced prompt text optimized for ${currentMode.targetPlatform}",
  "preview_title": "Brief title for the prompt",
  "tags": ["${mode}", "relevant", "tags"],
  "variables": [{"name": "variable_name", "type": "text", "required": true, "description": "Variable description"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200,
    "mode": "${mode}",
    "target_platform": "${currentMode.targetPlatform}"
  },
  "remix_suggestions": ["Enhancement suggestion 1", "Enhancement suggestion 2"]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: intent }
          ],
          max_tokens: 1024,
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from AI service');
      }

      // Parse JSON response
      try {
        result = JSON.parse(content);
      } catch (e) {
        // Fallback if JSON parsing fails
        result = {
          optimized_prompt: content,
          preview_title: `Generated: ${intent}`,
          tags: [mode, 'generated'],
          variables: [],
          metadata: {
            complexity_score: 7,
            creativity_score: 6,
            coherence_score: 8,
            estimated_tokens: 150,
            mode: mode,
            target_platform: currentMode.targetPlatform
          },
          remix_suggestions: []
        };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-prompt function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
