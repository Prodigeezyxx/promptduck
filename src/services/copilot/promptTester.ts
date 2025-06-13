
import { openaiService } from '../openaiService';
import { promptAnalysisService } from '../promptAnalysisService';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { CoPilotMessage } from './types';
import { MessageGenerator } from './messageGenerator';
import { PromptProcessor } from './promptProcessor';

export class PromptTester {
  constructor(
    private promptProcessor: PromptProcessor,
    private addIteration: (prompt: string, response: string, analysis: any) => any
  ) {}

  async handlePromptTesting(promptText: string): Promise<CoPilotMessage> {
    this.promptProcessor.setCurrentIntent(promptText);
    this.promptProcessor.setCurrentPrompt(promptText);

    if (!promptText) {
      return MessageGenerator.createAssistantMessage(
        "Please provide a prompt to test. Example: 'test prompt: write a poem about a duck'"
      );
    }

    try {
      const selectedHeuristics = selectHeuristics(promptText, '');
      const result = await openaiService.generatePrompt({
        intent: promptText,
        heuristics: selectedHeuristics,
        complexity: 'intermediate'
      });

      // After getting the response, analyze it
      console.log('Analyzing prompt performance...');
      const analysis = await promptAnalysisService.analyzePromptAndResponse(
        this.promptProcessor.getCurrentPrompt(),
        result.optimized_prompt,
        this.promptProcessor.getCurrentIntent()
      );
      
      // Add this iteration to history
      const iteration = this.addIteration(
        this.promptProcessor.getCurrentPrompt(),
        result.optimized_prompt,
        analysis
      );

      return MessageGenerator.createAssistantMessage(result.optimized_prompt, {
        prompt_used: this.promptProcessor.getCurrentPrompt(),
        heuristics: selectedHeuristics,
        analysis: analysis,
        iteration_count: iteration ? 1 : 0
      });
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      return MessageGenerator.createErrorMessage('generating a response');
    }
  }
}
