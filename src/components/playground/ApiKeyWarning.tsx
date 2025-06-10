
interface ApiKeyWarningProps {
  isValidKey: boolean;
}

export function ApiKeyWarning({ isValidKey }: ApiKeyWarningProps) {
  // API key is now hardcoded, so no warning is ever needed
  return null;
}
