
import { IntentType } from '../intent/intentDetection';
import { HeuristicType } from '@/types';

export interface PromptTemplate {
  id: string;
  name: string;
  intent: IntentType;
  template: (input: string, context?: string) => string;
  requiredHeuristics: HeuristicType[];
  optionalHeuristics: HeuristicType[];
  complexity: 'simple' | 'intermediate' | 'advanced';
  tags: string[];
}

export const ENHANCED_TEMPLATES: Record<IntentType, PromptTemplate[]> = {
  instructional: [
    {
      id: 'instructional-comprehensive',
      name: 'Technical Documentation Framework',
      intent: 'instructional',
      template: (input, context) => 
        `Generate comprehensive technical documentation for: ${input}${context ? `\n\nSpecifications: ${context}` : ''}\n\nStructure the output with:\n1. Technical overview and requirements\n2. Step-by-step implementation procedures\n3. Configuration parameters and dependencies\n4. Validation criteria and testing procedures\n5. Troubleshooting specifications and error handling`,
      requiredHeuristics: ['multi_role_collision', 'recursive_refinement'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'advanced',
      tags: ['technical', 'documentation', 'systematic']
    },
    {
      id: 'instructional-procedural',
      name: 'Procedural Implementation Guide',
      intent: 'instructional',
      template: (input, context) => 
        `Create step-by-step implementation procedures for: ${input}${context ? ` (Technical context: ${context})` : ''}\n\nProvide numbered sequential steps with technical specifications and measurable outcomes.`,
      requiredHeuristics: ['recursive_refinement'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'intermediate',
      tags: ['procedural', 'systematic', 'implementation']
    }
  ],
  
  code: [
    {
      id: 'code-technical-implementation',
      name: 'Technical Code Implementation',
      intent: 'code',
      template: (input, context) => 
        `Implement the following technical specification: ${input}${context ? `\n\nTechnical requirements: ${context}` : ''}\n\nProvide:\n1. Complete implementation with inline documentation\n2. Technical specifications and dependencies\n3. Error handling and validation procedures\n4. Performance considerations and optimization notes\n5. Testing framework and verification methods`,
      requiredHeuristics: ['self_repairing', 'recursive_refinement'],
      optionalHeuristics: ['multi_role_collision'],
      complexity: 'advanced',
      tags: ['implementation', 'technical', 'systematic']
    },
    {
      id: 'code-analysis',
      name: 'Code Analysis and Optimization',
      intent: 'code',
      template: (input, context) => 
        `Analyze and optimize the following code implementation: ${input}${context ? `\n\nTechnical context: ${context}` : ''}\n\nProvide:\n1. Technical analysis of current implementation\n2. Identified issues and optimization opportunities\n3. Refactored code with improvements\n4. Performance metrics and security considerations\n5. Testing specifications and validation procedures`,
      requiredHeuristics: ['self_repairing', 'multi_role_collision'],
      optionalHeuristics: ['recursive_refinement'],
      complexity: 'advanced',
      tags: ['analysis', 'optimization', 'technical-review']
    }
  ],

  analytical: [
    {
      id: 'analytical-technical',
      name: 'Technical Analysis Framework',
      intent: 'analytical',
      template: (input, context) => 
        `Conduct technical analysis of: ${input}${context ? `\n\nAnalysis parameters: ${context}` : ''}\n\nStructure the analysis with:\n1. Technical overview and scope definition\n2. Data examination and methodology\n3. Quantitative findings with supporting evidence\n4. Technical implications and constraints\n5. Actionable recommendations with implementation specifications`,
      requiredHeuristics: ['multi_role_collision', 'contradiction_stacking'],
      optionalHeuristics: ['recursive_refinement'],
      complexity: 'advanced',
      tags: ['analysis', 'technical', 'data-driven']
    }
  ],

  creative: [
    {
      id: 'creative-structured',
      name: 'Structured Content Generation',
      intent: 'creative',
      template: (input, context) => 
        `Generate structured content based on: ${input}${context ? `\n\nContent specifications: ${context}` : ''}\n\nProvide:\n1. Content framework and structural elements\n2. Technical specifications for each component\n3. Implementation guidelines and formatting requirements\n4. Quality metrics and validation criteria\n5. Optimization recommendations for target audience`,
      requiredHeuristics: ['contradiction_stacking', 'time_distortion'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'intermediate',
      tags: ['structured', 'content-generation', 'systematic']
    }
  ],

  conversational: [
    {
      id: 'conversational-technical',
      name: 'Technical Information Exchange',
      intent: 'conversational',
      template: (input, context) => 
        `Provide technical information regarding: ${input}${context ? ` (Context: ${context})` : ''}\n\nDeliver factual, structured information with clear explanations and actionable details.`,
      requiredHeuristics: ['context_anchoring'],
      optionalHeuristics: [],
      complexity: 'simple',
      tags: ['informational', 'technical', 'factual']
    }
  ],

  business: [
    {
      id: 'business-technical',
      name: 'Business Process Framework',
      intent: 'business',
      template: (input, context) => 
        `Develop systematic business approach for: ${input}${context ? `\n\nBusiness parameters: ${context}` : ''}\n\nProvide:\n1. Situation analysis with quantifiable metrics\n2. Strategic framework with implementation steps\n3. Resource requirements and technical specifications\n4. Execution timeline with measurable milestones\n5. Success metrics and monitoring procedures`,
      requiredHeuristics: ['multi_role_collision', 'recursive_refinement'],
      optionalHeuristics: ['contradiction_stacking'],
      complexity: 'advanced',
      tags: ['business-process', 'systematic', 'implementation']
    }
  ],

  technical: [
    {
      id: 'technical-architecture',
      name: 'Technical Architecture Specification',
      intent: 'technical',
      template: (input, context) => 
        `Design technical architecture for: ${input}${context ? `\n\nTechnical constraints: ${context}` : ''}\n\nProvide:\n1. Architecture overview with component specifications\n2. Technical design patterns and implementation details\n3. Technology stack selection with justification\n4. Scalability framework and performance specifications\n5. Risk assessment and mitigation procedures`,
      requiredHeuristics: ['self_repairing', 'multi_role_collision'],
      optionalHeuristics: ['recursive_refinement'],
      complexity: 'advanced',
      tags: ['architecture', 'technical-design', 'systematic']
    }
  ],

  unknown: [
    {
      id: 'unknown-specification',
      name: 'Requirement Specification',
      intent: 'unknown',
      template: (input, context) => 
        `Analyze and clarify the following requirement: ${input}${context ? `\n\nAdditional context: ${context}` : ''}\n\nProvide technical clarification questions and suggest structured approaches for requirement refinement.`,
      requiredHeuristics: ['multi_role_collision'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'intermediate',
      tags: ['specification', 'clarification', 'systematic']
    }
  ]
};

export class PromptTemplateEngine {
  static getTemplatesForIntent(intent: IntentType): PromptTemplate[] {
    return ENHANCED_TEMPLATES[intent] || ENHANCED_TEMPLATES.unknown;
  }

  static getBestTemplate(intent: IntentType, complexity: 'simple' | 'intermediate' | 'advanced'): PromptTemplate {
    const templates = this.getTemplatesForIntent(intent);
    
    // Find template matching complexity, or fallback to first available
    const matchingTemplate = templates.find(t => t.complexity === complexity);
    return matchingTemplate || templates[0];
  }

  static applyTemplate(template: PromptTemplate, input: string, context?: string): string {
    return template.template(input, context);
  }

  static getAllTemplates(): PromptTemplate[] {
    return Object.values(ENHANCED_TEMPLATES).flat();
  }
}
