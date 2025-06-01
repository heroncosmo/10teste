import React, { useState, useEffect } from 'react';
import { X, Zap, ExternalLink, LogIn, UserPlus, Search, Filter, Star, Clock, MessageSquare, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Global state for discount tracking across the application
export const globalDiscountState = {
  discountPercent: 20,
  timeRemaining: 5 * 60, // 5 minutes in seconds
  couponCode: "PROMO20",
  isTimerActive: false,
  
  // Update discount when timer expires
  updateDiscount: function() {
    if (this.discountPercent > 0) {
      const newDiscount = Math.max(0, this.discountPercent - 1);
      this.discountPercent = newDiscount;
      
      if (newDiscount === 0) {
        this.couponCode = "SEMPROMO";
      } else {
        this.couponCode = `PROMO${newDiscount}`;
      }
      
      // Reset timer
      this.timeRemaining = 5 * 60;
    }
  }
};

interface PremiumBannerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  showLogin?: boolean;
  featureType?: 'search' | 'filter' | 'recommendation' | 'action' | 'navigation';
  planType?: 'plus' | 'pro' | 'ultra';
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  showLogin = false,
  featureType = 'action',
  planType = 'plus'
}) => {
  // Local state that mirrors the global state
  const [discountPercent, setDiscountPercent] = useState(globalDiscountState.discountPercent);
  const [timeRemaining, setTimeRemaining] = useState(globalDiscountState.timeRemaining);
  const [couponCode, setCouponCode] = useState(globalDiscountState.couponCode);
  const [showCountdown, setShowCountdown] = useState(false);

  // Get plan price based on plan type
  const getPlanPrice = () => {
    const discount = discountPercent / 100;
    
    switch (planType) {
      case 'plus':
        const basePrice = 119;
        const discountedPrice = Math.round(basePrice - (basePrice * discount));
        return {
          original: basePrice,
          discounted: discountedPrice
        };
      case 'pro':
        const proBasePrice = 499;
        const proDiscountedPrice = Math.round(proBasePrice - (proBasePrice * discount));
        return {
          original: proBasePrice,
          discounted: proDiscountedPrice
        };
      case 'ultra':
        const ultraBasePrice = 999;
        const ultraDiscountedPrice = Math.round(ultraBasePrice - (ultraBasePrice * discount));
        return {
          original: ultraBasePrice,
          discounted: ultraDiscountedPrice
        };
      default:
        return {
          original: 119,
          discounted: 99
        };
    }
  };

  // Get plan benefits based on plan type
  const getPlanBenefits = () => {
    switch (planType) {
      case 'plus':
        return [
          '30 milhões de empresas para prospectar',
          'Contatos desbloqueados sem limites',
          'Empresas abertas nas últimas 24h (5x mais chances)',
          'Filtros por localidade (estado e cidade)',
          'Filtros por segmento e tamanho da empresa',
          'Leads exclusivos nunca contatados antes',
          'ROI garantido já no primeiro mês'
        ];
      case 'pro':
        return [
          'Tudo do plano Plus +',
          'WhatsApp em massa para múltiplos leads de uma vez',
          'Economize 5h diárias em prospecção manual',
          'Templates personalizados com 70% de taxa de resposta',
          'Filtros avançados de leads de alta conversão',
          'Automação de acompanhamento de leads',
          'Estatísticas e relatórios de desempenho'
        ];
      case 'ultra':
        return [
          'Tudo do plano Pro +',
          'Funcionário IA trabalhando 24h/7 dias por semana',
          'Prospecção automática enquanto você dorme',
          'Identificação de oportunidades via IA preditiva',
          'Respostas automáticas personalizadas',
          'Acompanhamento completo do funil de vendas',
          'Retorno sobre investimento de 10x garantido'
        ];
      default:
        return [
          'Acesso ilimitado a todos os leads',
          'Contatos desbloqueados ilimitados',
          'Filtros avançados e busca premium'
        ];
    }
  };

  // Activate countdown when banner opens
  useEffect(() => {
    if (isOpen) {
      setShowCountdown(true);
      globalDiscountState.isTimerActive = true;
      
      // Sync with global state
      setDiscountPercent(globalDiscountState.discountPercent);
      setTimeRemaining(globalDiscountState.timeRemaining);
      setCouponCode(globalDiscountState.couponCode);
    }
  }, [isOpen]);
  
  // Timer for discount countdown
  useEffect(() => {
    if (showCountdown && timeRemaining > 0 && isOpen) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          globalDiscountState.timeRemaining = newTime;
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && timeRemaining <= 0 && isOpen) {
      // When timer expires, reduce discount
      globalDiscountState.updateDiscount();
      
      // Update local state from global
      setDiscountPercent(globalDiscountState.discountPercent);
      setTimeRemaining(globalDiscountState.timeRemaining);
      setCouponCode(globalDiscountState.couponCode);
    }
  }, [timeRemaining, showCountdown, isOpen]);

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Função para redirecionar para a página de preços
  const handleUpgrade = () => {
    window.location.href = "/pricing";
    onClose();
  };

  // Função para redirecionar para a página de login
  const handleLogin = () => {
    window.location.href = "/login";
    onClose();
  };

  // Função para redirecionar para a página de cadastro
  const handleSignup = () => {
    window.location.href = "/register";
    onClose();
  };

  // Determine icon and colors based on feature type - more persuasive
  const getFeatureStyles = () => {
    // Base style influenced by plan type
    let planGradient = 'from-blue-500 to-blue-600'; // default (Plus)
    
    if (planType === 'pro') {
      planGradient = 'from-blue-600 to-blue-700';
    } else if (planType === 'ultra') {
      planGradient = 'from-purple-600 to-purple-700';
    }
    
    // Estilo padronizado para todos os tipos de feature
    const standardStyle = {
      icon: <Zap className="h-8 w-8 text-white" />,
      gradient: planGradient,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    };

    // Pequenas variações nos ícones baseado no tipo de feature
    switch (featureType) {
      case 'search':
        return { ...standardStyle, icon: <Search className="h-8 w-8 text-white" /> };
      case 'filter':
        return { ...standardStyle, icon: <Filter className="h-8 w-8 text-white" /> };
      case 'recommendation':
        return { ...standardStyle, icon: <Star className="h-8 w-8 text-white" /> };
      case 'navigation':
        if (planType === 'pro') {
          return { ...standardStyle, icon: <MessageSquare className="h-8 w-8 text-white" /> };
        } else if (planType === 'ultra') {
          return { ...standardStyle, icon: <BarChart className="h-8 w-8 text-white" /> };
        }
        return { ...standardStyle, icon: <Zap className="h-8 w-8 text-white" /> };
      default:
        return standardStyle;
    }
  };

  const styles = getFeatureStyles();
  const planPrice = getPlanPrice();
  const planBenefits = getPlanBenefits();
  const planButtonText = planType === 'plus' ? 'Assinar Plano Plus' : 
                         planType === 'pro' ? 'Assinar Plano Pro' : 
                         'Assinar Plano Ultra IA';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative mx-auto md:max-w-[50%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-r ${styles.gradient} rounded-full mx-auto flex items-center justify-center mb-4`}>
            {styles.icon || <Zap className="h-8 w-8 text-white" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          
          {/* Oferta com desconto e temporizador */}
          {!showLogin && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-800">Oferta Especial</span>
                {showCountdown && (
                  <div className="bg-blue-600 text-white text-xs py-1 px-2 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-lg font-bold text-blue-900">
                    R$ {planPrice.discounted},00
                    <span className="text-xs line-through ml-2 text-gray-500">R$ {planPrice.original},00</span>
                  </p>
                  <p className="text-xs text-blue-800 font-medium">
                    {discountPercent}% de desconto
                  </p>
                </div>
                
                <div className="bg-blue-200 text-blue-800 rounded-md px-3 py-1 text-sm font-medium flex items-center">
                  <span>Cupom: </span>
                  <span className="font-bold ml-1">{couponCode}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className={`${styles.bgColor} p-4 rounded-lg mb-6 text-left`}>
            <h4 className={`font-semibold ${styles.textColor} mb-2`}>
              {showLogin ? 'Por que criar uma conta?' : `Por que assinar o plano ${planType === 'plus' ? 'Plus' : planType === 'pro' ? 'Pro' : 'Ultra IA'}?`}
            </h4>
            {showLogin ? (
              <ul className={`text-sm ${styles.textColor} space-y-1`}>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> 
                  <span>Acesso a leads gratuitos todos os dias</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> 
                  <span>Salve empresas favoritas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> 
                  <span>Pesquisa básica de empresas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> 
                  <span>Comece grátis, sem cartão de crédito</span>
                </li>
              </ul>
            ) : (
              <ul className={`text-sm ${styles.textColor} space-y-1`}>
                {planBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-1">✓</span> 
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {!showLogin && planType !== 'plus' && (
              <p className="mt-3 text-xs text-gray-500">
                {planType === 'pro' ? 
                  'Quer apenas desbloquear contatos e envio manual?' : 
                  'Procurando por uma opção mais acessível?'} 
                <button onClick={() => window.location.href = "/pricing"} className="text-blue-600 underline ml-1">
                  Ver Plano Plus por R$99
                </button>
              </p>
            )}
          </div>
          
          {showLogin ? (
            <div className="flex space-x-3">
              <Button 
                onClick={handleSignup}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar conta grátis
              </Button>
              <Button 
                onClick={handleLogin}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button 
                onClick={handleUpgrade}
                className={`flex-1 ${
                  planType === 'plus' ? 'bg-blue-600 hover:bg-blue-700' : 
                  planType === 'pro' ? 'bg-blue-700 hover:bg-blue-800' : 
                  'bg-purple-600 hover:bg-purple-700'
                } text-white`}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {planButtonText}
              </Button>
              <Button 
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Agora não
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner; 