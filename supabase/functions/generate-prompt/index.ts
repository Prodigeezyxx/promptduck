
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mode configurations replicated from frontend
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
    systemPromptModifier: `You are the Lovable Prompt Transformer. Apply advanced prompt engineering:

INTENT CLASSIFICATION ENGINE:
- New Project Scaffolding: Keywords like "build," "create app," "start project"
- UI/Design Modification: Keywords like "style," "responsive," "colors," "layout"  
- Code Refactoring: Keywords like "clean up," "refactor," "organize"
- Debugging: Keywords like "error," "fix," "not working," "bug"
- Feature Addition: Keywords like "add feature," "implement," "change how X works"
- Vague/Ambiguous: Input too broad to be actionable

TEMPLATE AUGMENTATION SYSTEM:
For each intent type, apply structured templates with:
- Context setting and safety constraints
- Step-by-step guidelines with clear objectives
- Lovable-specific best practices (React/TypeScript/Tailwind)
- Risk mitigation and functionality preservation
- Evidence-based solutions with clear explanations

OUTPUT STRUCTURE:
Generate complete, copy-paste-ready prompts with:
- Clear context and task definition
- Specific guidelines tailored to Lovable.dev
- Explicit constraints to prevent breaking changes
- Mobile-first, component-driven approach
- Integration with shadcn/ui and modern patterns`,
    targetPlatform: 'Lovable.dev'
  }
};

// Intent classification function
function classifyIntent(intent: string): string {
  const intentLower = intent.toLowerCase();
  
  if (intentLower.includes('build') || intentLower.includes('create app') || intentLower.includes('start project') || intentLower.includes('new project')) {
    return 'new_project_scaffolding';
  }
  if (intentLower.includes('style') || intentLower.includes('responsive') || intentLower.includes('colors') || intentLower.includes('layout') || intentLower.includes('design')) {
    return 'ui_design_modification';
  }
  if (intentLower.includes('clean up') || intentLower.includes('refactor') || intentLower.includes('organize')) {
    return 'code_refactoring';
  }
  if (intentLower.includes('error') || intentLower.includes('fix') || intentLower.includes('not working') || intentLower.includes('bug')) {
    return 'debugging';
  }
  if (intentLower.includes('add feature') || intentLower.includes('implement') || intentLower.includes('change how')) {
    return 'feature_addition';
  }
  
  return 'vague_ambiguous';
}

