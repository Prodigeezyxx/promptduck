
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { memo } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '40 daily generations',
      'All cognitive heuristics',
      'All personas available',
      'Basic prompt library',
      'Community support'
    ],
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'month',
    description: 'For power users and teams',
    features: [
      'Unlimited generations',
      'Advanced prompt chains',
      'Custom system prompts',
      'Export capabilities',
      'Priority support',
      'Analytics dashboard'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For organizations at scale',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom integrations',
      'SSO & security',
      'Dedicated support',
      'Custom training'
    ],
    highlighted: false
  }
];

const PricingCard = memo(({ plan, index }: { plan: typeof plans[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    viewport={{ once: true, margin: "-50px" }}
    className={plan.highlighted ? 'sm:scale-105' : ''}
  >
    <Card className={`relative h-full will-change-transform ${plan.highlighted ? 'ring-2 ring-primary shadow-xl sm:shadow-2xl' : ''}`}>
      {plan.highlighted && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-500 to-purple-600 text-xs sm:text-sm">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-6 sm:pb-8">
        <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
        <div className="space-y-2">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
            <span className="text-sm sm:text-base text-muted-foreground">/{plan.period}</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">{plan.description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        <ul className="space-y-2 sm:space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center space-x-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full min-h-[44px] ${
            plan.highlighted 
              ? 'bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700' 
              : ''
          }`}
          variant={plan.highlighted ? 'default' : 'outline'}
          size="lg"
        >
          {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
));

PricingCard.displayName = 'PricingCard';

export function PricingSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 sm:mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no complex tiers.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
