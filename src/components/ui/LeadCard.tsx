import React, { useState, useEffect } from 'react';
import { Lead } from '@/hooks/useLeads';
import { Star, MapPin, Users, Lock, Copy, Send, AlarmClock, ExternalLink, Zap, Info, X, Building, Check, ChevronRight, User, Globe, Sparkles, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { globalDiscountState } from './PremiumBanner';

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  onToggleSelection: (id: number) => void;
  onUnlock: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onSendWhatsApp: (id: number) => void;
  onSendEmail: (id: number) => void;
  onOpenChat: (id: number) => void;
  isLoggedIn?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  isSelected,
  onToggleSelection,
  onUnlock,
  onToggleFavorite,
  onSendWhatsApp,
  onSendEmail,
  onOpenChat,
  isLoggedIn = false
}) => {
  const [showAutoPilotModal, setShowAutoPilotModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCnaeInfo, setShowCnaeInfo] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(globalDiscountState.discountPercent);
  const [timeRemaining, setTimeRemaining] = useState(globalDiscountState.timeRemaining);
  const [couponCode, setCouponCode] = useState(globalDiscountState.couponCode);
  const [showCountdown, setShowCountdown] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState({
    title: '',
    description: '',
    featureType: 'action' as 'search' | 'filter' | 'recommendation' | 'action' | 'navigation'
  });

  // Timer for discount countdown
  useEffect(() => {
    if (showCountdown && timeRemaining > 0 && showPricingModal) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          globalDiscountState.timeRemaining = newTime;
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && timeRemaining <= 0 && showPricingModal) {
      // When timer expires, reduce discount
      globalDiscountState.updateDiscount();
      
      // Update local state from global
      setDiscountPercent(globalDiscountState.discountPercent);
      setTimeRemaining(globalDiscountState.timeRemaining);
      setCouponCode(globalDiscountState.couponCode);
    }
  }, [timeRemaining, showCountdown, showPricingModal]);

  // Sync with global state when modal opens
  useEffect(() => {
    if (showPricingModal) {
      setShowCountdown(true);
      globalDiscountState.isTimerActive = true;
      
      // Sync with global state
      setDiscountPercent(globalDiscountState.discountPercent);
      setTimeRemaining(globalDiscountState.timeRemaining);
      setCouponCode(globalDiscountState.couponCode);
    }
  }, [showPricingModal]);

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show pricing banner with timer
  const showPricingBannerWithTimer = () => {
    setShowPricingModal(true);
    setShowCountdown(true);
  };

  // Function to show the Plus plan with more persuasive messaging
  const showPlusPlan = () => {
    setPremiumFeature({
      title: "Plano Plus - Contatos Ilimitados",
      description: "Desbloqueie acesso a 30 milhões de empresas! Contate leads recém-abertos, seja o primeiro a falar com empresas nunca contatadas antes. Filtros avançados por localidade e segmento. ROI garantido já no primeiro mês.",
      featureType: 'action'
    });
    
    // Keep the existing discount logic with the countdown
    setShowPricingModal(true);
  };
  
  // Function to show the Ultra AI plan with more persuasive messaging
  const showUltraPlan = () => {
    setPremiumFeature({
      title: "Plano Ultra IA - Seu Funcionário Virtual 24h/dia",
      description: "Imagine ter um funcionário que nunca dorme, nunca adoece, não tira férias e trabalha 24h/dia, 7 dias por semana buscando oportunidades. Nossa IA encontra leads ideais, envia mensagens personalizadas e mantém relacionamentos automaticamente. Tudo enquanto você foca apenas no fechamento.",
      featureType: 'action'
    });
    
    // Keep the existing discount logic with the countdown
    setShowPricingModal(true);
  };

  // Função para copiar texto para a área de transferência
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copiado com sucesso!`);
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      toast.error('Erro ao copiar texto');
    });
  };

  // Função para abrir o WhatsApp com o número e mensagem personalizada
  const openWhatsApp = (phone: string) => {
    if (!isLoggedIn) {
      setShowPricingModal(true);
      return;
    }
    
    // Limpar o número de telefone (remover caracteres não numéricos)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se o número começar com 0 ou tiver um ponto, remover
    let normalizedPhone = cleanPhone;
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = normalizedPhone.substring(1);
    }
    
    // Se o número não começar com 55 (Brasil), adicionar
    const fullPhone = normalizedPhone.startsWith('55') ? normalizedPhone : `55${normalizedPhone}`;
    
    // Criar mensagem personalizada baseada no tipo de empresa
    let message = `Olá, tudo bem? Vi sua empresa ${lead.companyName} e gostaria de saber mais sobre seus produtos/serviços.`;
    
    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir o WhatsApp com a mensagem
    window.open(`https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodedMessage}`, '_blank');
    
    toast.success("Abrindo WhatsApp...");
  };

  // Função para fazer uma ligação telefônica
  const makePhoneCall = (phone: string) => {
    if (!isLoggedIn) {
      setShowPricingModal(true);
      return;
    }
    
    // Limpar o número de telefone (remover caracteres não numéricos)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Abrir a discagem telefônica
    window.open(`tel:${cleanPhone}`, '_blank');
    
    toast.success("Iniciando chamada...");
  };

  // Função para enviar email
  const sendEmail = (email: string) => {
    if (!isLoggedIn) {
      setShowPricingModal(true);
      return;
    }
    
    // Criar assunto personalizado
    const subject = encodeURIComponent(`Contato - ${lead.companyName}`);
    
    // Criar corpo do email personalizado
    const body = encodeURIComponent(`Olá,\n\nVi sua empresa ${lead.companyName} e gostaria de saber mais sobre seus produtos/serviços.\n\nAtenciosamente,`);
    
    // Abrir o cliente de email padrão
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
    
    toast.success("Abrindo cliente de email...");
  };

  // Determinar as iniciais para o avatar
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Gerar uma cor de fundo baseada no nome da empresa
  const generateAvatarBgColor = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-gray-500 to-gray-600',
      'from-blue-400 to-blue-500',
      'from-gray-600 to-gray-700',
      'from-blue-600 to-blue-700',
      'from-gray-400 to-gray-500',
      'from-blue-700 to-blue-800'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  // Determinar a cor do badge de match
  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-blue-100 text-blue-800';
    if (percentage >= 80) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Formatar o texto do match
  const formatMatchText = (percentage: number) => {
    return `${percentage}%`;
  };

  // Determinar se é um lead premium
  const isPremium = lead.isPremium;

  // Obter as iniciais para o avatar
  const initials = getInitials(lead.companyName);
  
  // Obter a cor de fundo do avatar
  const avatarBgColor = generateAvatarBgColor(lead.companyName);
  
  // Verificar se o lead está desbloqueado de fato
  const isReallyUnlocked = lead.isUnlocked && isLoggedIn;

  // Formatação de CNAE para exibição
  const formatCnae = (cnae: string | undefined) => {
    if (!cnae) return null;
    
    // Formatação padrão XX.XX-X/XX
    if (cnae.length === 7) {
      return `${cnae.substring(0, 2)}.${cnae.substring(2, 4)}-${cnae.substring(4, 5)}/${cnae.substring(5)}`;
    }
    return cnae;
  };

  // Animação de highlight para elementos novos
  const highlightAnimation = "animate-highlight-fade";

  return (
    <div 
      className={`bg-white border rounded-lg shadow-sm py-3 px-3 relative hover:bg-gray-50 transition-colors ${highlightAnimation} ${isSelected ? 'bg-blue-50 border-blue-200' : 'border-gray-200'} mb-2`}
      onClick={() => onToggleSelection(lead.id)}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative mt-0.5">
          <div 
            className={`w-5 h-5 rounded border ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center cursor-pointer absolute -top-0.5 -left-0.5 z-10`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelection(lead.id);
            }}
          >
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
          
          <div className={`w-11 h-11 bg-gradient-to-br ${avatarBgColor} rounded-lg flex items-center justify-center font-bold text-sm text-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
            {lead.avatar || initials}
          </div>
          
          {/* Badge premium */}
          {isPremium && (
            <div className="absolute -top-1 -right-1 bg-gray-500 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center">
              ⭐
            </div>
          )}
        </div>
        
        {/* Conteúdo do Lead */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isReallyUnlocked ? (
                <div className="flex items-center space-x-1">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">{lead.companyName}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(lead.companyName, 'Nome da empresa');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copiar nome da empresa para a área de transferência"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <h3 className="font-semibold text-gray-900 truncate text-sm relative">
                  <span>{lead.companyName.substring(0, 3)}</span>
                  <span className="bg-gradient-to-r from-transparent to-transparent via-gray-200 px-1 mx-1 rounded">•••</span>
                  <span>{lead.companyName.substring(lead.companyName.length - 3)}</span>
                </h3>
              )}
              <p className="text-xs text-gray-500 truncate break-words">{lead.description}</p>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              <Badge className={`${getMatchBadgeColor(lead.matchPercentage)} text-xs py-0.5 px-1.5`}>
                {formatMatchText(lead.matchPercentage)}
              </Badge>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(lead.id);
                }}
                className={`${lead.isFavorited ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors`}
                aria-label={lead.isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                title={lead.isFavorited ? "Remover esta empresa dos favoritos" : "Adicionar esta empresa aos favoritos"}
              >
                <Star className={`h-4 w-4 ${lead.isFavorited ? 'fill-yellow-500' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Localização e informações da empresa - estilo iFood */}
          <div className="flex items-center text-xs text-gray-500 mt-1.5 flex-wrap">
              <div className="flex items-center mr-2">
              <MapPin className="h-3 w-3 mr-0.5 text-gray-500" />
                <span>{lead.location}</span>
              </div>
              
              <div className="flex items-center mr-2">
              <Users className="h-3 w-3 mr-0.5 text-gray-500" />
                <span>{lead.employeeCount}</span>
              </div>
              
              {/* CNAE (sempre visível mas formatado diferente baseado no desbloqueio) */}
              {lead.cnae && (
                <div className="flex items-center">
                <Building className="h-3 w-3 mr-0.5 text-gray-500" />
                  {isReallyUnlocked ? (
                    <>
                      <span 
                        className="text-xs cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCnaeInfo(true);
                      }}
                        title="Ver detalhes do CNAE"
                      >
                        {formatCnae(lead.cnae)}
                        <Info className="h-2.5 w-2.5 ml-0.5" />
                      </span>
                    </>
                  ) : (
                    <span className="text-xs">
                      CNAE: {lead.cnae.substring(0, 2)}...
                    </span>
                  )}
                </div>
              )}
          </div>
          
          {/* Insights de IA (se disponível) */}
          {lead.aiInsights && (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-l-2 border-gray-300 pl-2 pr-1 py-1 mt-2 text-[10px] leading-tight text-gray-700 rounded-r-md">
              <span className="font-medium">IA:</span> {lead.aiInsights}
            </div>
          )}
          
          {/* Informações detalhadas quando desbloqueado */}
          {isReallyUnlocked ? (
            <div className="mt-3 border border-gray-200 bg-gray-100 rounded-md p-2 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-gray-800 flex items-center">
                  <span className="mr-1">Informações de Contato</span>
                  <span className="bg-gray-200 text-gray-700 text-[10px] px-1 rounded">Desbloqueado</span>
                </h4>
                    <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Abrir modal com todos os detalhes
                    setShowCompanyDetails(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Ver detalhes completos
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                    </button>
                  </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  {/* Telefone Principal */}
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 flex items-center">
                      <span className="text-xs text-gray-800 truncate mr-1">{lead.contactPhone || "Não informado"}</span>
                      {lead.contactPhone && (
                        <div className="flex space-x-1">
                          <button 
                            className="text-gray-500 hover:text-blue-700" 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(lead.contactPhone!, 'Telefone');
                            }}
                            title="Copiar telefone para a área de transferência"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button 
                            className="text-gray-500 hover:text-blue-700" 
                            onClick={(e) => {
                              e.stopPropagation();
                              openWhatsApp(lead.contactPhone!);
                            }}
                            title="Abrir WhatsApp"
                          >
                            <Send className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="flex-1 flex items-center">
                      <span className="text-xs text-gray-800 truncate mr-1">{lead.contactEmail || "Não informado"}</span>
                      {lead.contactEmail && (
                        <div className="flex space-x-1">
                          <button 
                            className="text-gray-500 hover:text-blue-700" 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(lead.contactEmail!, 'Email');
                            }}
                            title="Copiar email para a área de transferência"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button 
                            className="text-gray-500 hover:text-blue-700" 
                            onClick={(e) => {
                              e.stopPropagation();
                              sendEmail(lead.contactEmail!);
                            }}
                            title="Enviar email"
                          >
                            <Send className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-800 truncate">{lead.nomeFantasia || lead.companyName}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-md p-2 animate-fade-in">
                <div className="space-y-2 flex-1">
                  <div className="flex">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {lead.contactPhone ? 
                            lead.contactPhone : 
                            "Telefone bloqueado"}
                        </span>
                        <Lock className="h-3 w-3 ml-1 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {lead.contactEmail ? 
                            lead.contactEmail : 
                            "Email bloqueado"}
                        </span>
                        <Lock className="h-3 w-3 ml-1 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
              {/* Mensagem de desbloqueio (sempre visível quando desbloqueado) */}
              {(lead.showUnlockMessage || lead.isUnlocked) && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-700">
                  <p>Foi usado 1 crédito para ver esta empresa.</p>
                  <p className="mt-1">Assine o plano Plus e tenha acesso ilimitado!</p>
                </div>
              )}
            </div>
          )}
          
          {/* Botões de ação estilo rede social */}
          <div className="mt-3 grid grid-cols-5 gap-1 border-t border-gray-200 pt-2">
            {isReallyUnlocked ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  showPricingBannerWithTimer();
                }}
                className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mb-1">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span className="text-[10px]">Enviar em Massa</span>
                </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isReallyUnlocked) {
                    // Modificar o lead para mostrar a mensagem de desbloqueio
                    lead.showUnlockMessage = true;
                    // Forçar re-renderização
                    setShowCnaeInfo(false);
                    // Tentar desbloquear
                    onUnlock(lead.id);
                  } else {
                    // Já está desbloqueado, mostrar detalhes
                    setShowCompanyDetails(true);
                  }
                }}
                className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <div className="bg-blue-100 rounded-full p-1">
                  <User className="h-3.5 w-3.5 text-blue-600 mb-0.5" />
              </div>
                <span className="text-[10px] text-blue-600 font-medium">Ver dados</span>
              </button>
          )}
      
            {/* Botão Seguir estilo LinkedIn */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (!isLoggedIn) {
                  // Mostrar banner premium para não logados
                  setPremiumFeature({
                    title: "Siga empresas de interesse",
                    description: "Crie sua conta gratuita para seguir empresas e receber atualizações sobre elas.",
                    featureType: 'action'
                  });
                  setShowPricingModal(true);
                  return;
                }
                
                toast.success("Empresa adicionada aos seus seguidos!");
              }}
              className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mb-1">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span className="text-[10px]">Seguir</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isReallyUnlocked) {
                  // Modificar o lead para mostrar a mensagem de desbloqueio
                  lead.showUnlockMessage = true;
                  // Forçar re-renderização
                  setShowCnaeInfo(false);
                  // Tentar desbloquear
                  onUnlock(lead.id);
                } else if (lead.contactPhone) {
                  // Já está desbloqueado, enviar WhatsApp
                  openWhatsApp(lead.contactPhone);
                } else {
                  toast.error("Número de telefone não disponível");
                }
              }}
              className="flex flex-col items-center justify-center text-gray-600 hover:text-green-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className="text-[10px]">Enviar WhatsApp</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isReallyUnlocked) {
                  // Modificar o lead para mostrar a mensagem de desbloqueio
                  lead.showUnlockMessage = true;
                  // Forçar re-renderização
                  setShowCnaeInfo(false);
                  // Tentar desbloquear
                  onUnlock(lead.id);
                } else if (lead.contactEmail) {
                  // Já está desbloqueado, enviar email
                  sendEmail(lead.contactEmail);
                } else {
                  toast.error("Email não disponível");
                }
              }}
              className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className="text-[10px]">Enviar Email</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isReallyUnlocked) {
                  // Modificar o lead para mostrar a mensagem de desbloqueio
                  lead.showUnlockMessage = true;
                  // Forçar re-renderização
                  setShowCnaeInfo(false);
                  // Tentar desbloquear
                  onUnlock(lead.id);
                } else if (lead.contactPhone) {
                  // Já está desbloqueado, fazer ligação
                  makePhoneCall(lead.contactPhone);
                } else {
                  toast.error("Número de telefone não disponível");
                }
              }}
              className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-4 w-4 mb-1" />
              <span className="text-[10px]">Ligar</span>
            </button>
              </div>
            </div>
          </div>
      
      {/* Modal de Pricing para WhatsApp com Desconto e Countdown */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPricingModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative mx-auto md:max-w-[50%]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {premiumFeature.title || "WhatsApp em Massa - Plano Pro"}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {premiumFeature.description || "Envie mensagens em massa para leads qualificados, tenha acesso a templates inteligentes e aumente suas conversões drasticamente."}
              </p>
              
              {/* Oferta com desconto e temporizador */}
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
                      {premiumFeature.title?.includes("Plus") ? 
                        `R$ ${discountPercent > 0 ? '99' : '119'},00` :
                        premiumFeature.title?.includes("Ultra") ?
                        "R$ 999,00" :
                        "R$ 399,00"
                      }
                      <span className="text-xs line-through ml-2 text-gray-500">
                        {premiumFeature.title?.includes("Plus") ? 
                          "R$ 119,00" :
                          premiumFeature.title?.includes("Ultra") ?
                          "R$ 1.299,00" :
                          "R$ 499,00"
                        }
                      </span>
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
              
              <div className="bg-gray-100 p-3 rounded-lg mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">
                    {premiumFeature.title?.includes("Plus") ? 
                      "Plano Plus inclui:" :
                      premiumFeature.title?.includes("Ultra") ?
                      "Plano Ultra IA inclui:" :
                      "Plano Pro inclui:"
                    }
                  </span>
                </p>
                
                {premiumFeature.title?.includes("Plus") ? (
                  <ul className="text-xs text-left pl-4 space-y-1 text-gray-700">
                    <li>✓ Contatos ilimitados</li>
                    <li>✓ Envio manual de WhatsApp</li>
                    <li>✓ Filtros avançados liberados</li>
                    <li>✓ Acompanhamento básico</li>
                  </ul>
                ) : premiumFeature.title?.includes("Ultra") ? (
                  <ul className="text-xs text-left pl-4 space-y-1 text-gray-700">
                    <li>✓ Contatos ilimitados</li>
                    <li>✓ Envio em massa para múltiplos leads</li>
                    <li>✓ Busca automática de leads</li>
                    <li>✓ Envio automático de mensagens</li>
                    <li>✓ IA para personalização avançada</li>
                    <li>✓ Automação completa do processo</li>
                    <li>✓ Relatórios avançados e métricas</li>
                    <li>✓ Suporte VIP 24/7</li>
                  </ul>
                ) : (
                  <ul className="text-xs text-left pl-4 space-y-1 text-gray-700">
                    <li>✓ Contatos ilimitados</li>
                    <li>✓ Envio em massa para múltiplos leads</li>
                    <li>✓ Templates personalizados de alta conversão</li>
                    <li>✓ Acompanhamento de resultados</li>
                    <li>✓ Todos os filtros avançados liberados</li>
                    <li>✓ Automação básica de mensagens</li>
                  </ul>
                )}
                
                {!premiumFeature.title?.includes("Plus") && (
                  <p className="mt-3 text-xs text-gray-500">
                    {premiumFeature.title?.includes("Ultra") ? 
                      "Procurando uma opção mais acessível? " : 
                      "Quer apenas desbloquear contatos e envio manual? "
                    }
                    <button onClick={() => showPlusPlan()} className="text-blue-600 underline">Ver Plano Plus por R$99</button>
                  </p>
                )}
                
                {!premiumFeature.title?.includes("Ultra") && !premiumFeature.title?.includes("Plus") && (
                  <p className="mt-2 text-xs text-gray-500">
                    Quer automação completa com IA? <button onClick={() => showUltraPlan()} className="text-purple-600 underline">Ver Plano Ultra IA</button>
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={() => {
                    setShowPricingModal(false);
                    window.location.href = "http://localhost:8080/pricing";
                  }}
                  className={`flex-1 ${
                    premiumFeature.title?.includes("Plus") ? 
                      "bg-blue-600 hover:bg-blue-700" :
                      premiumFeature.title?.includes("Ultra") ?
                      "bg-purple-600 hover:bg-purple-700" :
                      "bg-blue-700 hover:bg-blue-800"
                  } text-white`}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {premiumFeature.title?.includes("Plus") ? 
                    "Assinar Plano Plus" :
                    premiumFeature.title?.includes("Ultra") ?
                    "Assinar Plano Ultra IA" :
                    "Assinar Plano Pro"
                  }
                </Button>
                <Button 
                  onClick={() => setShowPricingModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Agora não
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Informações do CNAE */}
      {showCnaeInfo && lead.cnae && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowCnaeInfo(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4 overflow-hidden">
                <span className="text-gray-700 font-mono font-bold text-xs">
                  {formatCnae(lead.cnae)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Detalhes do CNAE</h3>
              <p className="text-gray-600 mb-4">
                {lead.description}
              </p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-2">Sobre este segmento:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Este CNAE representa atividades de {lead.description.toLowerCase()}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>Empresas neste segmento geralmente buscam soluções de {getSegmentNeeds(lead.cnae)}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Este é um {isHighPotentialCnae(lead.cnae) ? 'segmento de alto potencial' : 'segmento tradicional'} para conversão</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShowCnaeInfo(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entendi
                </Button>
                
                <Button 
                  onClick={() => {
                    setShowCnaeInfo(false);
                    window.location.href = "http://localhost:8080/pricing";
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Mais leads deste CNAE
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Detalhes Completos da Empresa */}
      {showCompanyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowCompanyDetails(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-left">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${avatarBgColor} rounded-lg flex items-center justify-center font-bold text-lg text-white mr-3`}>
                  {lead.avatar || initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{lead.companyName}</h3>
                  <p className="text-sm text-gray-600">{lead.description}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Dados da Empresa */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Building className="h-4 w-4 mr-1 text-blue-600" />
                    Dados da Empresa
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Razão Social</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{lead.razaoSocial || "Não informado"}</p>
                        {lead.razaoSocial && (
                          <button 
                            onClick={() => copyToClipboard(lead.razaoSocial!, 'Razão Social')}
                            className="text-gray-400 hover:text-gray-600 ml-1"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nome Fantasia</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{lead.nomeFantasia || "Não informado"}</p>
                        {lead.nomeFantasia && (
                          <button 
                            onClick={() => copyToClipboard(lead.nomeFantasia!, 'Nome Fantasia')}
                            className="text-gray-400 hover:text-gray-600 ml-1"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CNPJ</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{lead.cnpj || "Não informado"}</p>
                        {lead.cnpj && (
                          <button 
                            onClick={() => copyToClipboard(lead.cnpj!, 'CNPJ')}
                            className="text-gray-400 hover:text-gray-600 ml-1"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CNAE</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{formatCnae(lead.cnae) || "Não informado"}</p>
                        <button 
                          onClick={() => setShowCnaeInfo(true)}
                          className="text-blue-500 hover:text-blue-700 ml-1"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Natureza Jurídica</p>
                      <p className="text-sm text-gray-800">{lead._secure_natureza_juridica || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Situação Cadastral</p>
                      <p className="text-sm text-gray-800">{lead._secure_situacao_cadastral || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Data de Abertura</p>
                      <p className="text-sm text-gray-800">{lead.dataAbertura || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Capital Social</p>
                      <p className="text-sm text-gray-800">{lead.capitalSocial || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Número de Funcionários</p>
                      <p className="text-sm text-gray-800">{lead.employeeCount || "Não informado"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Endereço Completo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-700" />
                    Localização
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Endereço Completo</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{lead.fullAddress || "Não informado"}</p>
                        {lead.fullAddress && (
                          <button 
                            onClick={() => copyToClipboard(lead.fullAddress!, 'Endereço')}
                            className="text-gray-400 hover:text-gray-600 ml-1"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Logradouro</p>
                      <p className="text-sm text-gray-800">{lead.logradouro || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Número</p>
                      <p className="text-sm text-gray-800">{lead.numero || "S/N"}</p>
                    </div>
                    
                    {lead.complemento && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Complemento</p>
                        <p className="text-sm text-gray-800">{lead.complemento}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bairro</p>
                      <p className="text-sm text-gray-800">{lead.bairro || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CEP</p>
                      <p className="text-sm text-gray-800">{lead.cep || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cidade/Estado</p>
                      <p className="text-sm text-gray-800">{lead.location || "Não informado"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Informações de Contato */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-700" />
                    Contato Principal
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nome</p>
                      <p className="text-sm text-gray-800">{lead.nomeFantasia || lead.companyName}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Telefone Principal</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{lead.contactPhone || "Não informado"}</p>
                        {lead.contactPhone && (
                          <div className="flex space-x-1 ml-2">
                            <button 
                              onClick={() => copyToClipboard(lead.contactPhone!, 'Telefone')}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => openWhatsApp(lead.contactPhone!)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Send className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">E-mail</p>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">{lead.contactEmail || "Não informado"}</p>
                        {lead.contactEmail && (
                          <div className="flex space-x-1 ml-2">
                            <button 
                              onClick={() => copyToClipboard(lead.contactEmail!, 'Email')}
                              className="text-gray-500 hover:text-blue-700"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => sendEmail(lead.contactEmail!)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Send className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Insights de IA */}
                {lead.aiInsights && (
                  <div className="bg-gray-100 p-4 rounded-lg border-l-2 border-gray-300">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-gray-700" />
                      Insights de IA
                    </h4>
                    <p className="text-sm text-gray-700">{lead.aiInsights}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  onClick={() => {
                    if (lead.contactPhone) {
                      openWhatsApp(lead.contactPhone);
                    } else {
                      toast.error("Número de telefone não disponível");
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Enviar no WhatsApp
                </Button>
                <Button 
                  onClick={() => setShowCompanyDetails(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para determinar necessidades do segmento baseado no CNAE
const getSegmentNeeds = (cnae: string): string => {
  const cnaePrefix = cnae.substring(0, 2);
  
  // Mapeamento de algumas categorias comuns
  const needsMap: {[key: string]: string} = {
    '62': 'infraestrutura de TI, marketing digital e automação',
    '69': 'sistemas de gestão, segurança de dados e comunicação',
    '86': 'sistemas de agendamento, gestão de pacientes e marketing',
    '56': 'delivery, presença online e sistemas de pedidos',
    '47': 'e-commerce, gestão de estoque e marketing digital',
    '85': 'plataformas de ensino, gestão escolar e comunicação',
    '43': 'orçamentos, gestão de projetos e captação de clientes'
  };
  
  return needsMap[cnaePrefix] || 'gestão empresarial, marketing e presença digital';
};

// Função para determinar CNAEs de alto potencial
const isHighPotentialCnae = (cnae: string): boolean => {
  // CNAEs considerados de alto potencial (exemplo)
  const highPotentialPrefixes = ['62', '69', '70', '86', '71', '73'];
  const cnaePrefix = cnae.substring(0, 2);
  
  return highPotentialPrefixes.includes(cnaePrefix);
};

export default LeadCard; 