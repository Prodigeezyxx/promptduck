// AI Context Enrichment Service for Lovable Mode
// Provides intelligent, researched context to enhance template generation

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

export async function enrichContextWithAI(
  intent: string, 
  context: string, 
  analysis: any
): Promise<ContextEnrichment> {
  if (!openAIApiKey) {
    console.log('No OpenAI API key - returning basic enrichment');
    return getBasicEnrichment(analysis);
  }

  try {
    const enrichmentPrompt = buildContextEnrichmentPrompt(intent, context, analysis);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert product strategist and UX researcher. Provide deep, actionable insights about user requests for app development.' },
          { role: 'user', content: enrichmentPrompt }
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.statusText);
      return getBasicEnrichment(analysis);
    }

    const data = await response.json();
    const enrichmentText = data.choices[0]?.message?.content;

    if (!enrichmentText) {
      return getBasicEnrichment(analysis);
    }

    return parseEnrichmentResponse(enrichmentText);

  } catch (error) {
    console.error('Context enrichment error:', error);
    return getBasicEnrichment(analysis);
  }
}

function buildContextEnrichmentPrompt(intent: string, context: string, analysis: any): string {
  return `Analyze this app request and provide concise technical insights for prompt enhancement:

Request: "${intent}"
Context: ${context || 'None'}
Type: ${analysis.projectType || 'general_app'}
Keywords: ${analysis.keywords?.slice(0, 5).join(', ') || 'None'}

Provide brief, technical insights (2-3 items each, no formatting):

DOMAIN_INSIGHTS: Key technical/business insights for this app category
TARGET_AUDIENCE: User profile and core needs (1-2 sentences)  
TECHNICAL_CONSIDERATIONS: Specific technical requirements/challenges
MARKET_CONTEXT: Current expectations and standards (1-2 sentences)
COMPETITIVE_INSIGHTS: Proven patterns from successful apps
USER_FLOW_SUGGESTIONS: Core interaction patterns that work
DESIGN_PATTERNS: Effective UI patterns for this category
CONFIDENCE: Rate 1-10

Keep responses concise and technical. No bullets, headers, or formatting.`;
}

function parseEnrichmentResponse(enrichmentText: string): ContextEnrichment {
  const sections = {
    domainInsights: extractSection(enrichmentText, 'DOMAIN_INSIGHTS'),
    targetAudienceAnalysis: extractSection(enrichmentText, 'TARGET_AUDIENCE', false),
    technicalConsiderations: extractSection(enrichmentText, 'TECHNICAL_CONSIDERATIONS'),
    marketContext: extractSection(enrichmentText, 'MARKET_CONTEXT', false),
    competitiveInsights: extractSection(enrichmentText, 'COMPETITIVE_INSIGHTS'),
    userFlowSuggestions: extractSection(enrichmentText, 'USER_FLOW_SUGGESTIONS'),
    designPatterns: extractSection(enrichmentText, 'DESIGN_PATTERNS'),
    confidence: extractConfidence(enrichmentText)
  };

  return {
    domainInsights: Array.isArray(sections.domainInsights) ? sections.domainInsights : [sections.domainInsights],
    targetAudienceAnalysis: Array.isArray(sections.targetAudienceAnalysis) ? sections.targetAudienceAnalysis.join(' ') : sections.targetAudienceAnalysis,
    technicalConsiderations: Array.isArray(sections.technicalConsiderations) ? sections.technicalConsiderations : [sections.technicalConsiderations],
    marketContext: Array.isArray(sections.marketContext) ? sections.marketContext.join(' ') : sections.marketContext,
    competitiveInsights: Array.isArray(sections.competitiveInsights) ? sections.competitiveInsights : [sections.competitiveInsights],
    userFlowSuggestions: Array.isArray(sections.userFlowSuggestions) ? sections.userFlowSuggestions : [sections.userFlowSuggestions],
    designPatterns: Array.isArray(sections.designPatterns) ? sections.designPatterns : [sections.designPatterns],
    confidence: sections.confidence
  };
}

