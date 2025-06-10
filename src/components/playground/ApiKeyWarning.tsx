
import { AlertCircle } from 'lucide-react';

interface ApiKeyWarningProps {
  isValidKey: boolean;
}

export function ApiKeyWarning({ isValidKey }: ApiKeyWarningProps) {
  if (isValidKey) return null;

  return (
    <div className="mx-4 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          API key required. Please configure your Gemini API key in Settings to test prompts.
        </p>
      </div>
    </div>
  );
}
