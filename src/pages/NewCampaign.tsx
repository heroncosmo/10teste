import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useAuth } from "@/providers/AuthProvider";
import { Empresa, Campaign } from "@/types/database";
import { startSimulatedCampaign } from "@/services/whatsappService";
import { 
  ArrowLeft, 
  Plus, 
  Send,
  Calendar,
  Users,
  MessageSquare,
  ChevronRight,
  Filter,
  Search,
  Check,
  Loader2,
  Zap,
  Star,
  StarOff,
  Heart,
  Share,
  MessageCircle,
  Bookmark,
  Eye,
  SortAsc,
  MapPin,
  Phone,
  Building,
  FileText,
  Clock,
  ChevronDown,
  BarChart,
  Flame,
  X,
  Smile,
  Mic,
  Sparkles,
  Lock,
  Unlock,
  Crown,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Rocket,
  Award,
  Trophy,
  Bell,
  BellOff,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import BottomMenu from "@/components/ui/BottomMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import "../components/ui/animations.css";
import { Calendar as CalendarIcon } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const NewCampaign = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("leads");
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmpresas, setSelectedEmpresas] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStartingCampaign, setIsStartingCampaign] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [likedEmpresas, setLikedEmpresas] = useState<string[]>([]);
  const [chatEmpresa, setChatEmpresa] = useState<Empresa | null>(null);
  const [chatMensagens, setChatMensagens] = useState<{[cnpj: string]: string[]}>({});
  const [chatInput, setChatInput] = useState("");
  const [sortBy, setSortBy] = useState<string>("nome");
  const [filterType, setFilterType] = useState<string>("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const rowsPerPage = 20;
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [creditsAvailable, setCreditsAvailable] = useState(10);
  const [unlockedEmpresas, setUnlockedEmpresas] = useState<string[]>([]);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [upgradeBannerType, setUpgradeBannerType] = useState<'credits' | 'templates' | 'leads' | 'messages'>('credits');
  const [showProFeatures, setShowProFeatures] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementType, setAchievementType] = useState<'first_campaign' | 'five_leads' | 'ten_leads' | 'pro_template'>('first_campaign');
  
  // Estados para swipe em dispositivos móveis
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Estados para agendamento
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled" | "recurring">("immediate");
  const [recurringType, setRecurringType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(undefined);
  
  const { 
    data: empresas,
    isLoading: isEmpresasLoading
  } = useSupabaseData<Empresa>('empresas', { 
    fetchOnMount: true
  });
  
  const { 
    addItem: addCampaign,
    isLoading: isAddingCampaign
  } = useSupabaseData<Campaign>('campaigns');

  // Variáveis de template para personalização de mensagens
  const nome_empresa = "{nome_empresa}";
  const cidade = "{cidade}";
  const segmento = "{segmento}";
  const data_atual = "{data_atual}";

  // Templates de mensagem pré-definidos
  const messageTemplates = [
    {
      name: "Apresentação Básica",
      content: "Olá {nome}, tudo bem? Sou {seu_nome} da {sua_empresa}. Gostaria de apresentar nossos serviços de {seu_serviço} que podem ajudar empresas de {segmento} como a sua. Podemos conversar sobre como podemos ajudar a {benefício_principal}?"
    },
    {
      name: "Promoção Especial",
      content: "Oi {nome}! A {sua_empresa} está com uma promoção especial para empresas de {segmento} em {cidade}. Estamos oferecendo {oferta_especial} por tempo limitado. Tem interesse em saber mais detalhes?"
    },
    {
      name: "Recomendação",
      content: "Olá {nome}! Meu nome é {seu_nome} da {sua_empresa}. Trabalhamos com a {empresa_referência} que nos recomendou entrar em contato com vocês. Oferecemos soluções para {problema_comum} em empresas de {segmento}. Podemos conversar sobre como podemos ajudar a {nome} também?"
    }
  ];
  
  // Template Pro - apenas exibição
  const proTemplates = [
    {
      name: "Follow-up Inteligente",
      content: "Olá {nome}, estou retornando contato conforme combinamos. Analisei seu perfil e percebi que sua empresa poderia se beneficiar especialmente de nossa solução de {solução_personalizada}. Quando seria um bom momento para demonstrarmos como isso aumentaria seus resultados em {percentual}%?",
      isPro: true
    },
    {
      name: "Engajamento Automático",
      content: "Olá {nome}, notei que sua empresa tem trabalhado com {área_detectada}. Nossa solução de {solução_relevante} tem ajudado empresas similares a aumentar {métrica_principal} em até {percentual}%. Gostaria de uma demonstração personalizada?",
      isPro: true
    }
  ];
  
  const getEngagementScore = (cnpj: string) => {
    const hash = cnpj.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return (hash % 100) + 1;
  };
  
  const getLeadTemperature = (score: number) => {
    if (score >= 70) return { label: "Hot Lead", color: "text-red-500", bg: "bg-red-50", icon: <Flame className="h-4 w-4 text-red-500" /> };
    if (score >= 40) return { label: "Warm Lead", color: "text-orange-500", bg: "bg-orange-50", icon: <Flame className="h-4 w-4 text-orange-500" /> };
    return { label: "Cold Lead", color: "text-blue-500", bg: "bg-blue-50", icon: <BarChart className="h-4 w-4 text-blue-500" /> };
  };

  const sortEmpresas = (empresas: Empresa[] | undefined) => {
    if (!empresas) return [];
    
    return [...empresas].sort((a, b) => {
      switch (sortBy) {
        case "nome":
          return (a.nome_fantasia || a.razao_social || "").localeCompare(b.nome_fantasia || b.razao_social || "");
        case "engajamento":
          return getEngagementScore(b.cnpj_basico || "") - getEngagementScore(a.cnpj_basico || "");
        case "cidade":
          return (a.municipio || "").localeCompare(b.municipio || "");
        default:
          return 0;
      }
    });
  };
  
  const filterEmpresas = (empresas: Empresa[] | undefined) => {
    if (!empresas) return [];
    
    let filtered = empresas.filter(empresa => 
      (empresa.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cnae_descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.municipio?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      empresa.situacao_cadastral === 'ATIVA' &&
      empresa.telefone_1
    );
    
    if (filterType !== "todos") {
      switch (filterType) {
        case "favoritos":
          filtered = filtered.filter(empresa => favoritos.includes(empresa.cnpj_basico || ""));
          break;
        case "hot":
          filtered = filtered.filter(empresa => getEngagementScore(empresa.cnpj_basico || "") >= 70);
          break;
        case "warm":
          filtered = filtered.filter(empresa => {
            const score = getEngagementScore(empresa.cnpj_basico || "");
            return score >= 40 && score < 70;
          });
          break;
        case "cold":
          filtered = filtered.filter(empresa => getEngagementScore(empresa.cnpj_basico || "") < 40);
          break;
      }
    }
    
    return sortEmpresas(filtered);
  };

  const filteredEmpresas = filterEmpresas(empresas);

  // Função para carregar mais empresas (para scroll infinito)
  const loadMoreEmpresas = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
    
    // Simular um pequeno delay para mostrar o indicador de carregamento
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 500);
  };

  // Função para observar o scroll e carregar mais itens quando necessário
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100) return;
      loadMoreEmpresas();
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore]); // Apenas recriar o event listener quando isLoadingMore mudar
  
  // Paginar os resultados filtrados
  const paginatedEmpresas = useMemo(() => {
    const endIndex = (page + 1) * rowsPerPage;
    return filteredEmpresas?.slice(0, endIndex) || [];
  }, [filteredEmpresas, page, rowsPerPage]);

  const handleSelectEmpresa = (empresaCnpj: string) => {
    if (selectedEmpresas.includes(empresaCnpj)) {
      setSelectedEmpresas(selectedEmpresas.filter(cnpj => cnpj !== empresaCnpj));
      toast("Lead removido da seleção", {
        description: "Você pode adicionar novamente a qualquer momento"
      });
    } else {
      // Verificar limite de leads no plano gratuito
      if (selectedEmpresas.length >= 5 && !showProFeatures) {
        setUpgradeBannerType('leads');
        setShowUpgradeBanner(true);
        return;
      }
      
      setSelectedEmpresas([...selectedEmpresas, empresaCnpj]);
      
      if (selectedEmpresas.length === 0) {
        toast.success("Primeiro lead selecionado! 🎉", {
          description: "Continue selecionando para criar sua campanha"
        });
      } else if (selectedEmpresas.length === 4) {
        setAchievementType('five_leads');
        setShowAchievement(true);
        toast.success("Ótimo progresso! 5 leads selecionados 🚀", {
          description: "No plano PRO você pode selecionar leads ilimitados"
        });
      } else if (selectedEmpresas.length === 9) {
        setAchievementType('ten_leads');
        setShowAchievement(true);
      }
    }
  };

  const handleSelectAllEmpresas = () => {
    if (filteredEmpresas?.length === selectedEmpresas.length) {
      setSelectedEmpresas([]);
    } else {
      setSelectedEmpresas(filteredEmpresas?.map(empresa => empresa.cnpj_basico || '') || []);
    }
  };

  const toggleFavorito = (cnpj: string) => {
    setFavoritos((prev) =>
      prev.includes(cnpj)
        ? prev.filter((f) => f !== cnpj)
        : [...prev, cnpj]
    );
  };

  const toggleLike = (cnpj: string) => {
    setLikedEmpresas((prev) =>
      prev.includes(cnpj)
        ? prev.filter((f) => f !== cnpj)
        : [...prev, cnpj]
    );
  };

  const handleAbrirMensagem = (empresa: Empresa) => {
    setChatEmpresa(empresa);
  };

  const handleEnviarMensagem = () => {
    if (!chatEmpresa || !chatInput.trim()) return;
    const cnpj = chatEmpresa.cnpj_basico || '';
    
    if ((chatMensagens[cnpj]?.length || 0) >= 10) {
      setUpgradeBannerType('messages');
      setShowUpgradeBanner(true);
      toast.error("Limite de mensagens atingido no plano gratuito");
      return;
    }
    
    setChatMensagens((prev) => ({
      ...prev,
      [cnpj]: [...(prev[cnpj] || []), chatInput.trim()]
    }));
    
    setChatInput("");
    
    toast.success("Mensagem enviada com sucesso!", {
      description: "No plano PRO, as mensagens são enviadas para o WhatsApp real do cliente."
    });
    
    if (!favoritos.includes(cnpj)) {
      setTimeout(() => {
        setFavoritos(prev => [...prev, cnpj]);
        toast.info("Lead adicionado aos favoritos automaticamente", {
          description: "A IA classificou este lead como promissor com base na sua interação"
        });
      }, 2000);
    }
  };

  const mensagensEnviadas = chatEmpresa ? (chatMensagens[chatEmpresa.cnpj_basico || '']?.length || 0) : 0;

  const handleCreateAndStartCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error("Forneça um nome para a campanha");
      return;
    }

    if (!message.trim()) {
      toast.error("Forneça uma mensagem para a campanha");
      return;
    }

    if (selectedEmpresas.length === 0) {
      toast.error("Selecione pelo menos uma empresa para a campanha");
      return;
    }

    setIsStartingCampaign(true);

    try {
      const campaignData = {
        name: campaignName,
        user_id: user?.id,
        status: 'draft' as const,
        description: `Campanha com ${selectedEmpresas.length} empresas selecionadas`
      };
      
      const newCampaign = await addCampaign(campaignData);

      if (newCampaign && 'id' in newCampaign) {
        toast.success("Campanha criada! Iniciando envios simulados...");
        
        await startSimulatedCampaign(newCampaign.id, selectedEmpresas, message);
        
        navigate("/campaigns");
      } else {
        toast.error("Erro ao criar campanha: ID não retornado");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Erro ao criar campanha");
    } finally {
      setIsStartingCampaign(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab === "leads") {
      if (selectedEmpresas.length === 0) {
        toast.error("Selecione pelo menos uma empresa");
        return;
      }
      setActiveTab("message");
    } else if (activeTab === "message") {
      if (!message.trim()) {
        toast.error("Forneça uma mensagem para a campanha");
        return;
      }
      setActiveTab("review");
    }
  };

  const handlePrevTab = () => {
    if (activeTab === "message") {
      setActiveTab("leads");
    } else if (activeTab === "review") {
      setActiveTab("message");
    }
  };

  // Função para gerar sugestão de IA (simulada)
  const generateAiSuggestion = () => {
    setAiSuggestion("Carregando sugestão...");
    
    // Simulando delay de processamento da IA
    setTimeout(() => {
      // Texto gerado "pela IA"
      const suggestion = `Olá {nome}! 

Espero que esteja tudo bem com você. Sou [seu nome] da [sua empresa] e estamos ajudando empresas de ${selectedEmpresas.length > 0 ? empresas?.find(e => e.cnpj_basico === selectedEmpresas[0])?.cnae_descricao || 'seu segmento' : 'seu segmento'} a aumentarem suas vendas através de estratégias digitais personalizadas.

Gostaria de compartilhar como podemos ajudar a ${selectedEmpresas.length > 0 ? empresas?.find(e => e.cnpj_basico === selectedEmpresas[0])?.nome_fantasia || '{nome}' : '{nome}'} a alcançar mais clientes e aumentar seu faturamento.

Podemos conversar por 10 minutos esta semana?`;
      
      setAiSuggestion(suggestion);
      
      toast.success("IA gerou uma sugestão de mensagem!", {
        description: "No plano PRO, a IA personaliza mensagens para cada lead automaticamente"
      });
    }, 1500);
  };

  // Aplicar template à mensagem
  const applyTemplate = (templateContent: string) => {
    // Verificar se é um template PRO
    const isProTemplate = proTemplates.some(t => t.content === templateContent);
    
    if (isProTemplate) {
      setUpgradeBannerType('templates');
      setShowUpgradeBanner(true);
      return;
    }
    
    setMessage(templateContent);
    setShowTemplates(false);
    
    toast.success("Template aplicado com sucesso!", {
      description: "Personalize os campos entre { } com informações relevantes"
    });
  };

  // Gerar um badge aleatório para cada empresa (simulação)
  const getBadgeForEmpresa = (cnpj: string) => {
    const hash = parseInt(cnpj.substring(0, 5), 10);
    const badges = [
      { label: "Novo Lead", color: "text-blue-600 bg-blue-50 border-blue-200" },
      { label: "Em andamento", color: "text-amber-600 bg-amber-50 border-amber-200" },
      { label: "Hot Lead", color: "text-red-600 bg-red-50 border-red-200" },
      { label: "Oportunidade", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
      { label: "Recorrente", color: "text-purple-600 bg-purple-50 border-purple-200" },
    ];
    return badges[hash % badges.length];
  };
  
  // Função para desbloquear uma empresa usando créditos
  const unlockEmpresa = (cnpj: string) => {
    if (unlockedEmpresas.includes(cnpj)) return; // Já está desbloqueada
    
    if (creditsAvailable <= 0) {
      setUpgradeBannerType('credits');
      setShowUpgradeBanner(true);
      toast.error("Créditos insuficientes", {
        description: "Faça upgrade para o plano PRO para desbloquear leads ilimitados."
      });
      return;
    }
    
    setUnlockedEmpresas([...unlockedEmpresas, cnpj]);
    setCreditsAvailable(creditsAvailable - 1);
    
    // Feedback visual
    toast.success("Lead desbloqueado com sucesso!", {
      description: `Restam ${creditsAvailable - 1} créditos neste mês.`
    });
    
    // Desbloquear automaticamente seleciona o lead
    if (!selectedEmpresas.includes(cnpj)) {
      setSelectedEmpresas([...selectedEmpresas, cnpj]);
    }
    
    // Mostrar conquista se for o primeiro lead desbloqueado
    if (unlockedEmpresas.length === 0) {
      setAchievementType('first_campaign');
      setShowAchievement(true);
    }
  };
  
  // Verificar se uma empresa está desbloqueada
  const isEmpresaUnlocked = (cnpj: string) => {
    // Sempre mostrar os primeiros 5 leads para todos os usuários
    const isAlwaysVisible = paginatedEmpresas.findIndex(e => e.cnpj_basico === cnpj) < 5;
    return isAlwaysVisible || unlockedEmpresas.includes(cnpj);
  };

  // Funções para swipe em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentSwipeIndex < paginatedEmpresas.length - 1) {
      setCurrentSwipeIndex(prev => prev + 1);
    } else if (isRightSwipe && currentSwipeIndex > 0) {
      setCurrentSwipeIndex(prev => prev - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Função para calcular o progresso da criação da campanha
  const getCampaignProgress = () => {
    if (activeTab === "leads") {
      return selectedEmpresas.length > 0 ? 33 : 0;
    } else if (activeTab === "message") {
      return message.trim() !== "" ? 66 : 33;
    } else if (activeTab === "review") {
      return 100;
    }
    return 0;
  };

  // Função para formatar a data de agendamento
  const formatScheduleDate = (date: Date | undefined) => {
    if (!date) return "Não definido";
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Função para obter o melhor horário de envio
  const getBestSendingTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 9) return "09:00";
    if (hour < 12) return "12:00";
    if (hour < 15) return "15:00";
    if (hour < 17) return "17:00";
    return "09:00"; // Para o próximo dia
  };

  // Função para verificar se o agendamento está disponível
  const isSchedulingAvailable = () => {
    // Simulação: apenas usuários com mais de 5 leads selecionados podem agendar
    return selectedEmpresas.length > 5;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Nova Campanha</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>
                  Cancelar
              </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setShowProFeatures(true)}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Recursos Pro
                </Button>
            </div>
            </div>
            
            {/* Barra de progresso */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === "leads" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {activeTab === "leads" ? "1" : <Check className="h-5 w-5" />}
                  </div>
                  <div className="ml-2 text-sm font-medium">Selecionar Empresas</div>
                </div>
                
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${getCampaignProgress()}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === "message" ? "bg-blue-600 text-white" : activeTab === "review" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {activeTab === "message" ? "2" : activeTab === "review" ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <div className="ml-2 text-sm font-medium">Escrever Mensagem</div>
                </div>
                
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                    style={{ width: activeTab === "review" ? "100%" : "0%" }}
                  ></div>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === "review" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    3
                  </div>
                  <div className="ml-2 text-sm font-medium">Revisar e Enviar</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Campanha</CardTitle>
              <CardDescription>
                Configure sua campanha de mensagens. No modo simulado, todas as mensagens são registradas mas não enviadas via WhatsApp real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="Ex: Black Friday - Restaurantes" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <TabsTrigger value="leads">1. Selecionar Empresas</TabsTrigger>
                  <TabsTrigger value="message">2. Escrever Mensagem</TabsTrigger>
                  <TabsTrigger value="review">3. Revisar e Enviar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="leads" className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          placeholder="Buscar por empresa, segmento ou cidade..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
                          <Filter size={16} />
                          <span>Filtros</span>
                          <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </Button>
                        <div className="relative">
                          <Button variant="outline" className="gap-2">
                            <SortAsc size={16} />
                            <span>Ordenar</span>
                            <ChevronDown size={16} />
                          </Button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-20 hidden group-hover:block">
                            <div className="p-2 space-y-1">
                              <button 
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'nome' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                onClick={() => setSortBy('nome')}
                              >
                                Nome da Empresa
                              </button>
                              <button 
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'engajamento' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                onClick={() => setSortBy('engajamento')}
                              >
                                Engajamento
                              </button>
                              <button 
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'cidade' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                onClick={() => setSortBy('cidade')}
                              >
                                Cidade
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {showFilters && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                          className={`flex items-center gap-2 p-3 rounded-md border ${filterType === 'todos' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setFilterType('todos')}
                        >
                          <Users size={18} />
                          <span>Todos</span>
                        </button>
                        <button
                          className={`flex items-center gap-2 p-3 rounded-md border ${filterType === 'favoritos' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setFilterType('favoritos')}
                        >
                          <Star size={18} />
                          <span>Favoritos</span>
                        </button>
                        <button
                          className={`flex items-center gap-2 p-3 rounded-md border ${filterType === 'hot' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setFilterType('hot')}
                        >
                          <Flame size={18} />
                          <span>Hot Leads</span>
                        </button>
                        <button
                          className={`flex items-center gap-2 p-3 rounded-md border ${filterType === 'cold' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setFilterType('cold')}
                        >
                          <BarChart size={18} />
                          <span>Cold Leads</span>
                        </button>
                      </div>
                    )}
                    
                    {selectedEmpresas.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="bg-white rounded-md px-3 py-2 flex items-center gap-2 border border-blue-100">
                            <Users size={16} className="text-blue-600" />
                            <span className="text-sm font-medium">{selectedEmpresas.length} empresas selecionadas</span>
                          </div>
                          
                          <div className="bg-white rounded-md px-3 py-2 flex items-center gap-2 border border-blue-100">
                            <Phone size={16} className="text-green-600" />
                            <span className="text-sm font-medium">Taxa de resposta est.: 23%</span>
                          </div>
                          
                          <div className="flex-1"></div>
                          
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setSelectedEmpresas([])}>
                            Limpar seleção
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop View - Grid de Cards */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredEmpresas?.length === 0 && (
                      <div className="text-center text-gray-400 py-8 col-span-full">Nenhuma empresa encontrada</div>
                    )}
                    {paginatedEmpresas.map((empresa) => {
                      const isSelected = selectedEmpresas.includes(empresa.cnpj_basico || '');
                      const isFavorito = favoritos.includes(empresa.cnpj_basico || '');
                      const isLiked = likedEmpresas.includes(empresa.cnpj_basico || '');
                      const engagementScore = getEngagementScore(empresa.cnpj_basico || '');
                      const temperature = getLeadTemperature(engagementScore);
                      
                      return (
                        <div key={empresa.cnpj_basico} 
                          className={`
                            bg-white border rounded-lg overflow-hidden shadow-sm transition-all card-hover-effect
                            ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-200'}
                            ${isEmpresaUnlocked(empresa.cnpj_basico || '') ? '' : 'opacity-85'}
                          `}
                        >
                          <div className={`h-1 ${temperature.bg} flex`}>
                            <div 
                              className={`h-full transition-all duration-500 score-bar`}
                              style={{ 
                                width: `${engagementScore}%`, 
                                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' 
                              }}
                            ></div>
                          </div>
                          
                          <div className="flex items-start justify-between p-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => handleSelectEmpresa(empresa.cnpj_basico || '')}
                                className="h-5 w-5"
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-gray-900">{empresa.nome_fantasia || empresa.razao_social}</h3>
                                  <button 
                                    onClick={() => toggleFavorito(empresa.cnpj_basico || '')}
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                  >
                                    {isFavorito ? 
                                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> : 
                                      <Star className="h-4 w-4" />
                                    }
                                  </button>
                                  <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full ${temperature.bg} ${temperature.color}`}>
                                    {temperature.icon}
                                    <span>{temperature.label}</span>
                                  </div>
                                  
                                  {/* Novo badge de status */}
                                  {isEmpresaUnlocked(empresa.cnpj_basico || '') && (
                                    <div className={`ml-1 text-xs px-2 py-0.5 rounded-full border ${getBadgeForEmpresa(empresa.cnpj_basico || '').color}`}>
                                      {getBadgeForEmpresa(empresa.cnpj_basico || '').label}
                                    </div>
                                  )}
                                </div>
                                
                                {isEmpresaUnlocked(empresa.cnpj_basico || '') ? (
                                  // Conteúdo para empresa desbloqueada
                                  <>
                                    <div className="flex items-center mt-1">
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Building className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{empresa.cnae_descricao}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{empresa.municipio} - {empresa.uf}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Phone className="h-3 w-3" />
                                        <span>{empresa.telefone_1}</span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  // Conteúdo limitado para empresa bloqueada
                                  <>
                                    <div className="flex items-center mt-1">
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Building className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{empresa.cnae_descricao}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Lock className="h-3 w-3 mr-1" />
                                      <span>Informações protegidas - desbloquear para ver</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {isEmpresaUnlocked(empresa.cnpj_basico || '') ? (
                              // Botão para empresa desbloqueada
                              <button
                                onClick={() => handleAbrirMensagem(empresa)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                            ) : (
                              // Botão de desbloqueio
                              <Button
                                size="sm"
                                onClick={() => unlockEmpresa(empresa.cnpj_basico || '')}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white gap-1 shadow-md hover:shadow-lg transition-all"
                              >
                                <Unlock className="h-3 w-3" />
                                <span>Desbloquear</span>
                              </Button>
                            )}
                          </div>
                          
                          {/* Interaction bar com funcionalidades limitadas para não desbloqueados */}
                          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
                            {isEmpresaUnlocked(empresa.cnpj_basico || '') ? (
                              // Botões para empresa desbloqueada
                              <>
                                <button 
                                  onClick={() => toggleLike(empresa.cnpj_basico || '')}
                                  className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                                    isLiked ? 'text-red-500' : 'text-gray-500 hover:bg-gray-100'
                                  }`}
                                >
                                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
                                  <span className="text-xs">Curtir</span>
                                </button>
                                
                                <button 
                                  onClick={() => handleAbrirMensagem(empresa)}
                                  className="flex items-center space-x-1 px-3 py-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="text-xs">Mensagem</span>
                                </button>
                                
                                <button 
                                  className="flex items-center space-x-1 px-3 py-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                  <Share className="h-4 w-4" />
                                  <span className="text-xs">Compartilhar</span>
                                </button>
                              </>
                            ) : (
                              // Informações sobre desbloqueio
                              <div className="w-full flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  <span className="text-blue-600 font-medium">{creditsAvailable}</span> créditos disponíveis
                                </div>
                                <span className="text-xs text-gray-500">
                                  <Badge variant="outline" className="text-xs">
                                    <Users className="h-3 w-3 mr-1" /> 
                                    <span>{Math.floor(Math.random() * 5) + 1} pessoas visualizaram hoje</span>
                                  </Badge>
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Último contato - apenas para desbloqueados */}
                          {isEmpresaUnlocked(empresa.cnpj_basico || '') && (
                            <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Último contato: {new Date().toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                      </div>
                  
                  {/* Mobile View - Swipeable Cards */}
                  <div className="sm:hidden">
                    {filteredEmpresas?.length === 0 && (
                      <div className="text-center text-gray-400 py-8">Nenhuma empresa encontrada</div>
                    )}
                    
                    {paginatedEmpresas.length > 0 && (
                      <div 
                        className="relative h-[500px] overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          {currentSwipeIndex > 0 && (
                        <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute left-2 z-10 h-10 w-10 rounded-full bg-white/80 shadow-md"
                              onClick={() => setCurrentSwipeIndex(prev => prev - 1)}
                            >
                              <ChevronLeft className="h-5 w-5" />
                        </Button>
                          )}
                          
                          {currentSwipeIndex < paginatedEmpresas.length - 1 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-2 z-10 h-10 w-10 rounded-full bg-white/80 shadow-md"
                              onClick={() => setCurrentSwipeIndex(prev => prev + 1)}
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          )}
                          
                          <Card className="w-full max-w-sm mx-auto shadow-lg">
                            {paginatedEmpresas[currentSwipeIndex] && (
                              <>
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
                                <CardHeader>
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle>{paginatedEmpresas[currentSwipeIndex].nome_fantasia || paginatedEmpresas[currentSwipeIndex].razao_social}</CardTitle>
                                      <div className="flex items-center mt-1">
                                        <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full ${getLeadTemperature(getEngagementScore(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')).bg} ${getLeadTemperature(getEngagementScore(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')).color}`}>
                                          {getLeadTemperature(getEngagementScore(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')).icon}
                                          <span>{getLeadTemperature(getEngagementScore(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')).label}</span>
                  </div>
                                      </div>
                                    </div>
                            <Checkbox 
                                      checked={selectedEmpresas.includes(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')}
                                      onCheckedChange={() => handleSelectEmpresa(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')}
                                    />
                                </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Building className="h-4 w-4 mr-1" />
                                    <span className="truncate max-w-[200px]">{paginatedEmpresas[currentSwipeIndex].cnae_descricao}</span>
                                  </div>
                                  
                                  {isEmpresaUnlocked(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '') ? (
                                    <>
                                      <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{paginatedEmpresas[currentSwipeIndex].municipio} - {paginatedEmpresas[currentSwipeIndex].uf}</span>
                                </div>
                                      <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <Phone className="h-4 w-4 mr-1" />
                                        <span>{paginatedEmpresas[currentSwipeIndex].telefone_1}</span>
                                </div>
                                    </>
                                  ) : (
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                      <Lock className="h-4 w-4 mr-1" />
                                      <span>Informações protegidas - desbloquear para ver</span>
                  </div>
                                  )}
                                  
                                  <div className="flex justify-between mt-4">
                                    {isEmpresaUnlocked(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '') ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                                        className="gap-1"
                                        onClick={() => handleAbrirMensagem(paginatedEmpresas[currentSwipeIndex])}
                      >
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Mensagem</span>
                      </Button>
                                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                                        className="gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                        onClick={() => unlockEmpresa(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')}
                      >
                                        <Unlock className="h-4 w-4" />
                                        <span>Desbloquear</span>
                      </Button>
                                    )}
                                    
                      <Button 
                        variant="outline" 
                        size="sm"
                                      className="gap-1"
                                      onClick={() => toggleFavorito(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '')}
                                    >
                                      {favoritos.includes(paginatedEmpresas[currentSwipeIndex].cnpj_basico || '') ? (
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      ) : (
                                        <Star className="h-4 w-4" />
                                      )}
                                      <span>Favorito</span>
                      </Button>
                                  </div>
                                </CardContent>
                              </>
                            )}
                          </Card>
                        </div>
                        
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                          <div className="flex space-x-1">
                            {paginatedEmpresas.map((_, index) => (
                              <div 
                                key={index} 
                                className={`h-2 w-2 rounded-full ${
                                  index === currentSwipeIndex ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Indicador de carregamento para scroll infinito */}
                  {isLoadingMore && (
                    <div className="flex justify-center py-4">
                      <div className="loading-circle border-gray-300 border-t-blue-600"></div>
                    </div>
                  )}
                  
                  {/* Mostrar botão "Carregar mais" se houver mais resultados para carregar */}
                  {!isLoadingMore && filteredEmpresas && paginatedEmpresas.length < filteredEmpresas.length && (
                    <div className="flex justify-center py-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 border-blue-200"
                        onClick={loadMoreEmpresas}
                      >
                        Carregar mais ({paginatedEmpresas.length} de {filteredEmpresas.length})
                      </Button>
                    </div>
                  )}
                  
                  {/* Mostrar total de resultados quando todos estiverem carregados */}
                  {filteredEmpresas && paginatedEmpresas.length === filteredEmpresas.length && filteredEmpresas.length > 0 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      Mostrando {filteredEmpresas.length} resultados
                  </div>
                  )}
                  
                  {/* Botões de navegação */}
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/campaigns")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleNextTab}
                      disabled={selectedEmpresas.length === 0}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="message" className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Mensagem da Campanha</h3>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => setShowTemplates(true)}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Templates</span>
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="gap-1"
                          onClick={() => {
                            // Simular geração de sugestão de IA
                            const suggestions = [
                              "Olá {nome_empresa}! Estamos oferecendo um desconto especial de 20% em todos os nossos produtos. Aproveite esta oportunidade única!",
                              "Prezado {nome_empresa}, gostaríamos de apresentar nossa nova linha de produtos. Podemos agendar uma demonstração?",
                              "Olá {nome_empresa}! Temos uma oferta exclusiva para você: 30% de desconto em sua primeira compra. Válido até o final do mês."
                            ];
                            setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
                            toast.success("Sugestão de IA gerada com sucesso!");
                          }}
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Sugestão IA</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                    <div className="relative">
                        <Textarea
                          placeholder="Digite sua mensagem aqui. Use {nome_empresa} para personalizar com o nome da empresa."
                          className="min-h-[200px] p-4 text-base"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                          {message.length} caracteres
                        </div>
                      </div>
                      
                      {aiSuggestion && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <Sparkles className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-blue-800 mb-1">Sugestão de IA</h4>
                              <p className="text-sm text-blue-700 mb-2">{aiSuggestion}</p>
                              <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                                  size="sm" 
                                  className="text-blue-600 border-blue-200"
                                  onClick={() => setMessage(aiSuggestion)}
                          >
                                  Usar esta sugestão
                          </Button>
                          <Button 
                                  variant="ghost" 
                            size="sm" 
                                  className="text-gray-500"
                                  onClick={() => setAiSuggestion("")}
                          >
                                  Ignorar
                          </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Variáveis disponíveis</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setMessage(message + "{nome_empresa}")}>
                              {nome_empresa}
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setMessage(message + "{cidade}")}>
                              {cidade}
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setMessage(message + "{segmento}")}>
                              {segmento}
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setMessage(message + "{data_atual}")}>
                              {data_atual}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Dicas para melhorar sua mensagem</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                              <span>Personalize com o nome da empresa para aumentar a taxa de resposta</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                              <span>Mantenha a mensagem concisa e direta</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                              <span>Inclua uma chamada para ação clara</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pré-visualização</h3>
                    
                    <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                          W
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">WhatsApp Business</div>
                          <div className="text-xs text-gray-500">Agora</div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-sm whitespace-pre-wrap">
                          {message || "Sua mensagem aparecerá aqui. Use variáveis como {nome_empresa} para personalizar."}
                        </p>
                      </div>
                        </div>
                      </div>
                      
                      {/* Templates dropdown */}
                      {showTemplates && (
                    <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Templates de Mensagem</DialogTitle>
                          <DialogDescription>
                            Selecione um modelo para começar a personalizar sua mensagem
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Templates Gratuitos</h4>
                            <div className="space-y-2">
                            {messageTemplates.map((template, idx) => (
                                <div 
                                key={idx}
                                  className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                                  onClick={() => {
                                    setMessage(template.content);
                                    setShowTemplates(false);
                                  }}
                              >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm">{template.name}</span>
                                  <Badge variant="outline" className="text-xs">Gratuito</Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.content}</p>
                                </div>
                              ))}
                              </div>
                            </div>
                            
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Templates PRO</h4>
                            <div className="space-y-2">
                            {proTemplates.map((template, idx) => (
                              <div 
                                key={`pro-${idx}`}
                                  className="p-3 border border-gray-200 rounded-md bg-gray-50"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm text-gray-400">{template.name}</span>
                                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-xs">PRO</Badge>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{template.content}</p>
                                <div className="mt-2 flex justify-end">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => {
                                        setUpgradeBannerType('templates');
                                        setShowUpgradeBanner(true);
                                        setShowTemplates(false);
                                      }} 
                                      className="text-xs h-7"
                                    >
                                    Desbloquear
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowTemplates(false)}>Fechar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {/* Botões de navegação */}
                  <div className="flex justify-between mt-6">
                              <Button 
                                variant="outline" 
                      onClick={() => setActiveTab("leads")}
                              >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                              </Button>
                              <Button 
                      onClick={handleNextTab}
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="review" className="space-y-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Detalhes da Campanha</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Nome da Campanha</dt>
                              <dd className="mt-1 text-sm">{campaignName || "Não definido"}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Total de Empresas</dt>
                              <dd className="mt-1 text-sm flex items-center">
                                <Users size={14} className="mr-2" />
                                {selectedEmpresas.length} empresas selecionadas
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Modo de Envio</dt>
                              <dd className="mt-1 text-sm flex items-center">
                                <Zap size={14} className="mr-2" />
                                Simulado (para testes)
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Prévia da Mensagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-sm whitespace-pre-line">{message}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            * Esta é uma prévia. As variáveis serão substituídas pelos dados das empresas no envio.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Nova seção de análise de desempenho */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-blue-600" />
                          Análise de Desempenho
                        </CardTitle>
                        <CardDescription>
                          Previsões baseadas em dados históricos e padrões de engajamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-blue-800">Taxa de Entrega</h4>
                              <div className="bg-blue-100 p-1 rounded">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-blue-700">98%</span>
                              <span className="ml-1 text-xs text-blue-600">estimada</span>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              {selectedEmpresas.length} mensagens serão entregues
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-green-800">Taxa de Resposta</h4>
                              <div className="bg-green-100 p-1 rounded">
                                <MessageSquare className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-green-700">23%</span>
                              <span className="ml-1 text-xs text-green-600">estimada</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              ~{Math.round(selectedEmpresas.length * 0.23)} respostas esperadas
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-purple-800">Tempo Médio</h4>
                              <div className="bg-purple-100 p-1 rounded">
                                <Clock className="h-4 w-4 text-purple-600" />
                              </div>
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-purple-700">2.5h</span>
                              <span className="ml-1 text-xs text-purple-600">para resposta</span>
                            </div>
                            <p className="text-xs text-purple-600 mt-1">
                              Melhor horário: 14h às 17h
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-amber-800">Score de Engajamento</h4>
                              <div className="bg-amber-100 p-1 rounded">
                                <Flame className="h-4 w-4 text-amber-600" />
                              </div>
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-amber-700">7.8</span>
                              <span className="ml-1 text-xs text-amber-600">/10</span>
                            </div>
                            <p className="text-xs text-amber-600 mt-1">
                              {message.length > 100 ? "Mensagem bem estruturada" : "Considere adicionar mais detalhes"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <h4 className="text-sm font-medium">Sugestões para melhorar o desempenho</h4>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                              <span>Personalize a mensagem com o nome da empresa para aumentar a taxa de resposta em até 40%</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                              <span>Envie em horário comercial (9h às 17h) para melhor engajamento</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                              <span>No plano PRO, você pode agendar o envio para o melhor momento</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Nova seção de agendamento */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Agendamento de Envio
                        </CardTitle>
                        <CardDescription>
                          Escolha quando enviar sua campanha para maximizar o engajamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="schedule-enabled" 
                                checked={scheduleEnabled} 
                                onCheckedChange={setScheduleEnabled}
                                disabled={!isSchedulingAvailable()}
                              />
                              <Label htmlFor="schedule-enabled" className="text-sm font-medium">
                                Agendar envio
                              </Label>
                            </div>
                            
                            {!isSchedulingAvailable() && (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-200 bg-amber-50">
                                <Lock className="h-3 w-3 mr-1" />
                                Disponível no plano PRO
                              </Badge>
                            )}
                          </div>
                          
                          {scheduleEnabled && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm">Tipo de Agendamento</Label>
                                  <Select 
                                    value={scheduleType} 
                                    onValueChange={(value) => setScheduleType(value as "immediate" | "scheduled" | "recurring")}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="immediate">Envio Imediato</SelectItem>
                                      <SelectItem value="scheduled">Agendamento Único</SelectItem>
                                      <SelectItem value="recurring">Agendamento Recorrente</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {scheduleType === "scheduled" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Data de Envio</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                          >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {scheduleDate ? formatScheduleDate(scheduleDate) : "Selecione uma data"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={scheduleDate}
                                            onSelect={(date: Date | undefined) => setScheduleDate(date)}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-sm">Horário de Envio</Label>
                                      <Select 
                                        value={scheduleTime} 
                                        onValueChange={setScheduleTime}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o horário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="09:00">09:00 - Início do dia</SelectItem>
                                          <SelectItem value="12:00">12:00 - Meio-dia</SelectItem>
                                          <SelectItem value="15:00">15:00 - Tarde</SelectItem>
                                          <SelectItem value="17:00">17:00 - Final do dia</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                )}
                                
                                {scheduleType === "recurring" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Frequência</Label>
                                      <Select 
                                        value={recurringType} 
                                        onValueChange={(value) => setRecurringType(value as "daily" | "weekly" | "monthly")}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione a frequência" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="daily">Diário</SelectItem>
                                          <SelectItem value="weekly">Semanal</SelectItem>
                                          <SelectItem value="monthly">Mensal</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-sm">Horário de Envio</Label>
                                      <Select 
                                        value={scheduleTime} 
                                        onValueChange={setScheduleTime}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o horário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="09:00">09:00 - Início do dia</SelectItem>
                                          <SelectItem value="12:00">12:00 - Meio-dia</SelectItem>
                                          <SelectItem value="15:00">15:00 - Tarde</SelectItem>
                                          <SelectItem value="17:00">17:00 - Final do dia</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-sm">Data Final (opcional)</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                          >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {recurringEndDate ? formatScheduleDate(recurringEndDate) : "Sem data final"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={recurringEndDate}
                                            onSelect={(date: Date | undefined) => setRecurringEndDate(date)}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="flex items-start">
                                  <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-blue-800">
                                      {scheduleType === "immediate" ? 
                                        "Sua campanha será enviada imediatamente após a criação." : 
                                        scheduleType === "scheduled" ? 
                                        `Sua campanha será enviada em ${formatScheduleDate(scheduleDate)} às ${scheduleTime}.` : 
                                        `Sua campanha será enviada ${recurringType === "daily" ? "diariamente" : recurringType === "weekly" ? "semanalmente" : "mensalmente"} às ${scheduleTime}${recurringEndDate ? ` até ${formatScheduleDate(recurringEndDate)}` : "."}`
                                      }
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      Recomendamos enviar em horário comercial (9h às 17h) para melhor engajamento.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {!scheduleEnabled && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Envio Imediato</h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Sua campanha será enviada assim que você clicar em "Criar e Iniciar Campanha".
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Resumo das Empresas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">
                          <span className="font-medium">{selectedEmpresas.length}</span> empresas selecionadas
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md max-h-40 overflow-y-auto">
                          <ul className="text-sm space-y-1">
                            {isEmpresasLoading ? (
                              <p>Carregando...</p>
                            ) : (
                              empresas?.filter(empresa => selectedEmpresas.includes(empresa.cnpj_basico || ''))
                                .map(empresa => (
                                  <li key={empresa.cnpj_basico} className="flex items-center">
                                    <Check size={12} className="text-green-500 mr-2" />
                                    {empresa.nome_fantasia || empresa.razao_social} - {empresa.telefone_1}
                                  </li>
                                ))
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={handlePrevTab}>
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleCreateAndStartCampaign} 
                      disabled={isStartingCampaign || !campaignName.trim() || !message.trim() || selectedEmpresas.length === 0}
                      className="gap-2 btn-ripple relative overflow-hidden"
                    >
                      {isStartingCampaign ? (
                        <div className="loading-circle"></div>
                      ) : (
                        <Send size={16} />
                      )}
                      <span>
                        {isStartingCampaign ? "Criando campanha..." : 
                         scheduleEnabled && scheduleType !== "immediate" ? 
                         "Criar e Agendar Campanha" : 
                         "Criar e Iniciar Campanha"}
                      </span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Dialog open={!!chatEmpresa} onOpenChange={(open) => { if (!open) setChatEmpresa(null); }}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden">
              <div className="flex flex-col h-[500px]">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white flex items-center gap-3">
                  <div className="bg-white/30 w-10 h-10 rounded-full flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{chatEmpresa?.nome_fantasia || chatEmpresa?.razao_social}</h3>
                    <div className="text-xs text-white/80 flex items-center">
                      <span>{chatEmpresa?.telefone_1}</span>
                      {chatEmpresa && chatMensagens[chatEmpresa.cnpj_basico || ''] && (
                        <span className="ml-2 flex items-center gap-1">
                          • <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> online</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setChatEmpresa(null)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div 
                  className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z" fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")' }}
                >
                  {(chatEmpresa && (!chatMensagens[chatEmpresa.cnpj_basico || ''] || chatMensagens[chatEmpresa.cnpj_basico || ''].length === 0)) && (
                    <div className="bg-white rounded-lg p-3 shadow-sm mx-auto max-w-xs text-center text-sm text-gray-600">
                      <p>Olá! Este é o início da sua conversa com <span className="font-medium">{chatEmpresa?.nome_fantasia || chatEmpresa?.razao_social}</span>.</p>
                      <p className="mt-2 text-xs text-gray-500">As mensagens são simuladas e não serão enviadas no plano gratuito.</p>
                    </div>
                  )}
                  
                  {(chatEmpresa && chatMensagens[chatEmpresa.cnpj_basico || '']) && 
                    chatMensagens[chatEmpresa.cnpj_basico || ''].map((msg, idx) => (
                      <div key={idx} className="flex justify-end">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 max-w-[80%] shadow-sm relative message-bubble-right">
                          <p className="text-sm">{msg}</p>
                          <span className="text-[10px] text-white/80 block text-right mt-1 flex items-center justify-end gap-1">
                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            <Check className="h-3 w-3 inline" />
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                <div className="p-3 bg-white border-t">
                  {mensagensEnviadas >= 10 ? (
                    <div className="bg-yellow-50 text-yellow-800 rounded-lg p-3 text-center text-sm">
                      <p>Limite de 10 mensagens atingido no plano gratuito.</p>
                      <Button 
                        className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full gap-2"
                        size="sm"
                        onClick={() => navigate('/pricing')}
                      >
                        <Zap className="h-4 w-4" />
                        <span>Fazer upgrade para plano PRO</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          maxLength={300}
                          className="pr-10"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Smile className="h-5 w-5" />
                        </div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full h-10 w-10 p-0 flex items-center justify-center btn-ripple"
                        onClick={handleEnviarMensagem}
                        disabled={!chatInput.trim()}
                      >
                        {chatInput.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-2">
                    <Zap className="h-3 w-3" />
                    <span>WhatsApp Lead Pilot • Modo Simulação</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
      <BottomMenu />
      
      {/* Banner de upgrade melhorado */}
      <Dialog open={showUpgradeBanner} onOpenChange={setShowUpgradeBanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              {upgradeBannerType === 'credits' ? 'Créditos Esgotados' : 
               upgradeBannerType === 'templates' ? 'Template Premium' : 
               upgradeBannerType === 'leads' ? 'Limite de Leads Atingido' : 
               'Limite de Mensagens Atingido'}
            </DialogTitle>
            <DialogDescription>
              {upgradeBannerType === 'credits' ? 'Você não tem mais créditos disponíveis para desbloquear leads.' : 
               upgradeBannerType === 'templates' ? 'Este template premium está disponível apenas para usuários do plano PRO.' : 
               upgradeBannerType === 'leads' ? 'Você atingiu o limite de 5 leads no plano gratuito.' : 
               'Você atingiu o limite de 10 mensagens por lead no plano gratuito.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Plano Pro</h3>
                  <p className="text-sm text-gray-600">
                    {upgradeBannerType === 'credits' ? 'Créditos ilimitados para desbloquear leads' : 
                     upgradeBannerType === 'templates' ? 'Acesso a todos os templates premium' : 
                     upgradeBannerType === 'leads' ? 'Selecione leads ilimitados para suas campanhas' : 
                     'Envie mensagens ilimitadas para seus leads'}
                  </p>
            </div>
          </div>
        </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Leads ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Templates premium</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Mensagens ilimitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Relatórios avançados</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowUpgradeBanner(false)}>
              Continuar com plano gratuito
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Fazer Upgrade Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de conquista */}
      <Dialog open={showAchievement} onOpenChange={setShowAchievement}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Conquista Desbloqueada!
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-full mb-4">
              {achievementType === 'first_campaign' ? (
                <Rocket className="h-12 w-12 text-yellow-500" />
              ) : achievementType === 'five_leads' ? (
                <Users className="h-12 w-12 text-yellow-500" />
              ) : achievementType === 'ten_leads' ? (
                <Award className="h-12 w-12 text-yellow-500" />
              ) : (
                <Gift className="h-12 w-12 text-yellow-500" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">
              {achievementType === 'first_campaign' ? 'Primeiro Lead Desbloqueado!' : 
               achievementType === 'five_leads' ? '5 Leads Selecionados!' : 
               achievementType === 'ten_leads' ? '10 Leads Selecionados!' : 
               'Template Premium Aplicado!'}
            </h3>
            
            <p className="text-center text-gray-600 mb-4">
              {achievementType === 'first_campaign' ? 'Você desbloqueou seu primeiro lead. Continue desbloqueando mais leads para criar campanhas poderosas!' : 
               achievementType === 'five_leads' ? 'Você selecionou 5 leads para sua campanha. No plano PRO você pode selecionar leads ilimitados!' : 
               achievementType === 'ten_leads' ? 'Incrível! Você selecionou 10 leads para sua campanha. Você está no caminho certo!' : 
               'Você aplicou um template premium. No plano PRO você tem acesso a todos os templates!'}
            </p>
            
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewCampaign;
