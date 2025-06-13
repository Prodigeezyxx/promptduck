
import { promptAnalysisService, PromptAnalysis, PromptIteration } from '../promptAnalysisService';

export class IterationManager {
  private iterations: PromptIteration[] = [];

  addIteration(prompt: string, response: string, analysis: PromptAnalysis): PromptIteration {
    const parentId = this.iterations.length > 0 ? this.iterations[this.iterations.length - 1].id : undefined;
    const iteration = promptAnalysisService.createIteration(prompt, response, analysis, parentId);
    this.iterations.push(iteration);
    return iteration;
  }

  getIterations(): PromptIteration[] {
    return [...this.iterations];
  }

  clearIterations(): void {
    this.iterations = [];
  }
}
