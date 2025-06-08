
import { Link } from 'react-router-dom';

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🦆</span>
              </div>
              <h3 className="text-xl font-bold gradient-text">PromptDuck</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Cognitive prompt engineering for the modern creator.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/app" className="hover:text-foreground">Prompt Generator</Link></li>
              <li><Link to="/app" className="hover:text-foreground">Library</Link></li>
              <li><Link to="/app" className="hover:text-foreground">Playground</Link></li>
              <li><Link to="/app" className="hover:text-foreground">System Editor</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground">Examples</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PromptDuck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
