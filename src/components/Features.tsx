
import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Droplets, Cpu, BarChart, Leaf, Cloud, Smartphone } from 'lucide-react';
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
      <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-2xl text-primary">
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
      icon: <Droplets size={24} />,
      title: "Riego Inteligente",
      description: "Sistema de riego automatizado que optimiza el uso del agua según las necesidades específicas de cada cultivo."
    },
    {
      icon: <Cpu size={24} />,
      title: "Control Climático",
      description: "Regulación precisa de temperatura, humedad y ventilación para crear el ambiente ideal para cada tipo de cultivo."
    },
    {
      icon: <BarChart size={24} />,
      title: "Análisis de Datos",
      description: "Monitoreo en tiempo real y análisis predictivo para maximizar rendimientos y prevenir problemas."
    },
    {
      icon: <Leaf size={24} />,
      title: "Cultivo Sostenible",
      description: "Tecnología que reduce el impacto ambiental mientras aumenta la productividad de tus invernaderos."
    },
    {
      icon: <Cloud size={24} />,
      title: "Plataforma en la Nube",
      description: "Acceso a todos tus datos y controles desde cualquier lugar, con almacenamiento seguro en la nube."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Control Móvil",
      description: "Gestiona tu invernadero desde cualquier dispositivo con nuestra aplicación intuitiva y completa."
    }
  ];

  return (
    <section id="solutions" className="py-24 relative">
      {/* Background elements */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="section-container">
        <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-accent bg-accent/10 rounded-full">
            Soluciones
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Tecnología avanzada para agricultura de precisión
          </h2>
          <p className="text-muted-foreground text-lg">
            Nuestras soluciones integradas transforman la gestión de invernaderos, aumentando la productividad y reduciendo costos operativos.
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
