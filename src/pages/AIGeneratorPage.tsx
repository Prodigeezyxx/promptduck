
import { PromptCoPilot } from '@/components/copilot/PromptCoPilot';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { useApiKeyStore } from '@/store/apiKeyStore';

export default function AIGeneratorPage() {
  const { apiKey } = useApiKeyStore();

  if (!apiKey) {
    return <ApiKeyRequired />;
  }

  return <PromptCoPilot />;
}
