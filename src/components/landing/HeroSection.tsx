
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="z-pattern mb-16">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Prospecção Inteligente via <span className="text-brandBlue-600">WhatsApp Web</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl">
              Transforme dados em vendas com nossa plataforma completa de automação. Prospecte, personalize e venda - tudo em um único lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="group">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  Como Funciona
                </Button>
              </a>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
                <span className="text-sm text-gray-600">Leads prontos para contato</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
                <span className="text-sm text-gray-600">Mensagens personalizadas</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
                <span className="text-sm text-gray-600">Campanha em 5 minutos</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brandBlue-500/10 to-indigo-500/10 rounded-xl blur-xl"></div>
            <div className="relative bg-white p-6 rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex flex-col flex-1">
                  <div className="bg-whatsapp-light p-3 rounded-tr-xl rounded-tl-xl rounded-br-none rounded-bl-xl max-w-[80%] mb-4 ml-auto">
                    <p className="text-sm">Olá, vi que sua empresa <strong>Academia FitLife</strong> foi aberta recentemente em <strong>São Paulo</strong>. Estamos com uma oferta especial para novos empreendedores do ramo fitness. Podemos conversar?</p>
                    <span className="text-xs text-gray-500 flex justify-end mt-1">10:42</span>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded-tr-xl rounded-tl-xl rounded-br-xl rounded-bl-none max-w-[80%] mb-4">
                    <p className="text-sm">Oi! Sim, estamos interessados. Pode me contar mais sobre essa oferta?</p>
                    <span className="text-xs text-gray-500 mt-1">10:45</span>
                  </div>
                  
                  <div className="bg-whatsapp-light p-3 rounded-tr-xl rounded-tl-xl rounded-br-none rounded-bl-xl max-w-[80%] ml-auto">
                    <p className="text-sm">Claro! Estamos oferecendo um pacote completo para academias com 30% de desconto nos primeiros 3 meses. Podemos agendar uma demonstração?</p>
                    <span className="text-xs text-gray-500 flex justify-end mt-1">10:47</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            
            <div className="absolute right-4 -bottom-4 bg-brandBlue-500 text-white py-2 px-4 rounded-full text-sm font-medium shadow-lg animate-pulse-light">
              +27% de respostas!
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-brandBlue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-brandBlue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Prospecção Invisível</h3>
            <p className="text-gray-600">Nossas extensões coletam empresas com CNPJ ativo 24h/dia, validando automaticamente se possuem WhatsApp.</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-brandBlue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-brandBlue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mensagens Inteligentes</h3>
            <p className="text-gray-600">Crie e personalize múltiplas variações de mensagens com dados dinâmicos para aumentar suas taxas de resposta.</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-brandBlue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-brandBlue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Envio Automático</h3>
            <p className="text-gray-600">Campanha via WhatsApp Web com comportamento humano, delays aleatórios e rotação de números para evitar bloqueios.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
