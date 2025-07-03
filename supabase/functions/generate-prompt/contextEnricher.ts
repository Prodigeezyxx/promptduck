
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
    console.log('No OpenAI API key - returning enhanced fallback enrichment');
    return getEnhancedFallbackEnrichment(intent, analysis);
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
          { role: 'system', content: 'You are an expert product strategist and UX researcher specializing in app development domains. Provide specific, actionable insights.' },
          { role: 'user', content: enrichmentPrompt }
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.statusText);
      return getEnhancedFallbackEnrichment(intent, analysis);
    }

    const data = await response.json();
    const enrichmentText = data.choices[0]?.message?.content;

    if (!enrichmentText) {
      return getEnhancedFallbackEnrichment(intent, analysis);
    }

    const parsedEnrichment = parseEnrichmentResponse(enrichmentText);
    
    // If parsing fails or produces empty results, use enhanced fallback
    if (!parsedEnrichment || parsedEnrichment.domainInsights.length === 0) {
      console.log('AI enrichment parsing failed, using enhanced fallback');
      return getEnhancedFallbackEnrichment(intent, analysis);
    }

    return parsedEnrichment;

  } catch (error) {
    console.error('Context enrichment error:', error);
    return getEnhancedFallbackEnrichment(intent, analysis);
  }
}

function buildContextEnrichmentPrompt(intent: string, context: string, analysis: any): string {
  return `As an expert product strategist, analyze this app development request and provide specific, actionable insights:

REQUEST: "${intent}"
CONTEXT: ${context || 'No additional context provided'}
PROJECT TYPE: ${analysis.projectType || 'general application'}
DETECTED DOMAIN: ${analysis.primary || 'general'}

Focus on the specific domain and provide practical, implementable advice. Avoid generic responses.

Provide detailed analysis in this exact format:

DOMAIN_INSIGHTS:
- [Specific technical or business insight about this exact domain/industry]
- [Key challenge or opportunity unique to this type of app]
- [Domain-specific best practice or consideration]

TARGET_AUDIENCE:
[2-3 sentences about who would use this specific app and their key needs/motivations]

TECHNICAL_CONSIDERATIONS:
- [Database/backend requirement specific to this use case]
- [Performance or technical need unique to this domain]
- [Integration or API consideration for this app type]

MARKET_CONTEXT:
[1-2 sentences about current trends and user expectations for this specific app category]

COMPETITIVE_INSIGHTS:
- [What successful apps in this exact space do well]
- [Common pain point this app could solve better than existing solutions]

USER_FLOW_SUGGESTIONS:
- [Key user journey specific to this app type]
- [Important interaction pattern for this domain]

DESIGN_PATTERNS:
- [UI component or layout pattern effective for this app type]
- [UX consideration specific to this domain]

CONFIDENCE: [number 1-10]

Be specific to the domain - avoid generic app development advice.`;
}

function getEnhancedFallbackEnrichment(intent: string, analysis: any): ContextEnrichment {
  const projectType = analysis.projectType || 'general_app';
  const primaryIntent = analysis.primary || 'general';
  
  // Detect music/lyrics domain from intent
  const isMusicDomain = intent.toLowerCase().includes('lyric') || 
                       intent.toLowerCase().includes('music') || 
                       intent.toLowerCase().includes('song') ||
                       intent.toLowerCase().includes('rhyme') ||
                       intent.toLowerCase().includes('beat') ||
                       intent.toLowerCase().includes('audio') ||
                       intent.toLowerCase().includes('sound');

  if (isMusicDomain) {
    return getMusicDomainEnrichment(intent);
  }

  // Enhanced fallbacks for other domains
  const enhancedFallbacks = {
    'messaging_app': {
      domainInsights: [
        'Real-time messaging requires WebSocket connections with automatic reconnection handling',
        'Message encryption and secure data transmission are critical for user trust',
        'Offline message queuing ensures reliability when network connectivity is poor'
      ],
      targetAudienceAnalysis: 'Users seeking instant, reliable communication who prioritize both ease of use and privacy, often switching between devices throughout the day.',
      technicalConsiderations: [
        'WebSocket connections for real-time messaging with presence indicators',
        'Message encryption using end-to-end protocols',
        'Push notifications integration for mobile engagement'
      ],
      marketContext: 'Users expect WhatsApp-level reliability with Discord-level community features and Slack-level organization.',
      competitiveInsights: [
        'Thread-based organization significantly improves conversation management',
        'Rich media sharing with preview generation drives engagement',
        'Status indicators and read receipts reduce communication uncertainty'
      ],
      userFlowSuggestions: [
        'Quick message composition with emoji reactions and typing indicators',
        'Swipe gestures for message actions and quick replies',
        'Voice message recording with waveform visualization'
      ],
      designPatterns: [
        'Bubble-style message layout with smart timestamp grouping',
        'Bottom-anchored input with expanding text area and attachment options',
        'Smooth slide animations for conversation navigation and message actions'
      ]
    },
    'e_commerce': {
      domainInsights: [
        'Trust signals like verified reviews and security badges directly impact conversion rates',
        'Mobile-first design is essential as mobile commerce dominates online shopping',
        'Personalized product recommendations can increase average order value by 15-30%'
      ],
      targetAudienceAnalysis: 'Online shoppers seeking convenient, trustworthy purchasing experiences with clear product information, competitive pricing, and reliable delivery.',
      technicalConsiderations: [
        'Payment gateway integration with multiple payment methods and PCI compliance',
        'Advanced product search with filters, sorting, and intelligent recommendations',
        'Real-time inventory management with low-stock alerts and backorder handling'
      ],
      marketContext: 'Users expect Amazon-level convenience combined with personalized service and values-based shopping experiences.',
      competitiveInsights: [
        'One-click checkout and guest checkout options reduce cart abandonment significantly',
        'High-quality product images with zoom and 360-degree views drive purchase decisions',
        'Social proof through reviews, ratings, and user-generated content builds trust'
      ],
      userFlowSuggestions: [
        'Quick product discovery through visual search and barcode scanning',
        'Wishlist and save-for-later functionality with price drop notifications',
        'Streamlined checkout with address autofill and payment method storage'
      ],
      designPatterns: [
        'Grid-based product displays with consistent card layouts and hover effects',
        'Sticky cart summary during checkout with progress indicators',
        'Progressive disclosure for product specifications and detailed information'
      ]
    }
  };

  return enhancedFallbacks[projectType] || getDefaultEnrichment();
}

