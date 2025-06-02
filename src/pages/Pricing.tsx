import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, QrCode, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/ui/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const pricingPlans = [
  {
    id: "plus",
    name: "Plus",
    description: "Para começar a prospectar",
    price: "R$ 119",
    interval: "por mês",
    features: [
      "30 milhões de empresas para prospectar",
      "Contatos desbloqueados sem limites",
      "Empresas abertas nas últimas 24h",
      "Filtros por localidade (estado e cidade)",
      "Filtros por segmento e tamanho da empresa",
      "Leads exclusivos nunca contatados antes",
      "ROI garantido já no primeiro mês"
    ],
    popular: false,
    buttonText: "Assinar Plus",
    buttonVariant: "outline" as const
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para profissionais de vendas",
    price: "R$ 499",
    interval: "por mês",
    features: [
      "Tudo do plano Plus +",
      "WhatsApp em massa para múltiplos leads",
      "Economize 5h diárias em prospecção manual",
      "Templates personalizados (70% de resposta)",
      "Filtros avançados de leads de alta conversão",
      "Automação de acompanhamento de leads",
      "Estatísticas e relatórios de desempenho"
    ],
    popular: true,
    buttonText: "Assinar Pro",
    buttonVariant: "default" as const
  },
  {
    id: "ultra",
    name: "Ultra IA",
    description: "Para equipes e empresas",
    price: "R$ 999",
    interval: "por mês",
    features: [
      "Tudo do plano Pro +",
      "Funcionário IA trabalhando 24h/7 dias",
      "Prospecção automática enquanto você dorme",
      "Identificação de oportunidades via IA",
      "Respostas automáticas personalizadas",
      "Acompanhamento completo do funil de vendas",
      "ROI de 10x garantido"
    ],
    popular: false,
    buttonText: "Assinar Ultra",
    buttonVariant: "outline" as const
  }
];

// Credit card form interface
interface CreditCardInfo {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

// Payment modal props
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: typeof pricingPlans[0];
  paymentMethod: 'credit' | 'pix';
}

// Payment modal component
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, paymentMethod }) => {
  const [cardInfo, setCardInfo] = useState<CreditCardInfo>({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [activePaymentMethod, setActivePaymentMethod] = useState<'credit' | 'pix'>(paymentMethod);

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'number') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardInfo({ ...cardInfo, [name]: formatted.substring(0, 19) });
      return;
    }
    
    // Format expiry date (MM/YY)
    if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
      }
      setCardInfo({ ...cardInfo, [name]: formatted.substring(0, 5) });
      return;
    }
    
    // Limit CVV to 3 or 4 digits
    if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      setCardInfo({ ...cardInfo, [name]: cleaned.substring(0, 4) });
      return;
    }
    
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    // URL do WhatsApp para suporte
    const whatsappUrl = "https://api.whatsapp.com/send?phone=5517981679818&text=Oi%2C%20tudo%20bem%3F%20Preciso%20de%20ajuda%20com%20LeadPilot%20.";
    
    toast.error("Ocorreu um erro ao processar o pagamento", {
      description: "Por favor, entre em contato com o suporte via WhatsApp para assistência.",
      action: {
        label: "Contatar suporte",
        onClick: () => window.open(whatsappUrl, "_blank")
      }
    });
    
    onClose();
  };

  // Generate PIX QR code (simulated)
  const pixKey = "17991610665";
  const pixAmount = plan.price.replace('R$ ', '').replace('.', '');
  const pixDescription = `Lead Pilot - Plano ${plan.name}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Assinar {plan.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Payment method toggle */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 text-center font-medium text-sm ${activePaymentMethod === 'credit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActivePaymentMethod('credit')}
          >
            <div className="flex justify-center items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Cartão de Crédito
            </div>
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium text-sm ${activePaymentMethod === 'pix' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActivePaymentMethod('pix')}
          >
            <div className="flex justify-center items-center">
              <QrCode className="h-4 w-4 mr-2" />
              PIX
            </div>
          </button>
        </div>
        
        <div className="p-4">
          {activePaymentMethod === 'credit' ? (
            <form onSubmit={handleSubmitCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número do Cartão</Label>
                <Input
                  id="number"
                  name="number"
                  placeholder="0000 0000 0000 0000"
                  value={cardInfo.number}
                  onChange={handleCardInfoChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome no Cartão</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome completo"
                  value={cardInfo.name}
                  onChange={handleCardInfoChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Validade (MM/AA)</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/AA"
                    value={cardInfo.expiry}
                    onChange={handleCardInfoChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardInfo.cvv}
                    onChange={handleCardInfoChange}
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Pagar {plan.price}
                </Button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-2">
                Seus dados de pagamento estão seguros e criptografados
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX01142023202520520400005303986540${pixAmount}5802BR5923Pagamento%20Lead%20Pilot6009SAO%20PAULO62070503***63041D14`}
                  alt="QR Code PIX" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <div className="space-y-4 w-full">
                <div className="border rounded p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Chave PIX:</span>
                    <span className="text-sm font-medium">{pixKey}</span>
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor:</span>
                    <span className="text-sm font-medium">{plan.price}</span>
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Descrição:</span>
                    <span className="text-sm font-medium">{pixDescription}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(pixKey);
                    toast.success("Chave PIX copiada!");
                  }}
                  className="w-full"
                >
                  Copiar Chave PIX
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Após o pagamento, envie o comprovante para suporte@leadpilot.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("pricing");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof pricingPlans[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');

  const handleSubscribe = (plan: typeof pricingPlans[0]) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Status Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center flex-1 gap-3">
          <div className="flex items-center shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-sm">🚀</span>
            </div>
            <span className="font-bold text-lg ml-2 hidden sm:inline">Lead Pilot</span>
            <span className="font-bold text-lg ml-2 sm:hidden">LP</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            asChild
          >
            <Link to="/register">Criar Conta</Link>
          </Button>
        </div>
      </div>
      
      {/* Add a persuasive explanation banner below the top status bar */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-2 border-b border-gray-200">
        <p className="text-xs text-gray-700 leading-tight">
          <span className="font-semibold">Economize 5 horas por dia</span> automatizando sua prospecção. Aumente suas vendas em até 300%.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Planos e Preços</h1>
          <p className="text-gray-600">
            Escolha o plano ideal para impulsionar suas prospecções via WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
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
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full"
                  onClick={() => handleSubscribe(plan)}
                >
                  {plan.buttonText}
                </Button>
                
                <div className="flex justify-center space-x-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs flex items-center"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setPaymentMethod('credit');
                      setShowPaymentModal(true);
                    }}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Cartão
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs flex items-center"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setPaymentMethod('pix');
                      setShowPaymentModal(true);
                    }}
                  >
                    <QrCode className="h-3 w-3 mr-1" />
                    PIX
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">Como funciona o período de teste?</h3>
              <p className="text-gray-600 text-sm">
                Oferecemos 7 dias de teste gratuito em todos os planos pagos. Você pode cancelar a qualquer momento antes do fim do período de teste.
              </p>
            </div>
            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-gray-600 text-sm">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As cobranças serão ajustadas proporcionalmente.
              </p>
            </div>
            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">Quais formas de pagamento são aceitas?</h3>
              <p className="text-gray-600 text-sm">
                Aceitamos pagamentos via cartão de crédito, boleto bancário e Pix.
              </p>
            </div>
            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">Existe algum contrato de fidelidade?</h3>
              <p className="text-gray-600 text-sm">
                Não, todos os planos são mensais e você pode cancelar a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          paymentMethod={paymentMethod}
        />
      )}
    </div>
  );
};

export default Pricing;
