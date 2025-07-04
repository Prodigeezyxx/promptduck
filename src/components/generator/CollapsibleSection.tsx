
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
  className?: string;
  headerClassName?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  storageKey,
  className,
  headerClassName
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Persist state in localStorage if storageKey is provided
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`collapsible-${storageKey}`);
      if (saved !== null) {
        setIsOpen(saved === 'true');
      }
    }
  }, [storageKey]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (storageKey) {
      localStorage.setItem(`collapsible-${storageKey}`, String(newState));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        variant="ghost"
        onClick={handleToggle}
        className={cn(
          "w-full justify-between p-2 h-auto hover:bg-muted/50",
          headerClassName
        )}
      >
        <span className="text-sm font-medium text-left">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 shrink-0" />
        )}
      </Button>
      
      {isOpen && (
        <div className="animate-accordion-down overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
