
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "R$ 97",
    period: "/mês",
    description: "Ideal para empreendedores individuais",
    features: [
      "1.000 leads por mês",
      "500 mensagens por mês",
      "1 campanha simultânea",
      "1 número de WhatsApp",
      "Variações de mensagens",
      "Dashboard básico",
      "Filtros essenciais"
    ],
    cta: "Começar Grátis",
    most_popular: false
  },
  {
    name: "Profissional",
    price: "R$ 197",
    period: "/mês",
    description: "Perfeito para pequenas empresas",
    features: [
      "5.000 leads por mês",
      "2.500 mensagens por mês",
      "3 campanhas simultâneas",
      "2 números de WhatsApp",
      "Editor avançado de mensagens",
      "Relatórios completos",
      "Filtros avançados",
      "Rotação de números automática",
      "Reenvio inteligente"
    ],
    cta: "Escolher Profissional",
    most_popular: true
  },
  {
    name: "Avançado",
    price: "R$ 397",
    period: "/mês",
    description: "Para equipes de vendas completas",
    features: [
      "15.000 leads por mês",
      "10.000 mensagens por mês",
      "10 campanhas simultâneas",
      "5 números de WhatsApp",
      "Mensagens em série",
      "Painel de conversões",
      "API para integração",
      "Multiusuários",
      "Suporte prioritário",
      "Estatísticas avançadas"
    ],
    cta: "Escolher Avançado",
    most_popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos Simples e Transparentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho e necessidades do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md relative ${
                plan.most_popular ? 'border-brandBlue-500 shadow-md transform -translate-y-2' : 'border-gray-200'
              }`}
            >
              {plan.most_popular && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <span className="bg-brandBlue-600 text-white text-sm font-medium px-4 py-1 rounded-full shadow-sm flex items-center">
                    <Crown className="h-4 w-4 mr-1" /> Mais Popular
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="ml-1 text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-brandBlue-600 flex-shrink-0 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link to="/register">
                    <Button 
                      className={`w-full ${plan.most_popular ? 'bg-brandBlue-600 hover:bg-brandBlue-700' : ''}`}
                      variant={plan.most_popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Todos os planos incluem:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
              <span className="text-gray-600">7 dias de garantia</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
              <span className="text-gray-600">Suporte por WhatsApp</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
              <span className="text-gray-600">Pagamento seguro</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-brandBlue-600 mr-2" />
              <span className="text-gray-600">Sem fidelidade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
