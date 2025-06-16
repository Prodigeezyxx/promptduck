
interface ApiKeyWarningProps {
  isValidKey: boolean;
}

export function ApiKeyWarning({ isValidKey }: ApiKeyWarningProps) {
  // API key is now managed server-side, so no warning is needed
  return null;
}
