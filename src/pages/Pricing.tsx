
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Gratuito",
    description: "Para começar a prospectar",
    price: "R$ 0",
    interval: "para sempre",
    features: [
      "100 leads por mês",
      "50 mensagens por mês",
      "1 campanha ativa por vez",
      "1 conexão de WhatsApp",
      "Relatórios básicos"
    ],
    popular: false,
    buttonText: "Começar Agora",
    buttonVariant: "outline" as const
  },
  {
    name: "Profissional",
    description: "Para profissionais de vendas",
    price: "R$ 97",
    interval: "por mês",
    features: [
      "1.000 leads por mês",
      "500 mensagens por mês",
      "5 campanhas ativas por vez",
      "3 conexões de WhatsApp",
      "Relatórios avançados",
      "Automações personalizadas",
      "Suporte prioritário"
    ],
    popular: true,
    buttonText: "Assinar Agora",
    buttonVariant: "default" as const
  },
  {
    name: "Empresarial",
    description: "Para equipes e empresas",
    price: "R$ 297",
    interval: "por mês",
    features: [
      "5.000 leads por mês",
      "2.500 mensagens por mês",
      "Campanhas ilimitadas",
      "10 conexões de WhatsApp",
      "Relatórios completos",
      "API de integração",
      "Gerenciamento de equipe",
      "Suporte dedicado"
    ],
    popular: false,
    buttonText: "Fale Conosco",
    buttonVariant: "outline" as const
  }
];

const Pricing = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              className="h-8 w-8 text-blue-600 mr-2"
              fill="currentColor"
            >
              <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5zM16.25 13.97c-.19-.1-1.12-.55-1.3-.61c-.17-.06-.3-.09-.42.09c-.12.19-.47.61-.58.74c-.11.13-.21.14-.4.05c-1.07-.54-1.77-.97-2.47-2.2c-.19-.32.19-.3.54-1c.06-.11.03-.21-.02-.3c-.05-.08-.42-1.01-.58-1.38c-.15-.36-.31-.31-.42-.32c-.11 0-.24-.03-.36-.03s-.33.05-.5.24c-.17.19-.64.63-.64 1.53c0 .9.67 1.77.76 1.89c.09.12 1.24 1.97 3.05 2.69c1.13.45 1.57.49 2.13.41c.34-.05 1.12-.46 1.28-.9c.16-.45.16-.83.11-.91c-.05-.08-.19-.14-.38-.24z"/>
            </svg>
            <span className="font-semibold text-lg text-gray-800">Lead Pilot</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Registrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Planos e Preços</h1>
          <p className="text-lg text-gray-600">
            Escolha o plano ideal para impulsionar suas prospecções via WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-t-lg text-center">
                  Mais Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant} className="w-full">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="space-y-6 mt-8 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2">Como funciona o período de teste?</h3>
              <p className="text-gray-600">
                Oferecemos 7 dias de teste gratuito em todos os planos pagos. Você pode cancelar a qualquer momento antes do fim do período de teste.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-gray-600">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As cobranças serão ajustadas proporcionalmente.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Quais formas de pagamento são aceitas?</h3>
              <p className="text-gray-600">
                Aceitamos pagamentos via cartão de crédito, boleto bancário e Pix.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Existe algum contrato de fidelidade?</h3>
              <p className="text-gray-600">
                Não, todos os planos são mensais e você pode cancelar a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 text-blue-600 mr-2"
                  fill="currentColor"
                >
                  <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5zM16.25 13.97c-.19-.1-1.12-.55-1.3-.61c-.17-.06-.3-.09-.42.09c-.12.19-.47.61-.58.74c-.11.13-.21.14-.4.05c-1.07-.54-1.77-.97-2.47-2.2c-.19-.32.19-.3.54-1c.06-.11.03-.21-.02-.3c-.05-.08-.42-1.01-.58-1.38c-.15-.36-.31-.31-.42-.32c-.11 0-.24-.03-.36-.03s-.33.05-.5.24c-.17.19-.64.63-.64 1.53c0 .9.67 1.77.76 1.89c.09.12 1.24 1.97 3.05 2.69c1.13.45 1.57.49 2.13.41c.34-.05 1.12-.46 1.28-.9c.16-.45.16-.83.11-.91c-.05-.08-.19-.14-.38-.24z"/>
                </svg>
                <span className="font-semibold text-gray-800">Lead Pilot</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                © 2025 Lead Pilot. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-medium mb-2">Produto</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-blue-600">Recursos</a></li>
                  <li><a href="#" className="hover:text-blue-600">Preços</a></li>
                  <li><a href="#" className="hover:text-blue-600">Integrações</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Empresa</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-blue-600">Sobre</a></li>
                  <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                  <li><a href="#" className="hover:text-blue-600">Contato</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Suporte</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
                  <li><a href="#" className="hover:text-blue-600">Documentação</a></li>
                  <li><a href="#" className="hover:text-blue-600">Tutoriais</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
