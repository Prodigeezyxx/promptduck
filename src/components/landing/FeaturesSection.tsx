
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Layers, Zap, Target } from 'lucide-react';
import { memo } from 'react';

const features = [
  {
    icon: Brain,
    title: 'Smart Thinking Tools',
    description: 'Advanced techniques that help you think deeper and solve problems more effectively.',
    color: 'text-blue-500'
  },
  {
    icon: Layers,
    title: 'Choose Your Prompt Style',
    description: 'Pick from different writing styles to match your goal and get better results.',
    color: 'text-purple-500'
  },
  {
    icon: Zap,
    title: 'Smart AI That Delivers',
    description: 'Our optimized AI engine gives you the best responses every time.',
    color: 'text-yellow-500'
  },
  {
    icon: Target,
    title: 'Keeps Prompts On Track',
    description: 'Clear structure that makes your prompts easy to understand and remember.',
    color: 'text-red-500'
  }
];

const FeatureCard = memo(({ feature, index }: { feature: typeof features[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.5 }}
    viewport={{ once: true, margin: "-50px" }}
  >
    <Card className="floating-card h-full will-change-transform">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className={`p-2 sm:p-3 rounded-lg bg-muted ${feature.color} shrink-0`}>
            <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

FeatureCard.displayName = 'FeatureCard';

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 sm:mb-6">
            Get exactly what you need from LLM's, every time.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            PromptDuck unlocks the full Potential of AI by creating prompts that spark awe, action, and clarity.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
