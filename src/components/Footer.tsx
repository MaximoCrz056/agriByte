import React from "react";
import AnimatedLogo from "./AnimatedLogo";
import ScrollReveal from "./ScrollReveal";
import { ArrowUp, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-muted/30 pt-16 pb-8 border-t border-border">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Logo and about */}
          <ScrollReveal direction="up" className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <AnimatedLogo className="h-8 w-8 text-primary" />
              <span className="font-semibold text-lg">AgriByte</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transformando la agricultura con tecnología de vanguardia. Nuestro
              compromiso es crear soluciones inteligentes que optimicen la
              producción y promuevan la sostenibilidad.
            </p>
            <div className="flex space-x-4">
              <div className="flex space-x-4">
                <a
                  href="#Twitter"
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#Facebook"
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="#Instagram"
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="#Linkedin"
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">Linkedin</span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Links */}
          <ScrollReveal delay={100} direction="up">
            <h3 className="font-medium text-lg mb-4">Soluciones</h3>
            <ul className="space-y-3">
              {[
                "Invernaderos Inteligentes",
                "Monitoreo Remoto",
                "Automatización",
                "Preguntas Frecuentes",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <h3 className="font-medium text-lg mb-4">Empresa</h3>
            <ul className="space-y-3">
              {[
                "Sobre Nosotros",
                "Casos de Éxito",
                "Política de Privacidad",
                "Términos de Servicio",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
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
              © {new Date().getFullYear()} AgriByte. Todos los derechos
              reservados.
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
              <span className="sr-only">Volver arriba</span>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
