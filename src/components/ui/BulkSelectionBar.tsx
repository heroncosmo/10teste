import React, { useState } from 'react';
import { X, MessageSquare, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PremiumBanner, { globalDiscountState } from './PremiumBanner';
import { useAuth } from '@/providers/AuthProvider';

interface BulkSelectionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkMessage: () => void;
  onBulkFavorite: () => void;
}

const BulkSelectionBar: React.FC<BulkSelectionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkMessage,
  onBulkFavorite
}) => {
  const [showPremiumBanner, setShowPremiumBanner] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState({
    title: '',
    description: '',
    featureType: 'action' as 'search' | 'filter' | 'recommendation' | 'action' | 'navigation',
    planType: 'pro' as 'plus' | 'pro' | 'ultra'
  });
  const { user } = useAuth();
  
  // Função para lidar com o clique no botão de mensagem em massa
  const handleBulkMessage = () => {
    if (!user) {
      setPremiumFeature({
        title: "WhatsApp em Massa - Plano Pro",
        description: "Envie mensagens para centenas de leads ao mesmo tempo e economize 5h por dia de trabalho manual. Aumente suas taxas de resposta em 5x com templates personalizados e sequências automatizadas. Pare de perder tempo com prospecção manual!",
        featureType: 'action',
        planType: 'pro'
      });
      setShowPremiumBanner(true);
      
      // Activate global discount countdown when showing any banner
      globalDiscountState.isTimerActive = true;
      
      return;
    }
    
    // Even for logged in users, show the premium banner for this feature
    // as it requires the Pro plan
    setPremiumFeature({
      title: "WhatsApp em Massa - Plano Pro",
      description: "Envie mensagens para centenas de leads ao mesmo tempo e economize 5h por dia. Multiplique sua produtividade por 10x e fale com mais clientes em menos tempo. Utilize nossos templates com 70% de taxa de resposta e aumente suas vendas já no primeiro dia.",
      featureType: 'action',
      planType: 'pro'
    });
    setShowPremiumBanner(true);
    
    // Activate global discount countdown
    globalDiscountState.isTimerActive = true;
  };
  
  // Função para lidar com o clique no botão de favoritos
  const handleBulkFavorite = () => {
    if (!user) {
      setPremiumFeature({
        title: "Organize seus Leads Favoritos",
        description: "Marque leads como favoritos para acompanhamento rápido e eficiente. Crie uma conta para começar a organizar suas oportunidades!",
        featureType: 'action',
        planType: 'plus'
      });
      setShowPremiumBanner(true);
      
      // Activate global discount countdown when showing any banner
      globalDiscountState.isTimerActive = true;
      
      return;
    }
    
    onBulkFavorite();
  };
  
  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-16 left-0 right-0 z-40 animate-slide-up">
        <div className="bg-blue-600 shadow-lg mx-4 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
        <button
          onClick={onClearSelection}
              className="mr-2 text-blue-200 hover:text-white"
              aria-label="Limpar seleção"
        >
              <X className="h-4 w-4" />
        </button>
            <span className="text-white text-sm font-medium">
              {selectedCount} {selectedCount === 1 ? 'empresa selecionada' : 'empresas selecionadas'}
            </span>
      </div>
          
      <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-blue-700 hover:bg-blue-800 text-white border-none flex items-center"
              onClick={handleBulkFavorite}
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Favoritar</span>
            </Button>
            
            <Button 
              size="sm"
              className="bg-white text-blue-700 hover:bg-blue-50 flex items-center"
              onClick={handleBulkMessage}
        >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">WhatsApp em massa</span>
            </Button>
          </div>
        </div>
        
        {/* Texto informativo sobre AutoPiloto */}
        <div className="bg-gray-700 mx-4 mt-1 rounded-lg p-2 text-center text-xs text-white shadow-lg">
          <span className="flex items-center justify-center">
            <Zap className="h-3 w-3 mr-1 text-gray-300" />
            WhatsApp em Massa e AutoPiloto: Envio automático para leads selecionados
          </span>
        </div>
      </div>
      
      {/* Premium Banner */}
      <PremiumBanner 
        isOpen={showPremiumBanner}
        onClose={() => setShowPremiumBanner(false)}
        title={premiumFeature.title}
        description={premiumFeature.description}
        showLogin={!user}
        featureType={premiumFeature.featureType}
        planType={premiumFeature.planType}
      />
    </>
  );
};

export default BulkSelectionBar; 