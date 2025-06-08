
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VariableProximity } from '@/components/VariableProximity';
import { ArrowRight, Sparkles } from 'lucide-react';
import LetterGlitch from '@/components/effects/LetterGlitch';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      {/* Animated background - improved for light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-black light:from-gray-100 light:via-gray-50 light:to-gray-200" />
      
      {/* Light mode overlay */}
      <div className="absolute inset-0 bg-white/90 dark:bg-transparent" />
      
      {/* Floating orbs - reduced purple, improved for light mode */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/20 dark:bg-brand-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 lg:space-y-6"
        >
          <div className="inline-flex items-center px-3 lg:px-4 py-2 rounded-full glass-morphism text-xs lg:text-sm font-medium text-brand-600 dark:text-brand-300 mb-4 lg:mb-6 border border-brand-500/20">
            <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
            Cognitive prompt engineering
          </div>
          
          <VariableProximity 
            text="prompt like a PRO"
            className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-blue-600 dark:from-white dark:via-brand-200 dark:to-blue-200 bg-clip-text text-transparent mb-4 lg:mb-6"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Transform your ideas into powerful AI prompts using cognitive heuristics, 
            archetypal personas, and recursive refinement.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center pt-6 lg:pt-8"
          >
            <Link to="/app">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white px-6 lg:px-8 py-3 text-base lg:text-lg group border-0 shadow-lg shadow-brand-500/25 w-full sm:w-auto"
              >
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-6 lg:px-8 py-3 text-base lg:text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-8 lg:pt-12 text-xs lg:text-sm text-gray-500 dark:text-gray-400"
          >
            <p>40 free generations daily • No credit card required</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
