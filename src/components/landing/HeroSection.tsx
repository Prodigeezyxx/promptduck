
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VariableProximity } from '@/components/VariableProximity';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import LetterGlitch from '@/components/effects/LetterGlitch';
import { AnimatedPromptDisplay } from './AnimatedPromptDisplay';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Matrix background effect */}
      <div className="absolute inset-0">
        <LetterGlitch
          glitchColors={["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"]}
          glitchSpeed={100}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
        />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 dark:from-gray-950 dark:via-gray-900 dark:to-black" />
      
      {/* Light mode overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/15 dark:bg-brand-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 lg:space-y-6"
        >
          <div className="inline-flex items-center px-3 lg:px-4 py-2 rounded-full glass-morphism text-xs lg:text-sm font-medium text-brand-600 dark:text-brand-300 mb-4 lg:mb-6 border border-brand-500/20">
            <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
            Your AI Prompt Engineering Co-Pilot
          </div>
          
          <VariableProximity 
            text="Prompt Smarter, Not Harder"
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-blue-600 dark:from-white dark:via-brand-200 dark:to-blue-200 bg-clip-text text-transparent mb-4 lg:mb-6 leading-tight"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-2"
          >
            Transform your ideas into powerful, precise AI prompts with intelligent cognitive heuristics, 
            interactive testing, and seamless prompt management. Designed for everyone, from developers to creatives.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center pt-6 lg:pt-8"
          >
            <Link to="/app/library">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white px-8 lg:px-10 py-4 text-lg lg:text-xl group border-0 shadow-lg shadow-brand-500/25 w-full sm:w-auto"
              >
                Launch Your AI Co-Pilot
                <ArrowRight className="ml-2 h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 lg:px-10 py-4 text-lg lg:text-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors w-full sm:w-auto group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-6 lg:pt-8 text-sm lg:text-base text-gray-500 dark:text-gray-400"
          >
            <p>Free forever • 40 daily generations • No credit card required</p>
          </motion.div>
        </motion.div>

        {/* Animated Prompt Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 lg:mt-16"
        >
          <AnimatedPromptDisplay />
        </motion.div>
      </div>
    </section>
  );
}
