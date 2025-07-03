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
  return `As an expert product strategist, analyze this request and provide specific, actionable insights:

REQUEST: "${intent}"
CONTEXT: ${context || 'No additional context provided'}
PROJECT TYPE: ${analysis.projectType || 'general application'}

Provide detailed analysis in this exact format:

DOMAIN_INSIGHTS:
- [Specific insight about this domain/industry]
- [Key challenge or opportunity in this space]
- [Technical or business consideration unique to this type of app]

TARGET_AUDIENCE:
[2-3 sentences about who would use this and their key needs/motivations]

TECHNICAL_CONSIDERATIONS:
- [Database/backend requirement specific to this use case]
- [Authentication or security need]
- [Performance or scalability consideration]

MARKET_CONTEXT:
[1-2 sentences about current market trends and user expectations for this type of app]

COMPETITIVE_INSIGHTS:
- [What successful apps in this space do well]
- [Common pain point this app could address]

USER_FLOW_SUGGESTIONS:
- [Key user journey or workflow]
- [Important interaction pattern]

DESIGN_PATTERNS:
- [UI component or layout pattern for this app type]
- [Visual design consideration]

CONFIDENCE: [number 1-10]

Be specific and actionable, not generic.`;
}

function getBasicInsight(projectType: string, category: string): string {
  const insights = {
    'messaging_app': {
      domain: 'Real-time communication with low latency requirements',
      audience: 'Users seeking instant reliable messaging',
      technical: 'WebSocket connections for real-time messaging',
      market: 'Users expect WhatsApp-level reliability',
      competitive: 'Thread organization improves user experience',
      userflow: 'Quick message composition with smart suggestions',
      design: 'Bubble-style messages with timestamp grouping'
    },
    'e_commerce': {
      domain: 'Trust and conversion optimization are critical',
      audience: 'Online shoppers seeking convenient purchasing',
      technical: 'Payment gateway integration with security',
      market: 'Users expect Amazon-level convenience',
      competitive: 'One-click checkout reduces abandonment',
      userflow: 'Quick product discovery and checkout',
      design: 'Grid-based product displays with clear CTAs'
    }
  };
  
  return insights[projectType]?.[category] || `${category} considerations for ${projectType || 'general'} applications`;
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

  // If we get empty sections, fall back to basic enrichment
  const hasValidContent = (
    (Array.isArray(sections.domainInsights) && sections.domainInsights.length > 0) ||
    (typeof sections.targetAudienceAnalysis === 'string' && sections.targetAudienceAnalysis.length > 10)
  );

  if (!hasValidContent) {
    console.log('AI enrichment failed, using basic enrichment');
    return getBasicEnrichment({ projectType: 'general_app' });
  }

  return {
    domainInsights: Array.isArray(sections.domainInsights) ? sections.domainInsights : [sections.domainInsights],
    targetAudienceAnalysis: Array.isArray(sections.targetAudienceAnalysis) ? 
                           sections.targetAudienceAnalysis.join(' ') : 
                           (sections.targetAudienceAnalysis || 'Users seeking efficient solutions'),
    technicalConsiderations: Array.isArray(sections.technicalConsiderations) ? sections.technicalConsiderations : [sections.technicalConsiderations],
    marketContext: Array.isArray(sections.marketContext) ? 
                  sections.marketContext.join(' ') : 
                  (sections.marketContext || 'Modern users expect intuitive applications'),
    competitiveInsights: Array.isArray(sections.competitiveInsights) ? sections.competitiveInsights : [sections.competitiveInsights],
    userFlowSuggestions: Array.isArray(sections.userFlowSuggestions) ? sections.userFlowSuggestions : [sections.userFlowSuggestions],
    designPatterns: Array.isArray(sections.designPatterns) ? sections.designPatterns : [sections.designPatterns],
    confidence: sections.confidence
  };
}

function extractSection(text: string, sectionName: string, asArray = true): string[] | string {
  const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, 'i');
  const match = text.match(regex);
  
  if (!match || !match[1]) {
    // Only use fallbacks if we really can't extract anything
    if (asArray) {
      return [];
    }
    return '';
  }

  const content = match[1].trim();
  
  if (asArray) {
    // Split by newlines and clean up, removing bullet points
    const items = content
      .split(/\n/)
      .map(item => item.replace(/^[-•*]\s*/, '').trim())
      .filter(item => item.length > 10 && !item.includes('No insights'))
      .slice(0, 3);
    
    return items;
  }
  
  return content.length > 10 ? content : '';
}

function extractConfidence(text: string): number {
  const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/i);
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