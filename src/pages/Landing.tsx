import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, FileText, Brain, Clock, TrendingUp, CheckCircle } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

const Landing = ({ onLogin }: LandingProps) => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI-Powered Grading",
      description: "Learn your unique grading style and apply it consistently across all assignments"
    },
    {
      icon: <Clock className="h-8 w-8 text-success" />,
      title: "Save Hours Weekly",
      description: "Reduce grading time by up to 80% while maintaining your personal touch"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-warning" />,
      title: "Student Insights",
      description: "Generate personalized improvement plans and track student progress over time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">GradeHelp</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={onLogin}>
              Log In
            </Button>
            <Button onClick={onLogin}>
              Sign Up Free
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Make Grading
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent block">
              Simple
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            AI-powered grading assistant that learns your teaching style and saves hours of work. 
            Grade smarter, not harder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button size="lg" onClick={onLogin} className="text-lg px-8 py-6">
              Start Grading Smarter
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setShowDemo(!showDemo)}
              className="text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">80%</div>
              <div className="text-muted-foreground">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">10k+</div>
              <div className="text-muted-foreground">Assignments Graded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-warning mb-2">500+</div>
              <div className="text-muted-foreground">Happy Teachers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {showDemo && (
        <section className="container mx-auto px-6 py-16 animate-fade-in">
          <Card className="max-w-4xl mx-auto p-8 card-elevated">
            <h3 className="text-2xl font-bold text-center mb-8">See GradeHelp in Action</h3>
            <div className="bg-surface rounded-lg p-6 border">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">Essay_Analysis_StudentA.pdf</span>
                <div className="ml-auto bg-success/10 text-success px-3 py-1 rounded-full text-sm">
                  Graded: A-
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <span>Strong thesis statement with clear argument</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <span>Excellent use of textual evidence</span>
                </div>
                <div className="bg-warning/10 p-3 rounded-lg">
                  <strong className="text-warning">Improvement Area:</strong> Consider stronger transitions between paragraphs to improve flow.
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Grading That Adapts to You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every teacher has their own style. GradeHelp learns yours and applies it consistently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center card-elevated hover:scale-105 transition-transform duration-300">
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Card className="max-w-2xl mx-auto p-12 card-elevated">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Grading?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of teachers who've already saved countless hours with GradeHelp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onLogin} className="text-lg px-8 py-4">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={onLogin} className="text-lg px-8 py-4">
              Schedule Demo
            </Button>
          </div>
        </Card>
      </section>

      {/* Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onLogin} className="flex-1">
            Log In
          </Button>
          <Button onClick={onLogin} className="flex-1">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;