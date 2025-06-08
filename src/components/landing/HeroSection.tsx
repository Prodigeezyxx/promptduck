
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

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-black" />
      
      {/* Floating orbs */}
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
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
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
          className="space-y-6"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-morphism text-sm font-medium text-brand-300 dark:text-brand-200 mb-6 border border-brand-500/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Cognitive prompt engineering
          </div>
          
          <VariableProximity 
            text="prompt like a PRO"
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-brand-200 to-purple-200 bg-clip-text text-transparent mb-6"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your ideas into powerful AI prompts using cognitive heuristics, 
            archetypal personas, and recursive refinement.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link to="/app">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white px-8 py-3 text-lg group border-0 shadow-lg shadow-brand-500/25"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-12 text-sm text-gray-400"
          >
            <p>40 free generations daily • No credit card required</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
