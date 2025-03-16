
import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Check, Sparkles, Zap, Shield, Palette, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay, className }) => (
  <ScrollReveal delay={delay} direction="up" className="h-full">
    <div className={cn(
      "h-full p-8 rounded-3xl transition-all duration-300 hover:shadow-md",
      "border border-border/50 bg-background hover:bg-secondary/50",
      className
    )}>
      <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </ScrollReveal>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "Intuitive Experience",
      description: "Designed with the user in mind, every interaction feels natural and effortless."
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Optimized performance ensures the smoothest experience without any delays."
    },
    {
      icon: <Shield size={24} />,
      title: "Secure by Default",
      description: "Your data is protected with enterprise-grade security that just works."
    },
    {
      icon: <Check size={24} />,
      title: "Thoughtful Details",
      description: "Every pixel has been considered, creating a harmonious visual experience."
    },
    {
      icon: <Palette size={24} />,
      title: "Elegant Design",
      description: "Clean aesthetics meet functional design, inspired by timeless principles."
    },
    {
      icon: <Layers size={24} />,
      title: "Seamless Integration",
      description: "Works perfectly with your existing workflow and favorite tools."
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      {/* Background elements */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="section-container">
        <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-accent bg-accent/10 rounded-full">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Crafted with attention to every detail
          </h2>
          <p className="text-muted-foreground text-lg">
            We've carefully considered every aspect of the product to deliver an exceptional experience that delights at every interaction.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={100 + index * 50}
              className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
