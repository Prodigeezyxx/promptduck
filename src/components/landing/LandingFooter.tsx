
import { DuckIcon } from '@/components/icons/DuckIcon';
import { Link } from 'react-router-dom';

export function LandingFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Privacy Policy Banner - More prominent for Google OAuth compliance */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>By using PromptDuck, you agree to our</span>
            <div className="flex items-center gap-2">
              <Link 
                to="/privacy" 
                className="text-brand-500 hover:text-brand-600 transition-colors font-medium underline"
              >
                Privacy Policy
              </Link>
              <span>and</span>
              <Link 
                to="/terms" 
                className="text-brand-500 hover:text-brand-600 transition-colors font-medium underline"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DuckIcon size={24} />
            <span className="text-lg font-bold gradient-text">PromptDuck</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors font-medium">
              Terms of Service
            </Link>
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
