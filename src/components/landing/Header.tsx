
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky-header py-4">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            viewBox="0 0 24 24" 
            className="h-8 w-8 text-brandBlue-600"
            fill="currentColor"
          >
            <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5zM16.25 13.97c-.19-.1-1.12-.55-1.3-.61c-.17-.06-.3-.09-.42.09c-.12.19-.47.61-.58.74c-.11.13-.21.14-.4.05c-1.07-.54-1.77-.97-2.47-2.2c-.19-.32.19-.3.54-1c.06-.11.03-.21-.02-.3c-.05-.08-.42-1.01-.58-1.38c-.15-.36-.31-.31-.42-.32c-.11 0-.24-.03-.36-.03s-.33.05-.5.24c-.17.19-.64.63-.64 1.53c0 .9.67 1.77.76 1.89c.09.12 1.24 1.97 3.05 2.69c1.13.45 1.57.49 2.13.41c.34-.05 1.12-.46 1.28-.9c.16-.45.16-.83.11-.91c-.05-.08-.19-.14-.38-.24z"/>
          </svg>
          <span className="text-xl font-semibold text-gray-800">WhatsApp Lead Pilot</span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Recursos</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">Como Funciona</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Planos</a>
          <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
          <Link to="/login">
            <Button variant="outline" className="mr-2">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button>Começar Grátis</Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-t border-gray-200 animate-fade-in">
          <div className="flex flex-col space-y-4 py-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">Recursos</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">Como Funciona</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">Planos</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">FAQ</a>
            <div className="flex flex-col space-y-2 mt-4 px-4">
              <Link to="/login">
                <Button variant="outline" className="w-full">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="w-full">Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
