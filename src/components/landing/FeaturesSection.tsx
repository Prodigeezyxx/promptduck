
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  BookOpen, 
  PlayCircle, 
  Brain, 
  Zap, 
  RefreshCw 
} from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI Prompt Generator',
    badge: 'Core Feature',
    description: 'Intelligent prompt creation using cognitive heuristics and archetypal personas. Transform your ideas into optimized prompts with built-in enhancement rules.',
    highlights: ['50+ cognitive heuristics', 'Intent-based optimization', 'Real-time generation'],
    image: '/placeholder.svg'
  },
  {
    icon: BookOpen,
    title: 'Smart Prompt Library',
    badge: 'Organization',
    description: 'Organize, search, and manage your prompts with intelligent categorization. Auto-tagging and advanced filtering make finding the perfect prompt effortless.',
    highlights: ['Auto-categorization', 'Advanced search', 'Usage analytics'],
    image: '/placeholder.svg'
  },
  {
    icon: PlayCircle,
    title: 'Interactive Playground',
    badge: 'Testing',
    description: 'Test and refine your prompts in real-time with direct AI integration. Chat interface with typing animations and comprehensive error handling.',
    highlights: ['Real-time testing', 'Multiple AI models', 'Conversation history'],
    image: '/placeholder.svg'
  }
];

const heuristics = [
  {
    icon: Brain,
    title: 'Cognitive Heuristics',
    description: 'Multi-role collision, contradiction stacking, and recursive refinement for deeper AI thinking.',
    color: 'text-blue-500'
  },
  {
    icon: Zap,
    title: 'Intent Detection',
    description: 'Automatically identify prompt intent and apply relevant optimization rules for maximum effectiveness.',
    color: 'text-yellow-500'
  },
  {
    icon: RefreshCw,
    title: 'Recursive Enhancement',
    description: 'Self-improving prompts that evolve and suggest optimizations based on performance.',
    color: 'text-green-500'
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
            Unlock AI's Full Potential
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore powerful features designed to make prompt engineering effortless, intelligent, and effective
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="space-y-24 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-brand-500/20">
                    <feature.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                
                <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center text-muted-foreground">
                      <div className="w-2 h-2 bg-brand-500 rounded-full mr-3" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <img 
                      src={feature.image} 
                      alt={`${feature.title} interface`}
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heuristics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold gradient-text mb-4">
            Powered by Advanced Cognitive Science
          </h3>
          <p className="text-lg text-muted-foreground">
            Our intelligent heuristics engine applies proven cognitive techniques
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {heuristics.map((heuristic, index) => (
            <motion.div
              key={heuristic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="floating-card h-full">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-lg bg-muted mb-4 ${heuristic.color}`}>
                    <heuristic.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{heuristic.title}</h4>
                  <p className="text-muted-foreground">
                    {heuristic.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
