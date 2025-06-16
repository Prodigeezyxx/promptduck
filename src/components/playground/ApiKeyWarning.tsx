
interface ApiKeyWarningProps {
  isValidKey: boolean;
}

export function ApiKeyWarning({ isValidKey }: ApiKeyWarningProps) {
  // Always return null since API key is managed server-side
  return null;
}
