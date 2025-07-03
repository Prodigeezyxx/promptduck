import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MODES } from './modes.ts';
import { classifyIntent } from './intentClassifier.ts';
import { generateLovableTemplate } from './templates.ts';
import { enrichContextWithAI } from './contextEnricher.ts';
import { generateEnhancedLovableTemplate } from './enhancedTemplates.ts';

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
      console.log(`Detected intent: ${analysis.primary}, Project type: ${analysis.projectType}`);
      
      // AI Context Enrichment - Research and enhance the request with domain intelligence
      console.log('Starting AI context enrichment...');
      const enrichment = await enrichContextWithAI(intent, context, analysis);
      console.log(`Context enrichment completed with confidence: ${enrichment.confidence}/10`);
      
      // Generate AI-enhanced, intelligently researched prompt for Lovable mode
      const templatePrompt = generateEnhancedLovableTemplate(intent, context, analysis, enrichment);
      
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
          market_context_analyzed: enrichment.marketContext.length > 10
        },
        remix_suggestions: [
          ...enrichment.competitiveInsights.slice(0, 2).map(insight => `Apply insight: ${insight}`),
          ...enrichment.userFlowSuggestions.slice(0, 2).map(flow => `Enhance user flow: ${flow}`),
          'Add real-time features with Supabase'
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