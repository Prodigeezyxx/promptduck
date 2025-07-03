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
  
  // Comprehensive domain-specific enrichments
  const domainEnrichments = {
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
        'Rich media sharing with preview generation drives engagement'
      ],
      userFlowSuggestions: [
        'Quick message composition with emoji reactions and typing indicators',
        'Swipe gestures for message actions and quick replies'
      ],
      designPatterns: [
        'Bubble-style message layout with smart timestamp grouping',
        'Bottom-anchored input with expanding text area and attachment options'
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
        'Real-time inventory management with low-stock alerts'
      ],
      marketContext: 'Users expect Amazon-level convenience combined with personalized service and values-based shopping experiences.',
      competitiveInsights: [
        'One-click checkout and guest checkout options reduce cart abandonment significantly',
        'High-quality product images with zoom and 360-degree views drive purchase decisions'
      ],
      userFlowSuggestions: [
        'Quick product discovery through visual search and barcode scanning',
        'Streamlined checkout with address autofill and payment method storage'
      ],
      designPatterns: [
        'Grid-based product displays with consistent card layouts and hover effects',
        'Sticky cart summary during checkout with progress indicators'
      ]
    },
    'music_audio': {
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
        'Voice recording integration allows for quick idea capture and melody development'
      ],
      userFlowSuggestions: [
        'Quick lyric input with smart rhyme suggestions and synonym recommendations',
        'Voice memo recording with automatic transcription and lyric extraction'
      ],
      designPatterns: [
        'Split-pane layout with lyrics editor and rhyme suggestions panel',
        'Waveform visualization for audio tracks with playback controls'
      ]
    },
    'fitness_tracking': {
      domainInsights: [
        'Fitness apps need seamless integration with wearable devices and health platforms',
        'Social features and gamification significantly improve user retention and motivation',
        'Progress visualization and goal-setting are crucial for long-term engagement'
      ],
      targetAudienceAnalysis: 'Health-conscious individuals seeking motivation, progress tracking, and community support to achieve their fitness goals consistently.',
      technicalConsiderations: [
        'Integration with fitness APIs like Apple HealthKit, Google Fit, and Strava',
        'Real-time data synchronization from various fitness devices and sensors',
        'Local data storage for offline workout tracking with cloud sync'
      ],
      marketContext: 'Users expect MyFitnessPal-level tracking with Strava-level social features and Peloton-level engagement.',
      competitiveInsights: [
        'Social challenges and leaderboards drive consistent app usage',
        'Personalized workout recommendations based on past performance increase satisfaction'
      ],
      userFlowSuggestions: [
        'Quick workout logging with pre-defined exercises and custom routines',
        'Social sharing of achievements with privacy controls'
      ],
      designPatterns: [
        'Dashboard with key metrics and progress charts prominently displayed',
        'Swipe-based exercise logging with voice commands for hands-free operation'
      ]
    },
    'dating_social': {
      domainInsights: [
        'Trust and safety features are paramount, including photo verification and reporting systems',
        'Algorithm-based matching with user preference learning improves match quality over time',
        'Location-based features require careful privacy balance and user control'
      ],
      targetAudienceAnalysis: 'Singles seeking meaningful connections through technology, valuing both discovery features and safety measures in online dating.',
      technicalConsiderations: [
        'Advanced matching algorithms with machine learning for compatibility scoring',
        'Real-time messaging with safety features like image moderation',
        'Location services with privacy controls and radius-based matching'
      ],
      marketContext: 'Users expect Tinder-level ease of use with Bumble-level safety features and Hinge-level relationship focus.',
      competitiveInsights: [
        'Conversation starters and icebreaker prompts significantly improve match engagement',
        'Video chat integration has become essential for building trust before meeting'
      ],
      userFlowSuggestions: [
        'Intuitive profile creation with guided prompts and photo verification',
        'Seamless transition from matching to messaging with safety controls'
      ],
      designPatterns: [
        'Card-based profile browsing with gesture-based interactions',
        'Clean messaging interface with media sharing and safety reporting'
      ]
    },
    'productivity': {
      domainInsights: [
        'Task management apps succeed through simplicity and powerful organization features',
        'Cross-platform synchronization is essential for modern productivity workflows',
        'Integration with calendar and email systems drives daily usage adoption'
      ],
      targetAudienceAnalysis: 'Busy professionals and students seeking to organize tasks, manage time effectively, and boost productivity across personal and work contexts.',
      technicalConsiderations: [
        'Real-time sync across multiple devices with conflict resolution',
        'Integration APIs for calendar, email, and workplace tools like Slack',
        'Offline functionality with automatic sync when connection is restored'
      ],
      marketContext: 'Users expect Notion-level flexibility with Todoist-level simplicity and Asana-level collaboration features.',
      competitiveInsights: [
        'Natural language processing for task creation improves user adoption',
        'Smart scheduling suggestions based on task priority and deadlines increase completion rates'
      ],
      userFlowSuggestions: [
        'Quick task capture with voice input and smart categorization',
        'Project organization with drag-and-drop functionality and nested subtasks'
      ],
      designPatterns: [
        'Clean list views with customizable sorting and filtering options',
        'Dashboard showing daily agenda with progress indicators'
      ]
    },
    'gaming': {
      domainInsights: [
        'Mobile gaming requires optimized performance and battery usage consideration',
        'Social features and leaderboards significantly increase player retention',
        'Monetization through in-app purchases requires careful balance with gameplay enjoyment'
      ],
      targetAudienceAnalysis: 'Gamers seeking entertainment, challenge, and social interaction through digital gameplay experiences across various skill levels and time commitments.',
      technicalConsiderations: [
        'Optimized rendering and animation performance for smooth gameplay',
        'Real-time multiplayer functionality with low-latency networking',
        'Save game synchronization across devices with cloud storage'
      ],
      marketContext: 'Players expect console-quality experiences on mobile with PC-level social features and fair monetization models.',
      competitiveInsights: [
        'Progressive difficulty scaling keeps players engaged without frustration',
        'Social guilds and team features create strong community bonds'
      ],
      userFlowSuggestions: [
        'Intuitive onboarding with interactive tutorials and gradual feature introduction',
        'Quick match finding with skill-based matchmaking systems'
      ],
      designPatterns: [
        'Responsive touch controls optimized for various screen sizes',
        'Clear UI hierarchy that doesn\'t interfere with gameplay visibility'
      ]
    },
    'health': {
      domainInsights: [
        'Health apps require HIPAA compliance and robust data privacy protections',
        'Integration with medical devices and EMR systems improves clinical utility',
        'User education and behavioral change features are key to health outcomes'
      ],
      targetAudienceAnalysis: 'Health-conscious individuals and patients seeking to monitor, understand, and improve their health through technology-assisted tracking and insights.',
      technicalConsiderations: [
        'HIPAA-compliant data storage and transmission with end-to-end encryption',
        'Integration with medical devices, labs, and healthcare provider systems',
        'Reliable data accuracy with validation and anomaly detection'
      ],
      marketContext: 'Users expect MyChart-level medical integration with Fitbit-level consumer experience and clinical-grade accuracy.',
      competitiveInsights: [
        'Personalized insights and recommendations drive long-term engagement',
        'Healthcare provider collaboration features improve patient outcomes'
      ],
      userFlowSuggestions: [
        'Simple symptom and vital sign logging with trend analysis',
        'Medication reminders with adherence tracking and provider sharing'
      ],
      designPatterns: [
        'Dashboard with key health metrics and trend visualizations',
        'Privacy-first design with granular data sharing controls'
      ]
    },
    'finance': {
      domainInsights: [
        'Financial apps require bank-level security with multi-factor authentication',
        'Real-time transaction monitoring and fraud detection are essential features',
        'Regulatory compliance varies by region and requires ongoing updates'
      ],
      targetAudienceAnalysis: 'Individuals and businesses seeking better financial management, budgeting tools, and investment tracking with security and regulatory compliance.',
      technicalConsiderations: [
        'Bank-grade encryption and security with PCI DSS compliance',
        'Open banking API integration for account aggregation and transactions',
        'Real-time fraud detection with machine learning algorithms'
      ],
      marketContext: 'Users expect Mint-level budgeting with Robinhood-level investing and traditional banking security standards.',
      competitiveInsights: [
        'Automated categorization and spending insights improve financial awareness',
        'Goal-based saving and investment features drive user engagement'
      ],
      userFlowSuggestions: [
        'Secure account linking with immediate transaction categorization',
        'Budget creation with automated alerts and spending recommendations'
      ],
      designPatterns: [
        'Clear financial dashboard with spending breakdowns and trend analysis',
        'Security-focused design with biometric authentication options'
      ]
    },
    'education': {
      domainInsights: [
        'Educational apps benefit from adaptive learning algorithms that adjust to user pace',
        'Progress tracking and achievement systems improve learning motivation',
        'Multi-modal content delivery accommodates different learning styles'
      ],
      targetAudienceAnalysis: 'Students, educators, and lifelong learners seeking effective, engaging educational experiences through interactive and personalized learning platforms.',
      technicalConsiderations: [
        'Adaptive learning algorithms that adjust content difficulty based on performance',
        'Multimedia content delivery with offline download capabilities',
        'Progress analytics and learning outcome measurement systems'
      ],
      marketContext: 'Users expect Khan Academy-level content quality with Duolingo-level engagement and Coursera-level credentialing.',
      competitiveInsights: [
        'Gamification elements like streaks and badges significantly improve completion rates',
        'Social learning features and peer interaction enhance understanding'
      ],
      userFlowSuggestions: [
        'Personalized learning path creation based on goals and current knowledge',
        'Interactive lessons with immediate feedback and progress tracking'
      ],
      designPatterns: [
        'Progress-driven interface with clear learning milestones and achievements',
        'Multi-format content presentation with accessibility considerations'
      ]
    },
    'travel_planning': {
      domainInsights: [
        'Travel apps require real-time data integration for flights, hotels, and local services',
        'Offline functionality is crucial for international travelers with limited connectivity',
        'Personalized recommendations based on preferences and past trips improve satisfaction'
      ],
      targetAudienceAnalysis: 'Travelers seeking convenient trip planning, booking, and management tools that work seamlessly across destinations and travel styles.',
      technicalConsiderations: [
        'Integration with booking APIs for flights, hotels, and activities',
        'Offline map and itinerary access with periodic data synchronization',
        'Multi-currency support with real-time exchange rate updates'
      ],
      marketContext: 'Users expect Expedia-level booking with TripAdvisor-level reviews and Google Maps-level navigation integration.',
      competitiveInsights: [
        'Collaborative trip planning with shared itineraries increases user engagement',
        'Local recommendations and hidden gem discovery differentiate premium services'
      ],
      userFlowSuggestions: [
        'Trip creation with intelligent suggestions based on preferences and budget',
        'Real-time updates and notifications for flight changes and local events'
      ],
      designPatterns: [
        'Timeline-based itinerary view with drag-and-drop scheduling',
        'Map-centric interface with layered information and booking integration'
      ]
    }
  };

  return domainEnrichments[projectType] || getDefaultEnrichment();
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
