import React from "react";
import { Link } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  // Removed scroll effects and menu states

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-md bg-background/80 border-b border-border shadow-sm py-3"
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
