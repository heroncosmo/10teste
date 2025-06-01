
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Filter, MessageSquare, Send, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: <Filter className="h-6 w-6 text-white" />,
    title: "Selecione seus leads",
    description: "Filtre empresas por segmento, localização, CNAE e data de abertura em nossa base sempre atualizada."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "Crie suas mensagens",
    description: "Adicione múltiplas variações com campos dinâmicos para personalizar o contato e evitar bloqueios."
  },
  {
    icon: <Send className="h-6 w-6 text-white" />,
    title: "Inicie sua campanha",
    description: "Configure os parâmetros de envio, delays e pausas automáticas para simular comportamento humano."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-white" />,
    title: "Monitore resultados",
    description: "Acompanhe em tempo real o progresso, estatísticas e histórico detalhado de cada campanha."
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um sistema simples e poderoso para automatizar sua prospecção do início ao fim.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 z-0"></div>
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brandBlue-600 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="md:w-1/2 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  {/* Placeholder for step image - would be replaced with actual UI screenshots */}
                  <div className="h-64 bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4 text-brandBlue-600 flex justify-center">
                        {index === 0 && <User className="h-16 w-16" />}
                        {index === 1 && <MessageSquare className="h-16 w-16" />}
                        {index === 2 && <Send className="h-16 w-16" />}
                        {index === 3 && <BarChart3 className="h-16 w-16" />}
                      </div>
                      <p className="text-gray-500">Ilustração da interface para {step.title.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Configure tudo em minutos e comece a enviar hoje mesmo!
          </p>
          <Link to="/register">
            <Button size="lg">
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
