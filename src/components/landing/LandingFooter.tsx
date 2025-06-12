
import { DuckIcon } from '@/components/icons/DuckIcon';

export function LandingFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DuckIcon size={24} />
            <span className="text-lg font-bold gradient-text">PromptDuck</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Documentation
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            with ❤️ from{' '}
            <a 
              href="https://x.com/prodigeezy_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors font-medium"
            >
              prodigeezy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