// Template generation for Lovable mode
function generateLovableTemplate(intent: string, context: string, detectedIntent: string): string {
  const templates = {
    new_project_scaffolding: `### **Part 1: Your Project Knowledge Base (PRD)**
*Paste this into your Lovable project's "Knowledge Base" settings to provide the AI with critical context.*

# Project Requirements: ${intent}

## 1. Project Purpose & User Flow
- **Goal:** To build a modern web application that ${intent.toLowerCase()}.
- **User Journey:** Users will interact with a clean, intuitive interface designed for optimal user experience.

## 2. Core Features (MVP)
- Responsive UI components
- Modern design system
- Mobile-first approach
- Component-driven architecture

## 3. Tech Stack & Design
- **Stack:** React, TypeScript, Tailwind CSS, shadcn/ui, Supabase.
- **Design:** Clean, minimalist, and mobile-first.

---

### **Part 2: Your First Lovable Implementation Prompt**
*Now, use this prompt in Lovable to start building.*

# Context
You are an expert AI developer tasked with building the application defined in the project's Knowledge Base. Focus on creating a solid foundation with proper component structure.

## Task
${intent}

### Guidelines
- Use React + TypeScript + Tailwind CSS stack
- Implement responsive, mobile-first design
- Use shadcn/ui components for consistency
- Create reusable, focused components
- Follow modern React patterns and best practices

#### Constraints
- **Start with core functionality first**. Build incrementally.
- **Use component-driven architecture**. Keep components focused and reusable.
- **Prioritize user experience** with clean, intuitive interfaces.`,

    ui_design_modification: `# Context
This is a design-focused task. The core functionality of the application must be preserved without any changes.

## Task
Implement the following visual enhancements: ${intent}

### Guidelines
- Apply a mobile-first responsive strategy using Tailwind's standard breakpoints
- Use shadcn/ui components for consistency
- Focus on improving user experience and visual appeal
- ${context ? `Additional context: ${context}` : ''}

#### Constraints
- **Make solely visual enhancements**. Ensure logic, state management, and APIs stay intact.
- Conduct a mental check to verify that the app will operate precisely as it did before.
- **Cease all actions if there is any uncertainty** regarding potential unintended consequences.`,

    code_refactoring: `# Context
This task requires refactoring existing code for maintainability and clarity without altering its external behavior.

## Task
Develop a comprehensive plan to refactor: ${intent}

### Guidelines
- Focus on improving code structure, readability, and maintainability
- Identify areas for enhancement such as simplifying logic, removing redundancy, or improving modularity
- **Present the plan for review before implementing any changes**
- ${context ? `Additional context: ${context}` : ''}

#### Constraints
- **The user interface and functionality must remain entirely intact and operate identically post-refactor**
- Prioritize low-risk, incremental changes
- If uncertain at any point, pause the process and ask for clarification`,

    debugging: `# Context
An error is occurring, and a systematic investigation is required to identify the root cause before attempting a fix.

## Task
Analyze the following issue: ${intent}

### Guidelines
- **Use chain-of-thought reasoning**. First, outline the potential causes
- Examine logs, component dependencies, and recent changes to isolate the problem
- Explain the logical sequence that likely led to the error
- Propose a single, targeted solution with a clear explanation of why it will work
- ${context ? `Additional context: ${context}` : ''}

#### Constraints
- **Do not make any code changes yet**. This is an analysis and planning step
- Ensure your proposed solution is evidence-based and directly addresses the identified root cause`,

    feature_addition: `# Context
You are implementing a new feature while maintaining existing functionality and following Lovable.dev best practices.

## Task
Implement the following feature: ${intent}

### Guidelines
- Use React + TypeScript + Tailwind CSS patterns
- Integrate with existing component architecture
- Follow mobile-first responsive design principles
- Use shadcn/ui components where appropriate
- ${context ? `Additional context: ${context}` : ''}

#### Constraints
- **Preserve all existing functionality**. New features should not break current features
- **Test integration points** to ensure compatibility with existing code
- **Use incremental implementation** - build and test in small steps`,

    vague_ambiguous: `# Context
The current goal is to clarify the project requirements and create a structured development plan. This is a planning session to be conducted in **Lovable's Chat Mode**.

## Task
Let's collaboratively build a Project Requirements Document (PRD) for your application.

### Guidelines
- First, I need you to answer the following questions to help me understand your vision:
  1. **What is the primary goal of your application? What problem does it solve?**
  2. **Who is the target audience?**
  3. **What are the 3-4 core features absolutely essential for the first version (MVP)?**
- Based on your answers, I will help you outline a step-by-step implementation plan.

#### Constraints
- **Do not write any code yet**. This entire interaction is for planning and clarification
- Our goal is to create a solid plan that we can then execute step-by-step to minimize errors`
  };

  return templates[detectedIntent] || templates.vague_ambiguous;
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

    let systemPrompt;
    let result;

    // Handle Lovable Transformer mode with advanced processing
    if (mode === 'lovable') {
      const detectedIntent = classifyIntent(intent);
      console.log(`Detected intent: ${detectedIntent}`);
      
      // Generate template-based prompt for Lovable mode
      const templatePrompt = generateLovableTemplate(intent, context, detectedIntent);
      
      result = {
        optimized_prompt: templatePrompt,
        preview_title: `Lovable-Optimized: ${intent.slice(0, 60)}${intent.length > 60 ? '...' : ''}`,
        tags: ['lovable', 'prompt-engineering', detectedIntent.replace('_', '-')],
        variables: [
          {
            name: 'detected_intent',
            type: 'text',
            required: true,
            description: `Primary intent classification: ${detectedIntent}`
          }
        ],
        metadata: {
          complexity_score: 9,
          creativity_score: 8,
          coherence_score: 10,
          estimated_tokens: 400,
          mode: 'lovable',
          target_platform: 'Lovable.dev',
          detected_intent: detectedIntent,
          template_applied: detectedIntent
        },
        remix_suggestions: [
          'Apply advanced component architecture patterns',
          'Integrate additional safety constraints',
          'Add mobile-first responsive enhancements',
          'Include accessibility considerations'
        ]
      };
    } else {
      // Handle other modes with OpenAI API
      systemPrompt = `${currentMode.systemPromptModifier}

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
