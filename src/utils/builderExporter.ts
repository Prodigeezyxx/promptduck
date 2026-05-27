import { GenerationResult } from '@/types';

export interface BuilderExportFormat {
  // Core prompt data
  title: string;
  description: string;
  optimized_prompt: string;
  
  // Builder-specific metadata
  builder_mode: {
    detected_app_name: string | null;
    app_type: string | null;
    template_type: string | null;
    ai_confidence: number;
    rtcfg_structure: {
      context: string;
      task: string;
      constraints: string;
      format: string;
      goal: string;
    };
  };
  
  // AI reasoning data
  ai_analysis: {
    domain_insights: string[];
    target_audience: string;
    technical_considerations: string[];
    market_context: string;
    competitive_insights: string[];
    user_flow_suggestions: string[];
    design_patterns: string[];
  };
  
  // Original input
  original_input: {
    intent: string;
    context?: string;
    mode: string;
  };
  
  // Standard metadata
  metadata: {
    created_at: string;
    generation_mode: string;
    tags: string[];
    estimated_tokens: number;
    variables: any[];
  };
}

export function convertToBuilderFormat(
  result: GenerationResult,
  originalIntent: string,
  originalContext?: string
): BuilderExportFormat {
  // Extract R-T-C-F-G structure from the prompt
  const rtcfgStructure = extractRTCFGStructure(result.optimized_prompt || result.result);
  
  // Extract app name from metadata or intent
  const detectedAppName = extractAppName(result, originalIntent);
  
  return {
    title: result.preview_title || `Builder App: ${detectedAppName || 'Unnamed'}`,
    description: `AI-generated builder prompt for ${detectedAppName || 'web application'} with R-T-C-F-G structure`,
    optimized_prompt: result.optimized_prompt || result.result,
    
    builder_mode: {
      detected_app_name: detectedAppName,
      app_type: (result.metadata?.project_type as string) || null,
      template_type: (result.metadata?.template_applied as string) || (result.metadata?.detected_intent as string) || null,
      ai_confidence: (result.metadata?.ai_confidence as number) || 7,
      rtcfg_structure: rtcfgStructure
    },
    
    ai_analysis: {
      domain_insights: Array.isArray(result.metadata?.domain_insights) 
        ? result.metadata.domain_insights 
        : result.metadata?.domain_insights 
          ? [result.metadata.domain_insights as string] 
          : [],
      target_audience: (result.metadata?.target_audience_analysis as string) || 'Users seeking efficient solutions',
      technical_considerations: Array.isArray(result.metadata?.technical_considerations) 
        ? result.metadata.technical_considerations 
        : result.metadata?.technical_considerations 
          ? [result.metadata.technical_considerations as string] 
          : [],
      market_context: (result.metadata?.market_context as string) || 'Modern users expect intuitive applications',
      competitive_insights: Array.isArray(result.metadata?.competitive_insights) 
        ? result.metadata.competitive_insights 
        : result.metadata?.competitive_insights 
          ? [result.metadata.competitive_insights as string] 
          : [],
      user_flow_suggestions: Array.isArray(result.metadata?.user_flow_suggestions) 
        ? result.metadata.user_flow_suggestions 
        : result.metadata?.user_flow_suggestions 
          ? [result.metadata.user_flow_suggestions as string] 
          : [],
      design_patterns: Array.isArray(result.metadata?.design_patterns) 
        ? result.metadata.design_patterns 
        : result.metadata?.design_patterns 
          ? [result.metadata.design_patterns as string] 
          : []
    },
    
    original_input: {
      intent: originalIntent,
      context: originalContext,
      mode: 'builder'
    },
    
    metadata: {
      created_at: new Date().toISOString(),
      generation_mode: 'builder',
      tags: result.tags || ['builder', 'rtcfg', 'ai-enhanced'],
      estimated_tokens: result.metadata?.estimated_tokens || 0,
      variables: result.variables || []
    }
  };
}

function extractRTCFGStructure(prompt: string): { context: string; task: string; constraints: string; format: string; goal: string } {
  const sections = {
    context: '',
    task: '',
    constraints: '',
    format: '',
    goal: ''
  };
  
  // Try to extract structured sections from the prompt
  const contextMatch = prompt.match(/CONTEXT:\s*(.*?)(?=\n[A-Z]+:|$)/s);
  const taskMatch = prompt.match(/TASK:\s*(.*?)(?=\n[A-Z]+:|$)/s);
  const constraintsMatch = prompt.match(/CONSTRAINTS:\s*(.*?)(?=\n[A-Z]+:|$)/s);
  const goalMatch = prompt.match(/GOAL:\s*(.*?)(?=\n[A-Z]+:|$)/s);
  
  sections.context = contextMatch?.[1]?.trim() || 'AI Builder context';
  sections.task = taskMatch?.[1]?.trim() || 'Build application';
  sections.constraints = constraintsMatch?.[1]?.trim() || 'Tech stack and performance requirements';
  sections.format = 'Structured development plan with components and database schema';
  sections.goal = goalMatch?.[1]?.trim() || 'Production-ready MVP';
  
  return sections;
}

function extractAppName(result: GenerationResult, originalIntent: string): string | null {
  // Try to extract from metadata first
  if (result.metadata?.project_name) {
    return result.metadata.project_name as string;
  }
  
  // Try to extract from preview title
  if (result.preview_title) {
    const titleMatch = result.preview_title.match(/for\s+"([^"]+)"/);
    if (titleMatch) return titleMatch[1];
  }
  
  // Try to extract from intent
  const intentPatterns = [
    /app\s+called\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /named\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?/i,
    /(?:make|build|create)\s+["']?([a-zA-Z][a-zA-Z0-9\s]{1,20})["']?\s+app/i
  ];
  
  for (const pattern of intentPatterns) {
    const match = originalIntent.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      return match[1].trim();
    }
  }
  
  return null;
}

export function downloadBuilderJSON(
  result: GenerationResult,
  originalIntent: string,
  originalContext?: string
) {
  const builderData = convertToBuilderFormat(result, originalIntent, originalContext);
  const jsonContent = JSON.stringify(builderData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const appName = builderData.builder_mode.detected_app_name || 'builder-app';
  const filename = `${appName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_builder_prompt.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}