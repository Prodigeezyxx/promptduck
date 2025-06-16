
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { VariableProximity } from '@/components/VariableProximity';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedPromptDisplay } from './AnimatedPromptDisplay';
import { memo, useState } from 'react';
import { SignInDialog } from '@/components/auth/SignInDialog';
import { useAuthContext } from '@/components/auth/AuthProvider';

const OptimizedAnimatedPromptDisplay = memo(AnimatedPromptDisplay);

export function HeroSection() {
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { isSignedIn } = useAuthContext();
  const navigate = useNavigate();

  const handleBuildPrompt = () => {
    if (isSignedIn) {
      // Use React Router navigation instead of window.location.href
      navigate('/app/generator');
    } else {
      // If not signed in, show auth dialog
      setShowSignInDialog(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with new design system */}
      <div className="absolute inset-0 bg-background z-0" />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-background/10 z-15" />
      
      {/* Floating orbs with new accent color */}
      <div className="absolute inset-0 overflow-hidden z-5">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-accent/15 rounded-full blur-2xl sm:blur-3xl will-change-transform" 
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1]
          }} 
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          className="absolute top-3/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-accent/20 rounded-full blur-2xl sm:blur-3xl will-change-transform" 
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }} 
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }} 
        />
      </div>

      <div className="relative z-20 text-center max-w-4xl mx-auto p-fluid-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="space-y-3 sm:space-y-4 lg:space-y-6"
        >
          <div className="inline-flex items-center p-fluid-sm rounded-full glass-morphism text-fluid-sm font-medium text-accent mb-3 lg:mb-6 border border-accent/20">
            <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
            Cognitive prompt engineering
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            <VariableProximity 
              text="prompt" 
              className="text-fluid-6xl md:text-fluid-7xl lg:text-fluid-8xl font-bold bg-gradient-to-r from-primaryText via-accent to-accent/80 bg-clip-text text-transparent leading-tight" 
            />
            <VariableProximity 
              text="like" 
              className="text-fluid-6xl md:text-fluid-7xl lg:text-fluid-8xl font-bold bg-gradient-to-r from-primaryText via-accent to-accent/80 bg-clip-text text-transparent leading-tight" 
            />
            <VariableProximity 
              text="a" 
              className="text-fluid-6xl md:text-fluid-7xl lg:text-fluid-8xl font-bold bg-gradient-to-r from-primaryText via-accent to-accent/80 bg-clip-text text-transparent leading-tight" 
            />
            <VariableProximity 
              text="PRO" 
              className="text-fluid-6xl md:text-fluid-7xl lg:text-fluid-8xl font-bold bg-gradient-to-r from-primaryText via-accent to-accent/80 bg-clip-text text-transparent leading-tight" 
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.6 }} 
            className="text-fluid-lg lg:text-fluid-xl text-secondaryText max-w-2xl mx-auto leading-relaxed p-fluid-xs"
          >
            Transform your ideas into powerful, precise, and effective AI prompts
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.6 }} 
            className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center pt-4 lg:pt-8"
          >
            <Button 
              size="lg" 
              onClick={handleBuildPrompt}
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white p-fluid-md text-fluid-base lg:text-fluid-lg group border-0 shadow-elevation-2 w-full sm:w-auto touch-target"
            >
              Build Your Prompt
              <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="p-fluid-md text-fluid-base lg:text-fluid-lg border-[rgba(255,255,255,0.1)] text-secondaryText hover:bg-surface hover:text-primaryText transition-colors w-full sm:w-auto touch-target"
            >
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.6 }} 
            className="pt-4 lg:pt-8 space-y-2"
          >
            <p className="text-fluid-xs lg:text-fluid-sm text-secondaryText">
              20 free generations daily • No credit card required
            </p>
          </motion.div>
        </motion.div>

        {/* Animated Prompt Display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8, duration: 0.6 }} 
          className="mt-6 lg:mt-12"
        >
          <OptimizedAnimatedPromptDisplay />
        </motion.div>
      </div>

      {/* Sign In Dialog */}
      <SignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </section>
  );
}
