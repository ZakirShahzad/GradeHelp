import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Check, Zap, Crown, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentPlans = () => {
  const plans = [
    {
      name: "Free",
      icon: <GraduationCap className="h-8 w-8 text-muted-foreground" />,
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI grading",
      features: [
        "5 assignments per month",
        "Basic AI grading",
        "Simple feedback generation",
        "Email support"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      icon: <Zap className="h-8 w-8 text-primary" />,
      price: "$19",
      period: "per month",
      description: "Ideal for active teachers who grade regularly",
      features: [
        "Unlimited assignments",
        "Advanced AI grading",
        "Custom grading criteria",
        "Detailed analytics",
        "Priority support",
        "Bulk grading tools"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Team",
      icon: <Users className="h-8 w-8 text-warning" />,
      price: "$49",
      period: "per month",
      description: "Perfect for departments and schools",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Admin dashboard",
        "Custom integrations",
        "Dedicated support",
        "Training sessions",
        "Up to 10 teachers"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">GradeHelp</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Choose Your
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent block">
              Grading Plan
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
            Select the perfect plan for your grading needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 card-elevated relative ${
                plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-8">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.buttonVariant} 
                className="w-full"
                size="lg"
                asChild
              >
                <Link to="/auth">{plan.buttonText}</Link>
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions about our plans? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center pb-8">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentPlans;