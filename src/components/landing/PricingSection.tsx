
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '40 daily generations',
      'Basic prompt templates',
      'Community support',
      'Export prompts'
    ],
    cta: 'Get Started',
    href: '/app/library',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'month',
    description: 'For power users and professionals',
    features: [
      '150 generations per day',
      'Advanced heuristics',
      'Priority support',
      'Custom templates',
      'Export to multiple formats',
      'Analytics dashboard'
    ],
    cta: 'Upgrade to Pro',
    href: '/app/library',
    popular: true
  }
];

const PricingCard = memo(({ plan, index }: { plan: typeof plans[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    viewport={{ once: true, margin: "-50px" }}
    className="relative"
  >
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-brand-500 to-purple-600 text-white px-4 py-1">
          Most Popular
        </Badge>
      </div>
    )}
    
    <Card className={`h-full ${plan.popular ? 'border-brand-500 shadow-lg scale-105' : ''} floating-card`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <div className="flex items-baseline justify-center">
          <span className="text-3xl lg:text-4xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground ml-1">/{plan.period}</span>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link to={plan.href} className="block pt-4">
          <Button 
            className={`w-full ${
              plan.popular 
                ? 'bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700' 
                : ''
            }`}
            variant={plan.popular ? 'default' : 'outline'}
            size="lg"
          >
            {plan.popular && <Zap className="w-4 h-4 mr-2" />}
            {plan.cta}
          </Button>
        </Link>
      </CardContent>
    </Card>
  </motion.div>
));

PricingCard.displayName = 'PricingCard';

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
            Choose Your Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade when you need more power
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
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
            All plans include access to our core features and regular updates
          </p>
        </motion.div>
      </div>
    </section>
  );
}
