import React, { useRef, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProductShowcase: React.FC = () => {
  const imageRef1 = useRef<HTMLImageElement>(null);
  const imageRef2 = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Apply blur-on-load effect
    const applyLoadedClass = (img: HTMLImageElement | null) => {
      if (img) {
        if (img.complete) {
          img.classList.add("loaded");
        } else {
          img.onload = () => img.classList.add("loaded");
        }
      }
    };

    applyLoadedClass(imageRef1.current);
    applyLoadedClass(imageRef2.current);
  }, []);

  return (
    <section id="technology" className="py-24 overflow-hidden">
      <div className="section-container">
        {/* First Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[40px] blur-2xl"></div>
              <div className="glass-panel rounded-[32px] overflow-hidden border shadow-xl">
                <img
                  ref={imageRef1}
                  src="https://images.unsplash.com/photo-1624397640148-949b1732bb0a?q=80&w=1000&auto=format&fit=crop"
                  alt="Sistema de monitoreo de invernaderos"
                  className="w-full h-auto image-blur-load"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-panel p-4 rounded-2xl shadow-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">
                    Monitoreo en Tiempo Real
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            className="order-1 lg:order-2 max-w-lg mx-auto lg:mx-0"
          >
            <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-accent bg-accent/10 rounded-full">
              Tecnología Avanzada
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Diseñado para agricultores, potenciado por IA
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Creemos que la mejor tecnología es aquella que se integra
              naturalmente en tu trabajo diario. Cada elemento de AgriByte ha
              sido diseñado para ofrecer una experiencia intuitiva y eficiente.
            </p>
            <Button size="lg" className="rounded-full px-8">
              Conocer Más
            </Button>
          </ScrollReveal>
        </div>

        {/* Second Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="right" className="max-w-lg mx-auto lg:mx-0">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-accent bg-accent/10 rounded-full">
              Precisión Agrícola
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Cada detalle importa para maximizar tu producción
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Desde el control preciso de la humedad hasta la gestión
              inteligente de nutrientes, nos hemos obsesionado con los detalles
              que transforman un cultivo normal en una cosecha extraordinaria.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Sensores de alta precisión",
                "Algoritmos predictivos",
                "Control climático inteligente",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div
                    className={cn(
                      "mr-3 mt-1 h-5 w-5 flex items-center justify-center rounded-full",
                      "bg-primary/10 text-primary text-xs font-bold"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Explorar Soluciones
            </Button>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-bl from-accent/10 to-primary/10 rounded-[40px] blur-2xl"></div>
              <div className="glass-panel rounded-[32px] overflow-hidden p-1 shadow-xl">
                <img
                  ref={imageRef2}
                  src="https://www.randstad.es/wp-content/uploads/2019/02/880x450-agro.jpg"
                  alt="Panel de control AgriByte"
                  className="w-full h-auto rounded-[28px] image-blur-load"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full text-xs">
                  Calidad Premium
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
