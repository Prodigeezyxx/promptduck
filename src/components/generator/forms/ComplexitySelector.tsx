
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ComplexityInfo {
  description: string;
  example: string;
  color: string;
}

interface ComplexitySelectorProps {
  value: 'simple' | 'intermediate' | 'advanced';
  onChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
}

const COMPLEXITY_INFO: Record<string, ComplexityInfo> = {
  simple: {
    description: 'Basic prompts for straightforward tasks',
    example: 'Perfect for quick questions or simple instructions',
    color: 'bg-green-100 text-green-800'
  },
  intermediate: {
    description: 'Balanced prompts with moderate detail',
    example: 'Ideal for most creative and analytical tasks',
    color: 'bg-blue-100 text-blue-800'
  },
  advanced: {
    description: 'Sophisticated prompts with comprehensive context',
    example: 'Best for complex, multi-step reasoning tasks',
    color: 'bg-purple-100 text-purple-800'
  }
};

export function ComplexitySelector({ value, onChange }: ComplexitySelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Complexity Level</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="min-h-[48px] text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(COMPLEXITY_INFO).map(([level, info]) => (
            <SelectItem key={level} value={level} className="text-base">
              <div className="flex items-center space-x-2">
                <Badge className={info.color}>{level}</Badge>
                <div>
                  <div className="font-medium">{info.description}</div>
                  <div className="text-sm text-gray-600">{info.example}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
