
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MODES } from './modes.ts';
import { classifyIntent } from './intentClassifier.ts';
import { generateLovableTemplate } from './templates.ts';
import { enrichContextWithAI } from './contextEnricher.ts';
import { generateEnhancedLovableTemplate } from './enhancedTemplates.ts';

// Import name extraction function for Stage 1: Pre-Parse
function extractAppNameFromIntent(intent: string): string | null {
  const stopWords = ['app', 'tool', 'project', 'system', 'platform', 'website', 'site', 'application'];
  
  const explicitPatterns = [
    /(?:app\s+)?called\s+["']?([A-Z][\w-]+)["']?/i,
    /(?:app\s+)?named\s+["']?([A-Z][\w-]+)["']?/i,
    /(?:make|build|create)\s+["']?([A-Z][\w-]+)["']?\s*(?:app)?/i,
    /(?:app|application)\s+["']?([A-Z][\w-]+)["']?/i,
    /["']([A-Z][\w-]+)["']\s+(?:app|application)/i,
    /for\s+["']?([A-Z][\w-]+)["']?/i,
    /(?:like|similar\s+to)\s+["']?([A-Z][\w-]+)["']?/i
  ];
  
  for (const pattern of explicitPatterns) {
    const match = intent.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      const candidate = match[1].trim();
      
      if (!stopWords.includes(candidate.toLowerCase()) && 
          /^[A-Z][\w-]*$/.test(candidate) && 
          candidate.length >= 3 && 
          candidate.length <= 20) {
        return candidate;
      }
    }
  }
  
  return null;
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      
      // Stage 2: Add app_name field to the structured intent object
      const extractedAppName = extractAppNameFromIntent(intent);
      analysis.app_name = extractedAppName;
      
      console.log(`Detected intent: ${analysis.primary}, Project type: ${analysis.projectType}, App name: ${extractedAppName || 'Auto-generated'}`);
      
      // AI Context Enrichment - Research and enhance the request with domain intelligence
      console.log('Starting AI context enrichment...');
      const enrichment = await enrichContextWithAI(intent, context, analysis);
      console.log(`Context enrichment completed with confidence: ${enrichment.confidence}/10`);
      
      // Generate AI-enhanced, intelligently researched prompt for Lovable mode
      let templatePrompt = generateEnhancedLovableTemplate(intent, context, analysis, enrichment);
      
      // Apply comprehensive text cleaning to ensure pseudo-technical format
      templatePrompt = templatePrompt
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s*/g, '')
        .replace(/•\s*/g, '')
        .replace(/[\-\*]\s*/g, '')
        .replace(/\d+\.\s*/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/🔧|🐛|🤔|🎯|📱|🚀/g, '')
        .trim();
      
      // Generate domain-specific remix suggestions
      const remixSuggestions = generateDomainSpecificRemix(intent, analysis, enrichment);
      
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
            name: 'app_name',
            type: 'text',
            required: false,
            description: `App name: ${analysis.app_name || 'Generated automatically'}`
          },
          {
            name: 'complexity_level',
            type: 'text',
            required: false,
            description: `Estimated complexity: ${analysis.complexity}`
          },
          {
            name: 'ai_confidence',
            type: 'text',
            required: false,
            description: `AI research confidence: ${enrichment.confidence}/10`
          },
          {
            name: 'domain_insights',
            type: 'text',
            required: false,
            description: `Key domain insights: ${enrichment.domainInsights.slice(0, 2).join('; ')}`
          }
        ],
          metadata: {
            complexity_score: analysis.complexity === 'advanced' ? 9 : analysis.complexity === 'intermediate' ? 7 : 5,
            creativity_score: Math.min(10, 7 + Math.floor(enrichment.confidence / 3)),
            coherence_score: 10,
            estimated_tokens: Math.max(400, templatePrompt.length / 4),
            mode: 'lovable',
            target_platform: 'Lovable.dev',
            detected_intent: analysis.primary,
            project_type: analysis.projectType,
            template_applied: analysis.primary,
            confidence_score: analysis.confidence,
            keywords_detected: analysis.keywords.slice(0, 10),
            ai_enhanced: true,
            ai_confidence: enrichment.confidence,
            domain_research: enrichment.domainInsights.length > 1,
            market_context_analyzed: enrichment.marketContext.length > 10,
            // Stage 2: Include app_name in metadata
            app_name: analysis.app_name,
            name_locked: !!analysis.app_name,
            // Stage 7: PromptDuck Mode Guidelines compliance
            name_consistency_enforced: true
          },
        remix_suggestions: remixSuggestions
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

function generateDomainSpecificRemix(intent: string, analysis: any, enrichment: ContextEnrichment): string[] {
  const projectType = analysis.projectType || 'general_app';
  
  // Comprehensive domain-specific remix suggestions
  const domainRemixSuggestions = {
    'messaging_app': [
      'Add voice message support with waveform visualization',
      'Implement message reactions and emoji responses',
      'Include thread-based conversation organization',
      'Add real-time typing indicators and presence status',
      'Include message encryption for privacy'
    ],
    'e_commerce': [
      'Add product recommendation engine based on browsing history',
      'Implement wishlist functionality with price drop notifications',
      'Include social proof with customer reviews and ratings',
      'Add one-click checkout with saved payment methods',
      'Include AR/VR product preview capabilities'
    ],
    'social_media': [
      'Add story/timeline functionality with rich media support',
      'Implement hashtag and mention systems for content discovery',
      'Include live streaming and real-time interaction features',
      'Add content moderation and reporting tools',
      'Include analytics dashboard for content creators'
    ],
    'productivity': [
      'Add smart task prioritization using AI suggestions',
      'Implement team collaboration with shared workspaces',
      'Include time tracking and productivity analytics',
      'Add calendar integration with smart scheduling',
      'Include automation workflows for repetitive tasks'
    ],
    'education': [
      'Add interactive quizzes and assessment tools',
      'Implement progress tracking and learning analytics',
      'Include gamification elements with badges and achievements',
      'Add peer collaboration and study group features',
      'Include adaptive learning paths based on performance'
    ],
    'fitness_tracking': [
      'Add social challenges and leaderboards for motivation',
      'Implement wearable device integration for automatic tracking',
      'Include personalized workout recommendations',
      'Add nutrition tracking with barcode scanning',
      'Include virtual personal trainer with AI coaching'
    ],
    'dating_social': [
      'Add video chat integration for safe virtual dating',
      'Implement AI-powered conversation starters and icebreakers',
      'Include personality matching with compatibility scoring',
      'Add group dating and social event organization features',
      'Include safety features like photo verification and reporting'
    ],
    'gaming': [
      'Add multiplayer tournaments and competitive leagues',
      'Implement social guilds and team formation features',
      'Include live streaming and spectator modes',
      'Add achievement system with rare collectible rewards',
      'Include cross-platform play and progression sync'
    ],
    'health': [
      'Add telemedicine integration for virtual consultations',
      'Implement medication reminders with adherence tracking',
      'Include symptom checker with AI-powered health insights',
      'Add family health tracking and sharing features',
      'Include integration with wearable devices and health monitors'
    ],
    'finance': [
      'Add automated savings goals with smart recommendations',
      'Implement investment portfolio tracking with performance analytics',
      'Include bill reminder and automatic payment scheduling',
      'Add financial education with personalized learning paths',
      'Include expense categorization with receipt scanning'
    ],
    'music_audio': [
      'Add rhyme suggestion engine with syllable counting for rhythm matching',
      'Include voice recording feature for quick melody and lyric capture',
      'Implement real-time collaboration for co-writing sessions with other musicians',
      'Add beat/tempo integration to help match lyrics with musical timing',
      'Include chord progression suggestions based on lyrical mood and key'
    ],
    'travel_planning': [
      'Add real-time flight and hotel price tracking with alerts',
      'Implement collaborative trip planning with shared itineraries',
      'Include local recommendations and hidden gem discovery',
      'Add expense tracking and budget management for trips',
      'Include offline map access and itinerary synchronization'
    ]
  };

  const suggestions = domainRemixSuggestions[projectType] || [];
  
  // If we have domain-specific suggestions, use them
  if (suggestions.length > 0) {
    return suggestions.slice(0, 3);
  }

  // Fallback to enrichment-based suggestions
  return [
    ...enrichment.competitiveInsights.slice(0, 2).map(insight => `Apply competitive insight: ${insight}`),
    ...enrichment.userFlowSuggestions.slice(0, 2).map(flow => `Enhance with user flow: ${flow}`),
    'Add real-time features using Supabase subscriptions'
  ].slice(0, 3);
}
