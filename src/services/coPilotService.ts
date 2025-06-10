
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { HEURISTICS } from '@/constants';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  promptPreview?: string;
  generatedResponse?: string;
  tags?: string[];
}

interface CoPilotResponse {
  message: string;
  promptPreview?: string;
  generatedResponse?: string;
  tags?: string[];
  needsMoreInfo?: boolean;
  suggestedQuestions?: string[];
}

export class CoPilotService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  initialize(apiKey: string) {
    console.log('Initializing Co-Pilot service...');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('Co-Pilot service initialized');
  }

  async processMessage(userMessage: string, conversationHistory: ChatMessage[]): Promise<CoPilotResponse> {
    if (!this.model) {
      throw new Error('Co-Pilot service not initialized');
    }

    console.log('Processing user message:', userMessage);

    // Analyze conversation context
    const context = this.analyzeConversationContext(conversationHistory);
    
    // Determine the appropriate response type
    const responseType = this.determineResponseType(userMessage, context);

    switch (responseType) {
      case 'initial_inquiry':
        return this.handleInitialInquiry(userMessage);
      case 'clarification_needed':
        return this.askClarifyingQuestions(userMessage, context);
      case 'ready_to_generate':
        return this.generatePromptAndTest(userMessage, context);
      case 'refinement_request':
        return this.refineExistingPrompt(userMessage, context);
      default:
        return this.provideContinuousGuidance(userMessage, context);
    }
  }

  private analyzeConversationContext(history: ChatMessage[]) {
    const userMessages = history.filter(m => m.role === 'user').map(m => m.content);
    const hasPromptGenerated = history.some(m => m.promptPreview);
    
    return {
      messageCount: userMessages.length,
      hasPromptGenerated,
      lastUserMessage: userMessages[userMessages.length - 1] || '',
      extractedInfo: this.extractUserInfo(userMessages)
    };
  }

  private extractUserInfo(messages: string[]) {
    const allText = messages.join(' ').toLowerCase();
    
    return {
      goal: this.extractGoal(allText),
      domain: this.extractDomain(allText),
      audience: this.extractAudience(allText),
      constraints: this.extractConstraints(allText),
      tone: this.extractTone(allText)
    };
  }

  private extractGoal(text: string): string | null {
    const goalKeywords = ['want to', 'need to', 'trying to', 'goal is', 'achieve', 'create', 'generate', 'write', 'build'];
    for (const keyword of goalKeywords) {
      if (text.includes(keyword)) {
        return keyword;
      }
    }
    return null;
  }

  private extractDomain(text: string): string | null {
    const domains = {
      'marketing': ['marketing', 'sales', 'advertising', 'promotion', 'campaign'],
      'content': ['content', 'writing', 'blog', 'article', 'copy'],
      'development': ['code', 'programming', 'software', 'app', 'website'],
      'education': ['teaching', 'learning', 'course', 'tutorial', 'education'],
      'creative': ['story', 'creative', 'art', 'design', 'fiction']
    };

    for (const [domain, keywords] of Object.entries(domains)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return domain;
      }
    }
    return null;
  }

  private extractAudience(text: string): string | null {
    const audiences = ['beginners', 'experts', 'professionals', 'students', 'customers', 'users'];
    return audiences.find(audience => text.includes(audience)) || null;
  }

  private extractConstraints(text: string): string[] {
    const constraints = [];
    if (text.includes('short') || text.includes('brief') || text.includes('concise')) {
      constraints.push('length-short');
    }
    if (text.includes('detailed') || text.includes('comprehensive') || text.includes('thorough')) {
      constraints.push('length-detailed');
    }
    if (text.includes('formal')) constraints.push('tone-formal');
    if (text.includes('casual') || text.includes('informal')) constraints.push('tone-casual');
    return constraints;
  }

  private extractTone(text: string): string | null {
    const tones = {
      'professional': ['professional', 'business', 'formal'],
      'friendly': ['friendly', 'warm', 'approachable'],
      'persuasive': ['persuasive', 'convincing', 'compelling'],
      'educational': ['educational', 'informative', 'explanatory']
    };

    for (const [tone, keywords] of Object.entries(tones)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return tone;
      }
    }
    return null;
  }

  private determineResponseType(message: string, context: any): string {
    if (context.messageCount === 1) {
      return 'initial_inquiry';
    }

    if (context.hasPromptGenerated) {
      if (message.toLowerCase().includes('refine') || 
          message.toLowerCase().includes('improve') || 
          message.toLowerCase().includes('change')) {
        return 'refinement_request';
      }
    }

    // Check if we have enough information to generate a prompt
    const info = context.extractedInfo;
    if (info.goal && (info.domain || info.audience)) {
      return 'ready_to_generate';
    }

    return 'clarification_needed';
  }

  private async handleInitialInquiry(message: string): Promise<CoPilotResponse> {
    const info = this.extractUserInfo([message]);
    
    if (info.goal && info.domain) {
      return {
        message: `Great! I understand you want to ${info.goal} something related to ${info.domain}. Let me ask a few questions to create the perfect prompt for you:\n\n1. Who is your target audience?\n2. What tone would you prefer (professional, casual, persuasive)?\n3. Are there any specific requirements or constraints I should know about?`,
        needsMoreInfo: true
      };
    }

    return {
      message: `I'd love to help you create an effective prompt! To get started, could you tell me more about:\n\n1. What specific task or goal do you want to achieve?\n2. What domain or area is this for (e.g., marketing, content creation, coding)?\n3. Who is your intended audience?`,
      needsMoreInfo: true
    };
  }

  private async askClarifyingQuestions(message: string, context: any): Promise<CoPilotResponse> {
    const info = context.extractedInfo;
    const questions = [];

    if (!info.goal) {
      questions.push("What specific outcome are you trying to achieve?");
    }
    if (!info.audience) {
      questions.push("Who is your target audience?");
    }
    if (!info.tone) {
      questions.push("What tone would be most appropriate (professional, casual, persuasive, etc.)?");
    }

    const questionText = questions.length > 1 
      ? `Thanks for that information! I need a bit more detail:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : `Perfect! Just one more question: ${questions[0]}`;

    return {
      message: questionText,
      needsMoreInfo: true,
      suggestedQuestions: questions
    };
  }

  private async generatePromptAndTest(message: string, context: any): Promise<CoPilotResponse> {
    const info = context.extractedInfo;
    const allUserMessages = context.lastUserMessage + ' ' + message;
    
    // Select appropriate heuristics
    const heuristics = selectHeuristics(allUserMessages, '');
    const heuristicsDesc = heuristics.map(h => HEURISTICS[h].description).join(', ');

    try {
      // Generate the prompt
      const promptGenerationRequest = `Based on this conversation, create an optimized AI prompt. 

User wants to: ${info.goal || 'achieve their goal'}
Domain: ${info.domain || 'general'}
Audience: ${info.audience || 'general audience'}
Tone: ${info.tone || 'appropriate'}
Constraints: ${info.constraints.join(', ') || 'none specified'}

Apply these cognitive heuristics: ${heuristicsDesc}

Return a well-structured prompt that will help the user achieve their goal effectively.`;

      const result = await this.model!.generateContent(promptGenerationRequest);
      const generatedPrompt = result.response.text();

      // Test the generated prompt
      const testResult = await this.model!.generateContent(generatedPrompt);
      const testResponse = testResult.response.text();

      return {
        message: `Perfect! I've created a prompt for you and tested it. The generated prompt incorporates ${heuristics.length} cognitive heuristics to ensure effectiveness.\n\nYou can see both the prompt and a sample response in the preview panels. Feel free to ask me to refine it or make any adjustments!`,
        promptPreview: generatedPrompt,
        generatedResponse: testResponse,
        tags: [...heuristics, info.domain || 'general'].filter(Boolean)
      };

    } catch (error) {
      console.error('Error generating prompt:', error);
      return {
        message: "I encountered an issue generating your prompt. Let me try a different approach. Could you rephrase your goal or provide additional context?",
        needsMoreInfo: true
      };
    }
  }

  private async refineExistingPrompt(message: string, context: any): Promise<CoPilotResponse> {
    // Find the last generated prompt from conversation history
    const lastPrompt = [...context.history].reverse().find(m => m.promptPreview)?.promptPreview;
    
    if (!lastPrompt) {
      return {
        message: "I don't see a previous prompt to refine. Let's start fresh - what would you like to achieve?",
        needsMoreInfo: true
      };
    }

    try {
      const refinementRequest = `Refine this prompt based on the user's feedback: "${message}"

Original prompt:
${lastPrompt}

User feedback: ${message}

Provide an improved version that addresses their concerns while maintaining the core effectiveness.`;

      const result = await this.model!.generateContent(refinementRequest);
      const refinedPrompt = result.response.text();

      // Test the refined prompt
      const testResult = await this.model!.generateContent(refinedPrompt);
      const testResponse = testResult.response.text();

      return {
        message: `Great feedback! I've refined the prompt based on your suggestions. The updated version should better meet your needs. Take a look at the new prompt and sample response!`,
        promptPreview: refinedPrompt,
        generatedResponse: testResponse,
        tags: ['refined', 'user-feedback']
      };

    } catch (error) {
      console.error('Error refining prompt:', error);
      return {
        message: "I had trouble refining the prompt. Could you be more specific about what you'd like me to change?",
        needsMoreInfo: true
      };
    }
  }

  private async provideContinuousGuidance(message: string, context: any): Promise<CoPilotResponse> {
    return {
      message: `I understand. Let me help you further. Based on what you've told me, I can:\n\n1. Generate a new prompt from scratch\n2. Refine an existing prompt\n3. Answer questions about prompt engineering\n\nWhat would be most helpful for you right now?`,
      needsMoreInfo: true
    };
  }
}

export const coPilotService = new CoPilotService();
