
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VariableProximity } from '@/components/VariableProximity';
import { ArrowRight, Sparkles } from 'lucide-react';
import RainEffect from '@/components/effects/RainEffect';
import { AnimatedPromptDisplay } from './AnimatedPromptDisplay';
import { memo } from 'react';

const OptimizedRainEffect = memo(RainEffect);
const OptimizedAnimatedPromptDisplay = memo(AnimatedPromptDisplay);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 dark:from-gray-950 dark:via-gray-900 dark:to-black z-0" />
      
      {/* Rain effect background - Higher z-index */}
      <div className="absolute inset-0 z-10">
        <OptimizedRainEffect />
      </div>

      {/* Very light overlay to not completely hide rain */}
      <div className="absolute inset-0 bg-white/10 dark:bg-transparent z-15" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden z-5">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-brand-500/15 dark:bg-brand-500/10 rounded-full blur-2xl sm:blur-3xl will-change-transform" 
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
          className="absolute top-3/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl will-change-transform" 
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

      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="space-y-3 sm:space-y-4 lg:space-y-6"
        >
          <div className="inline-flex items-center px-3 lg:px-4 py-2 rounded-full glass-morphism text-xs lg:text-sm font-medium text-brand-600 dark:text-brand-300 mb-3 lg:mb-6 border border-brand-500/20">
            <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
            Cognitive prompt engineering
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            <VariableProximity 
              text="prompt" 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-blue-600 dark:from-white dark:via-brand-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight" 
            />
            <VariableProximity 
              text="like" 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-blue-600 dark:from-white dark:via-brand-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight" 
            />
            <VariableProximity 
              text="a" 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-blue-600 dark:from-white dark:via-brand-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight" 
            />
            <VariableProximity 
              text="PRO" 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-blue-600 dark:from-white dark:via-brand-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight" 
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.6 }} 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Transform your ideas into powerful, precise, and effective AI prompts
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.6 }} 
            className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center pt-4 lg:pt-8"
          >
            <Link to="/app/library">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white px-6 lg:px-8 py-3 text-sm sm:text-base lg:text-lg group border-0 shadow-lg shadow-brand-500/25 w-full sm:w-auto min-h-[44px]"
              >
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-6 lg:px-8 py-3 text-sm sm:text-base lg:text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors w-full sm:w-auto min-h-[44px]"
            >
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.6 }} 
            className="pt-4 lg:pt-8 text-xs lg:text-sm text-gray-500 dark:text-gray-400"
          >
            <p>20 free generations daily • No credit card required</p>
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
    </section>
  );
}
