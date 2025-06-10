
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Sparkles, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Describe Your Goal',
    description: 'Tell PromptDuck what you want to achieve. Use natural language to describe your intent, context, and desired outcomes.',
    details: ['Natural language input', 'Intent detection', 'Context analysis']
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Enhancement',
    description: 'Our cognitive heuristics engine analyzes your input and applies intelligent optimization rules to craft the perfect prompt.',
    details: ['50+ heuristic rules', 'Archetypal personas', 'Recursive refinement']
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Test & Deploy',
    description: 'Test your enhanced prompt in our playground, refine if needed, and deploy for superior AI interactions across any platform.',
    details: ['Real-time testing', 'Instant feedback', 'Cross-platform use']
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Crafting Perfect Prompts in 3 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From idea to optimized prompt in minutes, not hours
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-brand-500 to-transparent z-0" />
              )}
              
              <Card className="floating-card h-full relative z-10">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="text-6xl font-bold text-brand-500/20 mb-4">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="inline-flex p-4 rounded-full bg-brand-500/20 mb-6">
                    <step.icon className="w-8 h-8 text-brand-500" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Details */}
                  <ul className="space-y-2 text-sm">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center justify-center text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
