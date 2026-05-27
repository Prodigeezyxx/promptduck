import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GenerationResult } from '@/types';
import { Brain, Target, Zap, Code, Users } from 'lucide-react';

interface BuilderModeDisplayProps {
  result: GenerationResult;
}

export function BuilderModeDisplay({ result }: BuilderModeDisplayProps) {
  // Extract Builder-specific metadata with proper type safety
  const appType = (result.metadata?.project_type as string) || 'application';
  const templateUsed = (result.metadata?.template_applied as string) || (result.metadata?.detected_intent as string);
  const aiConfidence = (result.metadata?.ai_confidence as number) || 7;
  const domainResearch = result.metadata?.domain_research as boolean;
  const appName = result.metadata?.app_name as string;
  const nameLocked = result.metadata?.name_locked as boolean;
  const nameConsistencyEnforced = result.metadata?.name_consistency_enforced as boolean;
  
  // Extract AI insights with proper type handling
  const domainInsights = Array.isArray(result.metadata?.domain_insights) 
    ? result.metadata.domain_insights 
    : result.metadata?.domain_insights 
      ? [result.metadata.domain_insights as string] 
      : [];
  const targetAudience = result.metadata?.target_audience_analysis as string;
  const technicalConsiderations = Array.isArray(result.metadata?.technical_considerations) 
    ? result.metadata.technical_considerations 
    : result.metadata?.technical_considerations 
      ? [result.metadata.technical_considerations as string] 
      : [];

  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Brain className="w-4 h-4" />
          Builder Mode Intelligence
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* App Type & Template */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Target className="w-3 h-3 mr-1" />
            {appType.replace('_', ' ')}
          </Badge>
          {templateUsed && (
            <Badge variant="outline" className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400">
              <Code className="w-3 h-3 mr-1" />
              {templateUsed.replace('_', ' ')} template
            </Badge>
          )}
          {appName && (
            <Badge variant={nameLocked ? "default" : "secondary"} className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <Target className="w-3 h-3 mr-1" />
              {appName} {nameLocked ? "🔒" : "🤖"}
            </Badge>
          )}
          <Badge variant="outline" className="border-green-300 text-green-600 dark:border-green-700 dark:text-green-400">
            <Zap className="w-3 h-3 mr-1" />
            {aiConfidence}/10 confidence
          </Badge>
          {domainResearch && (
            <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
              <Brain className="w-3 h-3 mr-1" />
              AI research applied
            </Badge>
          )}
          {nameConsistencyEnforced && (
            <Badge variant="outline" className="border-green-300 text-green-600 dark:border-green-700 dark:text-green-400">
              ✓ Name consistency
            </Badge>
          )}
        </div>

        {/* Key Insights */}
        {(appName || domainInsights.length > 0 || targetAudience || technicalConsiderations.length > 0) && (
          <div className="space-y-3">
            {appName && (
              <div>
                <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  App Name {nameLocked ? "(Detected)" : "(Generated)"}
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {nameLocked 
                    ? `Extracted "${appName}" from your prompt` 
                    : `AI generated "${appName}" based on your project type and description`
                  }
                </p>
              </div>
            )}

            {domainInsights.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Domain Insights
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {Array.isArray(domainInsights) ? domainInsights.slice(0, 2).join('. ') : domainInsights}
                </p>
              </div>
            )}
            
            {targetAudience && (
              <div>
                <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Target Users
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">{targetAudience}</p>
              </div>
            )}
            
            {technicalConsiderations.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  Technical Focus
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {Array.isArray(technicalConsiderations) ? technicalConsiderations.slice(0, 2).join(', ') : technicalConsiderations}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}