
import { Link } from 'react-router-dom';
import { DuckIcon } from '@/components/icons/DuckIcon';

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <DuckIcon size={32} />
              <h3 className="text-xl font-bold gradient-text">PromptDuck</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Cognitive prompt engineering for the modern creator.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/app" className="hover:text-foreground transition-colors">Prompt Generator</Link></li>
              <li><Link to="/app" className="hover:text-foreground transition-colors">Library</Link></li>
              <li><Link to="/app" className="hover:text-foreground transition-colors">Playground</Link></li>
              <li><Link to="/app" className="hover:text-foreground transition-colors">System Editor</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Examples</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>&copy; 2025 PromptDuck. All rights reserved.</p>
          <p className="text-xs">
            Built with love by{' '}
            <a 
              href="https://x.com/prodiggezy_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-500 hover:text-brand-600 transition-colors font-medium"
            >
              prodigeezy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
