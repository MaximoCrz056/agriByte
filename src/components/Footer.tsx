
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import ScrollReveal from './ScrollReveal';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-muted/30 pt-16 pb-8 border-t border-border">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Logo and about */}
          <ScrollReveal direction="up" className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <AnimatedLogo className="h-8 w-8 text-primary" />
              <span className="font-semibold text-lg">AstroCitrus</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Elevating digital experiences through minimalist design and intuitive interactions. Our commitment is to create products that are both beautiful and functional.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4"></div>
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Links */}
          <ScrollReveal delay={100} direction="up">
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Testimonials', 'FAQs'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <ScrollReveal direction="up">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AstroCitrus. All rights reserved.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full mt-4 sm:mt-0"
              onClick={scrollToTop}
            >
              <ArrowUp size={16} />
              <span className="sr-only">Back to top</span>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
