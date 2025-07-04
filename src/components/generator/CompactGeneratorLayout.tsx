
import { useState, useRef, useEffect } from 'react';
import { CompactSideNav } from './CompactSideNav';
import { TabbedWorkspace } from './TabbedWorkspace';
import { FloatingActionBar } from './FloatingActionBar';
import { CollapsibleSection } from './CollapsibleSection';
import { ModeSelector } from './ModeSelector';
import { VirtualizedSuggestions } from './VirtualizedSuggestions';
import { GenerationResult, ModeType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CompactGeneratorLayoutProps {
  intent: string;
  context: string;
  selectedMode: ModeType;
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onModeChange: (mode: ModeType) => void;
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
  onStartNewPrompt: () => void;
  onClearTemplate: () => void;
  originalIntent?: string;
  originalContext?: string;
}

export function CompactGeneratorLayout({
  intent,
  context,
  selectedMode,
  isGenerating,
  lastResult,
  onIntentChange,
  onContextChange,
  onModeChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt,
  onClearTemplate,
  originalIntent,
  originalContext
}: CompactGeneratorLayoutProps) {
  const [activeSection, setActiveSection] = useState('input');
  const isMobile = useIsMobile();
  
  // Section refs for smooth scrolling
  const modeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Calculate token count for floating bar
  const tokenCount = Math.ceil(`${intent} ${context}`.trim().length / 4);
  const canGenerate = intent.trim().length > 0;

  // Intersection observer for active section tracking
  useEffect(() => {
    const sections = [
      { id: 'mode', ref: modeRef },
      { id: 'input', ref: inputRef },
      { id: 'output', ref: outputRef },
      { id: 'suggestions', ref: suggestionsRef }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach(({ id, ref }) => {
      if (ref.current) {
        ref.current.setAttribute('data-section', id);
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleSectionClick = (sectionId: string) => {
    const refs = {
      mode: modeRef,
      input: inputRef,
      output: outputRef,
      suggestions: suggestionsRef
    };

    const targetRef = refs[sectionId as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Side Navigation */}
      <CompactSideNav
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        intent={intent}
        context={context}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "ml-0" : "ml-16", // Adjust for collapsed nav
        "max-w-6xl mx-auto px-4 py-6 space-y-8"
      )}>
        
        {/* Mode Selector Section */}
        <section ref={modeRef} className="scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-brand-500 to-purple-600 rounded-full" />
            <h2 className="text-lg font-semibold">Generation Mode</h2>
          </div>
          
          <CollapsibleSection
            title="Advanced Mode Settings"
            defaultOpen={false}
            storageKey="mode-settings"
          >
            <ModeSelector
              selectedMode={selectedMode}
              onModeChange={onModeChange}
            />
          </CollapsibleSection>
        </section>

        {/* Input/Output Workspace */}
        <section ref={inputRef} className="scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-brand-500 to-purple-600 rounded-full" />
            <h2 className="text-lg font-semibold">Workspace</h2>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <TabbedWorkspace
              intent={intent}
              context={context}
              selectedMode={selectedMode}
              isGenerating={isGenerating}
              lastResult={lastResult}
              onIntentChange={onIntentChange}
              onContextChange={onContextChange}
              onModeChange={onModeChange}
              onGenerate={onGenerate}
              onCopyPrompt={onCopyPrompt}
              onSavePrompt={onSavePrompt}
              onRemixSuggestion={onRemixSuggestion}
              onStartNewPrompt={onStartNewPrompt}
              originalIntent={originalIntent}
              originalContext={originalContext}
            />
          </div>
        </section>

        {/* Output Reference (for nav) */}
        <div ref={outputRef} className="scroll-mt-24" />

        {/* Enhancement Suggestions */}
        {lastResult?.remix_suggestions && lastResult.remix_suggestions.length > 0 && (
          <section ref={suggestionsRef} className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-brand-500 to-purple-600 rounded-full" />
              <h2 className="text-lg font-semibold">Enhancement Suggestions</h2>
            </div>
            
            <CollapsibleSection
              title={`${lastResult.remix_suggestions.length} Suggestions Available`}
              defaultOpen={false}
              storageKey="enhancement-suggestions"
            >
              <VirtualizedSuggestions
                suggestions={lastResult.remix_suggestions}
                onRemixSuggestion={onRemixSuggestion}
                maxHeight={250}
              />
            </CollapsibleSection>
          </section>
        )}
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        isGenerating={isGenerating}
        onGenerate={onGenerate}
        canGenerate={canGenerate}
        tokenCount={tokenCount}
      />
    </div>
  );
}
