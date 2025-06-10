
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Zap, Target } from 'lucide-react';

const problems = [
  {
    icon: AlertCircle,
    title: "Vague AI Responses",
    description: "Struggling with unclear, generic AI outputs that don't meet your needs?"
  },
  {
    icon: AlertCircle,
    title: "Prompt Trial & Error",
    description: "Wasting time tweaking prompts without understanding what works?"
  },
  {
    icon: AlertCircle,
    title: "Inconsistent Results",
    description: "Getting different outputs from similar prompts across AI models?"
  }
];

const solutions = [
  {
    icon: CheckCircle,
    title: "Precision Engineering",
    description: "Get exactly what you need from AI, every time with cognitive heuristics"
  },
  {
    icon: Zap,
    title: "Intelligent Generation",
    description: "AI-powered prompt creation with built-in optimization and testing"
  },
  {
    icon: Target,
    title: "Consistent Excellence",
    description: "Reliable, high-quality prompts that work across any AI model"
  }
];

export function ProblemSolutionSection() {
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
            From Frustration to Flow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform common prompt engineering challenges into streamlined success
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problems */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-destructive mb-8">Common Challenges</h3>
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-destructive/20">
                        <problem.icon className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-destructive mb-2">{problem.title}</h4>
                        <p className="text-muted-foreground">{problem.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-green-600 mb-8">PromptDuck Solutions</h3>
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <solution.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">{solution.title}</h4>
                        <p className="text-muted-foreground">{solution.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
