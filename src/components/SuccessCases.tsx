import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Button } from '@/components/ui/button';

const SuccessCases: React.FC = () => {
  const cases = [
    {
      title: 'Invernadero Inteligente en Almería',
      description: 'Aumento del 40% en producción de tomates con sistema de control climático automático',
      metrics: [
        { label: 'Ahorro de agua', value: '35%' },
        { label: 'Reducción de energía', value: '28%' },
      ],
    },
    {
      title: 'Cultivo de Fresas en Huelva',
      description: 'Monitoreo preciso de nutrientes para calidad premium exportación',
      metrics: [
        { label: 'Aumento calidad', value: '+50%' },
        { label: 'Menos pérdidas', value: '-62%' },
      ],
    },
  ];

  return (
    <section className="py-24 bg-muted/10" id='success-cases'>
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-accent bg-accent/10 rounded-full">
              Casos de Éxito
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Transformación real en el campo
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((caseStudy, index) => (
            <ScrollReveal
              key={index}
              delay={index * 100}
              direction="up"
              className="glass-panel p-8 rounded-3xl border border-border"
            >
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{caseStudy.title}</h3>
                <p className="text-muted-foreground">{caseStudy.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {caseStudy.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="bg-background p-4 rounded-xl text-center"
                    >
                      <div className="text-2xl font-bold text-accent">
                        {metric.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={300} className="mt-12 text-center">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            Ver todos los casos
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SuccessCases;