function getMusicDomainEnrichment(intent: string): ContextEnrichment {
  return {
    domainInsights: [
      'Music creation apps require low-latency audio processing and real-time collaboration features',
      'Lyric writing tools benefit from rhyme suggestion engines and syllable counting for rhythm matching',
      'Audio apps need robust file format support and cloud sync for cross-device workflows'
    ],
    targetAudienceAnalysis: 'Musicians, songwriters, and music enthusiasts seeking creative tools that enhance their writing process with intelligent suggestions and collaboration features.',
    technicalConsiderations: [
      'Web Audio API integration for real-time audio processing and effects',
      'Cloud storage for audio files with efficient streaming and caching',
      'Real-time collaboration features using WebSockets for shared editing sessions'
    ],
    marketContext: 'Musicians expect professional-grade tools with intuitive interfaces, similar to how Figma revolutionized design collaboration.',
    competitiveInsights: [
      'Rhyme suggestion and word association features significantly improve songwriting speed',
      'Voice recording integration allows for quick idea capture and melody development',
      'Collaborative editing with version control helps teams work together on projects'
    ],
    userFlowSuggestions: [
      'Quick lyric input with smart rhyme suggestions and synonym recommendations',
      'Voice memo recording with automatic transcription and lyric extraction',
      'Project sharing with real-time collaborative editing and comment threads'
    ],
    designPatterns: [
      'Split-pane layout with lyrics editor and rhyme suggestions panel',
      'Waveform visualization for audio tracks with playback controls',
      'Drag-and-drop interface for arranging verses, choruses, and song sections'
    ],
    confidence: 8
  };
}

function parseEnrichmentResponse(enrichmentText: string): ContextEnrichment | null {
  try {
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

    // Validate that we got meaningful content
    const hasValidContent = (
      (Array.isArray(sections.domainInsights) && sections.domainInsights.length > 0) ||
      (typeof sections.targetAudienceAnalysis === 'string' && sections.targetAudienceAnalysis.length > 20)
    );

    if (!hasValidContent) {
      return null;
    }

    return {
      domainInsights: Array.isArray(sections.domainInsights) ? sections.domainInsights : [sections.domainInsights],
      targetAudienceAnalysis: Array.isArray(sections.targetAudienceAnalysis) ? 
                             sections.targetAudienceAnalysis.join(' ') : 
                             (sections.targetAudienceAnalysis || ''),
      technicalConsiderations: Array.isArray(sections.technicalConsiderations) ? sections.technicalConsiderations : [sections.technicalConsiderations],
      marketContext: Array.isArray(sections.marketContext) ? 
                    sections.marketContext.join(' ') : 
                    (sections.marketContext || ''),
      competitiveInsights: Array.isArray(sections.competitiveInsights) ? sections.competitiveInsights : [sections.competitiveInsights],
      userFlowSuggestions: Array.isArray(sections.userFlowSuggestions) ? sections.userFlowSuggestions : [sections.userFlowSuggestions],
      designPatterns: Array.isArray(sections.designPatterns) ? sections.designPatterns : [sections.designPatterns],
      confidence: sections.confidence
    };
  } catch (error) {
    console.error('Error parsing enrichment response:', error);
    return null;
  }
}

function extractSection(text: string, sectionName: string, asArray = true): string[] | string {
  const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, 'i');
  const match = text.match(regex);
  
  if (!match || !match[1]) {
    return asArray ? [] : '';
  }

  const content = match[1].trim();
  
  if (asArray) {
    const items = content
      .split(/\n/)
      .map(item => item.replace(/^[-•*]\s*/, '').trim())
      .filter(item => item.length > 10)
      .slice(0, 3);
    
    return items.length > 0 ? items : [];
  }
  
  return content.length > 10 ? content : '';
}

function extractConfidence(text: string): number {
  const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/i);
  return confidenceMatch ? parseInt(confidenceMatch[1]) : 7;
}

function getDefaultEnrichment(): ContextEnrichment {
  return {
    domainInsights: [
      'User-centered design principles drive successful app adoption',
      'Performance optimization and fast loading times are critical for user retention'
    ],
    targetAudienceAnalysis: 'Users seeking efficient, reliable solutions to specific problems with intuitive interfaces.',
    technicalConsiderations: [
      'Responsive design across all device types and screen sizes',
      'Secure data handling with proper validation and error handling'
    ],
    marketContext: 'Modern users expect fast, intuitive applications with seamless user experiences.',
    competitiveInsights: [
      'Simple onboarding processes significantly improve user retention',
      'Clear value proposition and feature discovery drive user engagement'
    ],
    userFlowSuggestions: [
      'Streamlined user journey with minimal steps to core functionality',
      'Intuitive navigation patterns that users can quickly understand'
    ],
    designPatterns: [
      'Clean, modern interface design with consistent visual hierarchy',
      'Responsive component patterns that work across all devices'
    ],
    confidence: 6
  };
}