function extractSection(text: string, sectionName: string, asArray = true): string[] | string {
  const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[A-Z_]+:|$)`, 'i');
  const match = text.match(regex);
  
  if (!match || !match[1]) {
    return asArray ? ['No insights available'] : 'No insights available';
  }

  const content = match[1].trim();
  
  if (asArray) {
    // Split by bullet points, numbers, or newlines and clean up
    return content
      .split(/[•\-\*]|\d+\./)
      .map(item => item.trim())
      .filter(item => item.length > 5)
      .slice(0, 4); // Limit to 4 items
  }
  
  return content;
}

function extractConfidence(text: string): number {
  const confidenceMatch = text.match(/\*\*CONFIDENCE:\*\*\s*(\d+)/i);
  return confidenceMatch ? parseInt(confidenceMatch[1]) : 7;
}

function getBasicEnrichment(analysis: any): ContextEnrichment {
  // Fallback enrichment based on project type
  const projectType = analysis.projectType || 'general_app';
  
  const basicEnrichments = {
    'messaging_app': {
      domainInsights: [
        'Real-time communication requires WebSocket connections and optimized state management',
        'Users expect sub-second message delivery and reliable presence indicators',
        'Privacy and security are top concerns for messaging platforms'
      ],
      targetAudienceAnalysis: 'Users seeking instant, reliable communication with friends, family, or colleagues, prioritizing ease of use and privacy.',
      technicalConsiderations: [
        'Real-time WebSocket connections for instant messaging',
        'Message encryption and secure data transmission',
        'Offline support and message synchronization'
      ],
      marketContext: 'Modern users expect WhatsApp-level reliability with Slack-level organization features.',
      competitiveInsights: [
        'Thread-based conversations improve organization',
        'Rich media sharing is now expected baseline functionality',
        'Status indicators reduce communication uncertainty'
      ],
      userFlowSuggestions: [
        'Quick message composer with smart suggestions',
        'Swipe gestures for message actions',
        'Voice message recording with visual feedback'
      ],
      designPatterns: [
        'Bubble-style message layout with timestamp grouping',
        'Bottom-anchored input with expanding text area',
        'Smooth slide animations for conversation navigation'
      ]
    },
    'e_commerce': {
      domainInsights: [
        'Trust signals like reviews and security badges significantly impact conversion',
        'Mobile commerce now represents majority of online shopping',
        'Personalized recommendations increase average order value by 15-30%'
      ],
      targetAudienceAnalysis: 'Online shoppers seeking convenient, trustworthy purchasing experiences with clear product information and secure checkout.',
      technicalConsiderations: [
        'Payment gateway integration with PCI compliance',
        'Product search and filtering with performance optimization',
        'Inventory management and real-time stock updates'
      ],
      marketContext: 'Users expect Amazon-level convenience with local business personal touch and values.',
      competitiveInsights: [
        'One-click checkout reduces cart abandonment significantly',
        'High-quality product images with zoom functionality are essential',
        'Social proof through reviews drives purchase decisions'
      ],
      userFlowSuggestions: [
        'Quick product scanning with image search',
        'Save-for-later functionality with wishlist management',
        'Guest checkout option with account creation incentive'
      ],
      designPatterns: [
        'Grid-based product displays with hover interactions',
        'Sticky cart summary during checkout process',
        'Progressive disclosure for product specifications'
      ]
    }
  };

  return basicEnrichments[projectType] || {
    domainInsights: ['Focus on user needs and technical feasibility', 'Consider scalability from the start'],
    targetAudienceAnalysis: 'Users seeking efficient solutions to specific problems or needs.',
    technicalConsiderations: ['Responsive design for all devices', 'Performance optimization'],
    marketContext: 'Modern web users expect fast, intuitive applications.',
    competitiveInsights: ['Simple onboarding increases user retention', 'Clear value proposition is essential'],
    userFlowSuggestions: ['Minimal steps to core functionality', 'Clear navigation patterns'],
    designPatterns: ['Clean, modern interface design', 'Consistent component patterns']
  };
}