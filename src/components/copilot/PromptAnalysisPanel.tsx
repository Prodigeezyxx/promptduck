
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  ChevronDown, 
  ChevronRight, 
  Lightbulb, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Wand2
} from 'lucide-react';
import { PromptAnalysis, PromptIteration } from '@/services/promptAnalysisService';

interface PromptAnalysisPanelProps {
  analysis: PromptAnalysis | null;
  iterations: PromptIteration[];
  onApplyRefinement: (refinedPrompt: string) => void;
  onApplySuggestion: (suggestion: string) => void;
  isAnalyzing?: boolean;
}

export function PromptAnalysisPanel({ 
  analysis, 
  iterations, 
  onApplyRefinement, 
  onApplySuggestion,
  isAnalyzing = false 
}: PromptAnalysisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!analysis && !isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Brain className="w-4 h-4 mr-2" />
            Prompt Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Test a prompt to see intelligent analysis and improvement suggestions
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Brain className="w-4 h-4 mr-2 animate-pulse" />
            Analyzing Prompt...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Evaluating prompt quality and generating suggestions...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-sm">
              <Brain className="w-4 h-4 mr-2" />
              Prompt Analysis
            </CardTitle>
            <Badge variant="outline" className={getQualityColor(analysis.quality_score)}>
              {analysis.quality_score}/10 - {getQualityLabel(analysis.quality_score)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Quality Score</span>
              <span className={`text-sm font-bold ${getQualityColor(analysis.quality_score)}`}>
                {analysis.quality_score}/10
              </span>
            </div>
            <Progress value={analysis.quality_score * 10} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start">
                    <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1 text-yellow-600" />
                Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start">
                    <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="w-3 h-3 mr-1 text-blue-600" />
              Improvement Suggestions
            </h4>
            <div className="space-y-2">
              {analysis.improvement_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2 flex-shrink-0"
                    onClick={() => onApplySuggestion(suggestion)}
                  >
                    Apply
                  </Button>
                  <span className="text-xs text-muted-foreground">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium flex items-center">
                <Wand2 className="w-3 h-3 mr-1 text-purple-600" />
                AI-Refined Version
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplyRefinement(analysis.refined_prompt)}
              >
                Use Refined Version
              </Button>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border">
              <p className="text-xs leading-relaxed">{analysis.refined_prompt}</p>
            </div>
          </div>

          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="text-xs">Analysis Details</span>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {analysis.analysis_reasoning}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {iterations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Version History ({iterations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {iterations.slice(-5).reverse().map((iteration, index) => (
                <div key={iteration.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      Version {iterations.length - index}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score: {iteration.analysis.quality_score}/10
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => onApplyRefinement(iteration.prompt)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
