import { DuckIcon } from '@/components/icons/DuckIcon';
import { Link } from 'react-router-dom';

export function LandingFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] bg-surface/95 backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        {/* Privacy Policy Banner - More prominent for Google OAuth compliance */}
        <div className="mb-6 p-4 surface-style rounded-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-secondaryText">
            <span>By using PromptDuck, you agree to our</span>
            <div className="flex items-center gap-2">
              <Link 
                to="/privacy"
                className="text-accent hover:text-accent/80 transition-colors font-medium underline"
              >
                Privacy Policy
              </Link>
              <span>and</span>
              <Link 
                to="/terms" 
                className="text-accent hover:text-accent/80 transition-colors font-medium underline"
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
          
          <div className="flex items-center gap-6 text-sm text-secondaryText">
            <a href="#" className="hover:text-primaryText transition-colors">
              Documentation
            </a>
          </div>
          
          <div className="text-sm text-secondaryText">
            with ❤️ from{' '}
            <a 
              href="https://x.com/prodigeezy_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primaryText transition-colors font-medium"
            >
              prodigeezy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
