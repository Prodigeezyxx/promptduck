import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Infinity, Zap, Download } from 'lucide-react';

const perks = [
  {
    icon: Infinity,
    title: 'Free to Use',
    description: 'No hidden costs, no trials. Every feature is available to you right now.'
  },
  {
    icon: Zap,
    title: '20 Generations Daily',
    description: 'Enough to refine your prompts every day. Generations reset automatically.'
  },
  {
    icon: Sparkles,
    title: 'All Modes Included',
    description: 'General, Builder, Cursor AI, and Midjourney modes — no paywall.'
  },
  {
    icon: Download,
    title: 'Export & Save',
    description: 'Copy, download, or save prompts to your library. Yours to keep.'
  }
];

export function PricingSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 sm:mb-6">
            Completely Free
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            PromptDuck is free to use. No credit card. No time limit. Just better prompts.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {perks.map((perk, index) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className="h-full text-center">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <perk.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground">{perk.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-8 lg:mt-12"
        >
          <p className="text-sm text-muted-foreground">
            No account required to start. Sign in only if you want cloud sync.
          </p>
        </motion.div>
      </div>
    </section>
  );
}