
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ScrollReveal from './ScrollReveal';
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Image load with blur effect
    const img = imageRef.current;
    if (img) {
      img.onload = () => {
        img.classList.add('loaded');
      };
    }
    
    // For already cached images
    if (img && img.complete) {
      img.classList.add('loaded');
    }
  }, []);
  
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/5 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <ScrollReveal delay={100} direction="up">
              <div className="inline-block px-3 py-1 mb-5 text-xs font-medium text-accent bg-accent/10 rounded-full">
                Introducing AstroCitrus
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200} direction="up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance mb-6">
                The perfect blend of <span className="text-accent">innovation</span> and <span className="text-accent">simplicity</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={300} direction="up">
              <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto lg:mx-0 mb-8">
                Experience the future of design where every detail has been meticulously crafted for an unparalleled user experience.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={400} direction="up">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Learn More
                </Button>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={500} direction="up">
              <div className="mt-10 text-sm text-muted-foreground">
                <p>Compatible with iOS, macOS, and iPadOS</p>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Image/Visual */}
          <ScrollReveal delay={300} direction="left" className="lg:order-last">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-[32px] blur-2xl transform rotate-6 scale-105"></div>
              <div className="glass-panel rounded-[32px] p-6 shadow-xl">
                <img
                  ref={imageRef}
                  src="https://images.unsplash.com/photo-1629760946330-5f2db17c5318?q=80&w=1000&auto=format&fit=crop"
                  alt="AstroCitrus Product"
                  className="w-full h-auto rounded-2xl object-cover image-blur-load shadow-sm"
                  loading="lazy"
                />
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">AstroCitrus Pro</h3>
                    <p className="text-sm text-muted-foreground">Next generation experience</p>
                  </div>
                  <div className="glass-panel px-3 py-1 rounded-full text-sm">
                    New
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
