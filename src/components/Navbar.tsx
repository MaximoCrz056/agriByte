import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado y obtener el rol
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : null;
    console.log("Role:", role);

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu links
  const links = [
    { name: "Soluciones", href: "#solutions" },
    { name: "Tecnología", href: "#technology" },
    { name: "Casos de Éxito", href: "#success-cases" },
    { name: "Soporte", href: "#support" },
    { name: "Preguntas Frecuentes", href: "#faqs" },
  ];

  const handleDashboardClick = () => {
    if (userRole === "admin") {
      navigate("/dashboard"); // Redirigir al dashboard del administrador
    } else if (userRole === "farmer") {
      navigate("dashboard-farmer"); // Redirigir al dashboard del usuario
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "backdrop-blur-md bg-background/80 border-b border-border shadow-sm py-3"
          : "py-5"
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <AnimatedLogo className="h-9 w-9 text-primary" />
            <span className="font-semibold text-lg tracking-tight">
              AgriByte
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground underline-anim text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-5"
                onClick={handleDashboardClick}
              >
                Dashboard
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full px-5"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-secondary transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[60px] bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-border",
          mobileMenuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="pt-2 pb-4 space-y-1 px-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block py-3 text-muted-foreground hover:text-foreground transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col space-y-2 pt-3">
            {isAuthenticated ? (
              <Button
                variant="default"
                size="sm"
                className="rounded-full w-full"
                onClick={handleDashboardClick}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/demo">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full w-full"
                  >
                    Solicitar Demo
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full w-full"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
