
import { ShieldCheck, MessageSquareText, BarChart3, Search, Database, Zap } from "lucide-react";

const features = [
  {
    icon: <Database className="h-8 w-8 text-brandBlue-600" />,
    title: "Leads Prontos para Contato",
    description: "Acesse empresas com CNPJ ativo já filtradas automaticamente por segmento, localização e data de abertura."
  },
  {
    icon: <MessageSquareText className="h-8 w-8 text-brandBlue-600" />,
    title: "Mensagens Personalizadas",
    description: "Crie mensagens com variáveis dinâmicas como {{empresa}}, {{cidade}} e {{cnae_principal}} para maior engajamento."
  },
  {
    icon: <Zap className="h-8 w-8 text-brandBlue-600" />,
    title: "Campanhas Automatizadas",
    description: "Envie mensagens via WhatsApp Web com comportamento humano e delays aleatórios para evitar bloqueios."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-brandBlue-600" />,
    title: "Dashboard Completo",
    description: "Acompanhe em tempo real o desempenho das suas campanhas, status de envio e métricas de resposta."
  },
  {
    icon: <Search className="h-8 w-8 text-brandBlue-600" />,
    title: "Prospecção Guiada",
    description: "Encontre leads de acordo com critérios específicos como setor, região, capital social e data de abertura."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-brandBlue-600" />,
    title: "Segurança e Controle",
    description: "Todos os envios partem do seu próprio WhatsApp Web, sem armazenar senhas ou acessar sua conta."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Inteligentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desenvolvido para transformar completamente seu processo de prospecção e vendas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
