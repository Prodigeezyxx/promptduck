
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      throw new Error('OpenAI API key not configured');
    }

    const { intent, context, heuristics, complexity } = await req.json();

    if (!intent?.trim()) {
      throw new Error('Intent is required');
    }

    // Build system prompt for prompt generation
    const systemPrompt = `You are an expert prompt engineer. Generate an optimized prompt based on the user's intent and context.

CURRENT REQUEST:
- Intent: ${intent}
- Context: ${context || 'No additional context'}
- Heuristics: ${heuristics?.join(', ') || 'None specified'}
- Complexity: ${complexity || 'intermediate'}

OUTPUT FORMAT: Return ONLY valid JSON with no markdown formatting.

Required structure:
{
  "optimized_prompt": "The enhanced prompt text",
  "preview_title": "Brief title for the prompt",
  "tags": ["relevant", "tags"],
  "variables": [{"name": "variable_name", "type": "text", "required": true, "description": "Variable description"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
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
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      // Fallback if JSON parsing fails
      result = {
        optimized_prompt: content,
        preview_title: `Generated: ${intent}`,
        tags: ['generated'],
        variables: [],
        metadata: {
          complexity_score: 7,
          creativity_score: 6,
          coherence_score: 8,
          estimated_tokens: 150
        },
        remix_suggestions: []
      };
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
