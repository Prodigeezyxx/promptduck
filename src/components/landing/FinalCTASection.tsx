
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-500 via-blue-600 to-purple-700 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Ready to transform your AI interactions?
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Start Crafting Smarter Prompts Today
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Join thousands of professionals who've revolutionized their AI workflow. 
            It's free to begin, powerful to master.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/app/library">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-xl group shadow-lg w-full sm:w-auto"
              >
                Launch Your AI Co-Pilot Now
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <div className="text-white/80 text-sm">
              <p>Free forever • 40 daily generations • No credit card required</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 text-white/70"
          >
            <p className="text-lg">
              Join <span className="font-semibold text-white">10,000+</span> users crafting superior AI interactions daily
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
