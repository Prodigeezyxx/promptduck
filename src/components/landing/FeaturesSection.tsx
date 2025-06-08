
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Layers, 
  Zap, 
  RefreshCw, 
  Target, 
  Sparkles 
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Cognitive Heuristics',
    description: 'Multi-role collision, contradiction stacking, and recursive refinement for deeper thinking.',
    color: 'text-blue-500'
  },
  {
    icon: Layers,
    title: 'Archetypal Personas',
    description: 'Strategist, Dreamer, Builder, Connector, and Creator personas shape your prompts.',
    color: 'text-purple-500'
  },
  {
    icon: Zap,
    title: 'AI Generation',
    description: 'Google Gemini integration with PromptDuck specification for optimized outputs.',
    color: 'text-yellow-500'
  },
  {
    icon: RefreshCw,
    title: 'Recursive Evolution',
    description: 'Self-evaluating prompts that suggest improvements and remix possibilities.',
    color: 'text-green-500'
  },
  {
    icon: Target,
    title: 'Context Anchoring',
    description: 'Metaphorical and symbolic anchors create coherent, memorable prompt structures.',
    color: 'text-red-500'
  },
  {
    icon: Sparkles,
    title: 'Time Distortion',
    description: 'Nonlinear temporal lenses and past-future mashups for creative perspectives.',
    color: 'text-indigo-500'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Think with AI, not through it
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            PromptDuck combines cognitive science, archetypal thinking, and recursive 
            refinement to create prompts that spark awe, action, and clarity.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="floating-card h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-muted ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
