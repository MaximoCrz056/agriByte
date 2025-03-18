import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { MessageCircle, HandHelping } from "lucide-react";

const Support: React.FC = () => {
  const faqs = [
    {
      question: '¿Cómo configuro mi sistema por primera vez?',
      answer: 'Nuestro equipo de soporte te guiará paso a paso en la instalación y configuración inicial.'
    },
    {
      question: '¿Qué hacer en caso de fallos del sensor?',
      answer: 'Contamos con protocolos de diagnóstico remoto y soporte técnico 24/7 para resolver cualquier incidencia.'
    },
    {
      question: '¿Cómo actualizo el software?',
      answer: 'Las actualizaciones se realizan automáticamente, pero puedes solicitarlas manualmente desde el panel de control.'
    }
  ];

  return (
    <section id="support" className="py-24 bg-muted/50">
      <div className="section-container" id='faqs'>
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-accent bg-accent/10 rounded-full">
            Soporte Integral
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Estamos aquí para ayudarte
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nuestro equipo de expertos está disponible 24/7 para resolver cualquier duda o incidencia técnica.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <ScrollReveal direction="right" className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-background rounded-2xl p-6 shadow-sm border">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer">
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-4 text-muted-foreground">{faq.answer}</p>
                </details>
              </div>
            ))}
          </ScrollReveal>

          {/* Contact Section */}
          <ScrollReveal direction="left" className="bg-background rounded-2xl p-8 shadow-sm border h-fit">
            <h3 className="text-xl font-semibold mb-6">Canales de contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-xl">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full",
                  "bg-primary/10 text-primary"
                )}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Soporte telefónico</p>
                  <p className="text-muted-foreground">+52 12 3456 7890</p>
                </div>
              </div>
              
              <Button variant="outline" size="lg" className="w-full rounded-full justify-start h-14 px-6">
                <MessageCircle className="mr-3" />
                Chat en vivo
              </Button>
              
              <Button size="lg" className="w-full rounded-full justify-start h-14 px-6">
                <HandHelping className="mr-3" />
                Solicitar soporte técnico
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Support;