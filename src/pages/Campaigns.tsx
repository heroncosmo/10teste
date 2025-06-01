import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useAuth } from "@/providers/AuthProvider";
import { Campaign } from "@/types/database";
import { generateSimulatedReport } from "@/services/whatsappService";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  RefreshCcw, 
  Send,
  Play,
  Pause,
  Calendar,
  Clock,
  MoreHorizontal,
  Loader2,
  Zap,
  Eye,
  BarChart3,
  Star,
  StarOff,
  Heart,
  Share,
  MessageCircle,
  Bookmark,
  MapPin,
  Phone,
  Building,
  FileText,
  ChevronDown,
  Flame,
  X,
  Smile,
  Mic,
  Sparkles,
  Lock,
  Unlock,
  Crown,
  ChevronRight,
  ChevronLeft,
  Check,
  Users
} from "lucide-react";
import { toast } from "sonner";
import BottomMenu from "@/components/ui/BottomMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import "../components/ui/animations.css";

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [filterType, setFilterType] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [likedCampaigns, setLikedCampaigns] = useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [creditsAvailable, setCreditsAvailable] = useState(10);
  const [unlockedCampaigns, setUnlockedCampaigns] = useState<string[]>([]);
  const [showActionBar, setShowActionBar] = useState(false);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    data: campaigns,
    isLoading,
    fetchData: fetchCampaigns
  } = useSupabaseData<Campaign>('campaigns', { 
    fetchOnMount: true,
    queryFilter: (query) => query.eq('user_id', user?.id || '')
  });

  // Função para carregar mais campanhas (para scroll infinito)
  const loadMoreCampaigns = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
    
    // Simular um pequeno delay para mostrar o indicador de carregamento
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 500);
  };

  // Função para detectar quando o usuário chegou ao final da lista
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreCampaigns();
    }
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
    
    if (isLeftSwipe && currentSwipeIndex < filteredCampaigns.length - 1) {
      setCurrentSwipeIndex(prev => prev + 1);
    } else if (isRightSwipe && currentSwipeIndex > 0) {
      setCurrentSwipeIndex(prev => prev - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Função para filtrar campanhas
  const filterCampaigns = (campaigns: Campaign[] | undefined) => {
    if (!campaigns) return [];
    
    let filtered = campaigns.filter(campaign => 
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

    if (activeTab !== "all") {
      filtered = filtered.filter(campaign => campaign.status === activeTab);
    }
    
    if (filterType !== "all") {
      switch (filterType) {
        case "favoritos":
          filtered = filtered.filter(campaign => favoritos.includes(campaign.id || ""));
          break;
        case "hot":
          filtered = filtered.filter(campaign => getEngagementScore(campaign.id || "") >= 70);
          break;
        case "warm":
          filtered = filtered.filter(campaign => {
            const score = getEngagementScore(campaign.id || "");
            return score >= 40 && score < 70;
          });
          break;
        case "cold":
          filtered = filtered.filter(campaign => getEngagementScore(campaign.id || "") < 40);
          break;
      }
    }
    
    return sortCampaigns(filtered);
  };

  // Função para ordenar campanhas
  const sortCampaigns = (campaigns: Campaign[]) => {
    return [...campaigns].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "engajamento":
          return getEngagementScore(b.id || "") - getEngagementScore(a.id || "");
        case "recent":
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
  };

  // Função para calcular score de engajamento
  const getEngagementScore = (id: string) => {
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return (hash % 100) + 1;
  };
  
  // Função para determinar a temperatura do lead
  const getLeadTemperature = (score: number) => {
    if (score >= 70) return { label: "Hot Lead", color: "text-red-500", bg: "bg-red-50", icon: <Flame className="h-4 w-4 text-red-500" /> };
    if (score >= 40) return { label: "Warm Lead", color: "text-orange-500", bg: "bg-orange-50", icon: <Flame className="h-4 w-4 text-orange-500" /> };
    return { label: "Cold Lead", color: "text-blue-500", bg: "bg-blue-50", icon: <BarChart3 className="h-4 w-4 text-blue-500" /> };
  };

  // Função para obter badge para campanha
  const getBadgeForCampaign = (id: string) => {
    const score = getEngagementScore(id);
    if (score >= 80) return { label: "Premium", color: "bg-purple-100 text-purple-800", icon: <Crown className="h-3 w-3" /> };
    if (score >= 60) return { label: "Qualificado", color: "bg-green-100 text-green-800", icon: <Check className="h-3 w-3" /> };
    if (score >= 40) return { label: "Potencial", color: "bg-blue-100 text-blue-800", icon: <Sparkles className="h-3 w-3" /> };
    return { label: "Novo", color: "bg-gray-100 text-gray-800", icon: <Plus className="h-3 w-3" /> };
  };

  // Função para desbloquear campanha
  const unlockCampaign = (id: string) => {
    if (creditsAvailable <= 0) {
      setShowUpgradeBanner(true);
      return;
    }
    
    setCreditsAvailable(prev => prev - 1);
    setUnlockedCampaigns(prev => [...prev, id]);
    toast.success("Campanha desbloqueada!", {
      description: "Você agora pode ver os detalhes completos desta campanha."
    });
  };

  // Função para verificar se campanha está desbloqueada
  const isCampaignUnlocked = (id: string) => {
    return unlockedCampaigns.includes(id);
  };

  // Função para alternar favorito
  const toggleFavorito = (id: string) => {
    if (favoritos.includes(id)) {
      setFavoritos(prev => prev.filter(item => item !== id));
    } else {
      setFavoritos(prev => [...prev, id]);
    }
  };

  // Função para alternar like
  const toggleLike = (id: string) => {
    if (likedCampaigns.includes(id)) {
      setLikedCampaigns(prev => prev.filter(item => item !== id));
    } else {
      setLikedCampaigns(prev => [...prev, id]);
    }
  };

  // Função para selecionar campanha
  const toggleSelectCampaign = (id: string) => {
    if (selectedCampaigns.includes(id)) {
      setSelectedCampaigns(prev => prev.filter(item => item !== id));
    } else {
      setSelectedCampaigns(prev => [...prev, id]);
    }
  };

  // Função para selecionar todas as campanhas
  const toggleSelectAllCampaigns = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredCampaigns.map(campaign => campaign.id || ""));
    }
  };

  // Função para visualizar relatório
  const handleViewReport = (campaign: Campaign) => {
    const report = generateSimulatedReport(campaign);
    
    // Mostrar relatório em modal ou toast
    const reportText = `
📊 Relatório da Campanha: ${campaign.name}

📱 Número Usado: ${report.simulatedNumber}
📧 Total de Mensagens: ${report.totalMessages}
✅ Mensagens Enviadas: ${report.sentMessages}
📈 Taxa de Sucesso: ${report.successRate}%
💬 Taxa de Resposta: ${report.responseRate}%
⏰ Data/Hora: ${report.timestamp}

⚠️ Este é um relatório simulado para demonstração.
    `;
    
    alert(reportText);
  };

  // Efeito para mostrar/esconder barra de ações
  useEffect(() => {
    setShowActionBar(selectedCampaigns.length > 0);
  }, [selectedCampaigns]);

  // Efeito para adicionar listener de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const filteredCampaigns = filterCampaigns(campaigns);
  const displayedCampaigns = filteredCampaigns.slice(0, (page + 1) * 10);

  // Função para obter classe do badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'paused':
        return 'Pausada';
      case 'draft':
        return 'Rascunho';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto" ref={containerRef}>
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft size={20} />
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Campanhas</h1>
              <Badge variant="secondary" className="ml-4 gap-2">
                <Zap size={14} />
                Modo Simulado
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchCampaigns()}>
                <RefreshCcw size={16} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button asChild className="gap-2">
                <Link to="/campaigns/new">
                  <Plus size={16} />
                  <span className="hidden sm:inline">Nova Campanha</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Card className="mb-6">
            <CardHeader className="pb-0">
              <CardTitle>Gerenciamento de Campanhas</CardTitle>
              <CardDescription>
                Crie e gerencie suas campanhas de mensagens. Todas as campanhas são executadas em modo simulado para demonstração.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    placeholder="Buscar por nome da campanha..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
                  <Filter size={16} />
                  <span>Filtros</span>
                </Button>
              </div>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Ordenar por</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={sortBy === "recent" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSortBy("recent")}
                        >
                          Mais recentes
                        </Button>
                        <Button 
                          variant={sortBy === "name" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSortBy("name")}
                        >
                          Nome
                        </Button>
                        <Button 
                          variant={sortBy === "engajamento" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSortBy("engajamento")}
                        >
                          Engajamento
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Filtrar por</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={filterType === "all" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterType("all")}
                        >
                          Todos
                        </Button>
                        <Button 
                          variant={filterType === "favoritos" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterType("favoritos")}
                        >
                          Favoritos
                        </Button>
                        <Button 
                          variant={filterType === "hot" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterType("hot")}
                        >
                          Hot Leads
                        </Button>
                        <Button 
                          variant={filterType === "warm" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterType("warm")}
                        >
                          Warm Leads
                        </Button>
                        <Button 
                          variant={filterType === "cold" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterType("cold")}
                        >
                          Cold Leads
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="paused">Pausadas</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">Carregando campanhas...</p>
                  </div>
              ) : filteredCampaigns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Send className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500 mb-4">Nenhuma campanha encontrada</p>
                    <Button asChild>
                      <Link to="/campaigns/new">
                        Criar Nova Campanha
                      </Link>
                    </Button>
                  </div>
                ) : (
                <>
                  {/* Desktop View - Grid de Cards */}
                  <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {displayedCampaigns.map((campaign) => {
                      const engagementScore = getEngagementScore(campaign.id || "");
                      const temperature = getLeadTemperature(engagementScore);
                      const badge = getBadgeForCampaign(campaign.id || "");
                      const isUnlocked = isCampaignUnlocked(campaign.id || "");
                      
                      return (
                        <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative">
                            <div className="absolute top-3 right-3 z-10 flex space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                                onClick={() => toggleFavorito(campaign.id || "")}
                                  >
                                {favoritos.includes(campaign.id || "") ? (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4 text-gray-400" />
                                )}
                                  </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                                onClick={() => toggleLike(campaign.id || "")}
                              >
                                {likedCampaigns.includes(campaign.id || "") ? (
                                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                ) : (
                                  <Heart className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                            
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
                            
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">{campaign.name}</h3>
                                  <div className="flex items-center mt-1">
                                    <Badge className={getStatusBadgeClass(campaign.status || "")}>
                                      {getStatusLabel(campaign.status || "")}
                                    </Badge>
                                    <Badge variant="outline" className="ml-2 gap-1">
                                      {badge.icon}
                                      {badge.label}
                                    </Badge>
                                  </div>
                                </div>
                                <Checkbox 
                                  checked={selectedCampaigns.includes(campaign.id || "")}
                                  onCheckedChange={() => toggleSelectCampaign(campaign.id || "")}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="mt-3 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{new Date(campaign.created_at || "").toLocaleDateString()}</span>
                                <span className="mx-2">•</span>
                                <Users className="h-4 w-4 mr-1" />
                                <span>{campaign.total_leads || 0} empresas</span>
                              </div>
                              
                              <div className="mt-3 flex items-center">
                                <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${temperature.bg}`}>
                                  {temperature.icon}
                                  <span className={temperature.color}>{temperature.label}</span>
                                </div>
                                <div className="ml-2 text-xs text-gray-500">
                                  Score: {engagementScore}/100
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-between">
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewReport(campaign)}>
                                  <Eye className="h-4 w-4" />
                                  <span>Ver Relatório</span>
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1" asChild>
                                  <Link to={`/campaigns/${campaign.id}`}>
                                    <ChevronRight className="h-4 w-4" />
                                    <span>Detalhes</span>
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  
                  {/* Mobile View - Swipeable Cards */}
                  <div className="md:hidden">
                    {displayedCampaigns.length > 0 && (
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
                          
                          {currentSwipeIndex < displayedCampaigns.length - 1 && (
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
                            {displayedCampaigns[currentSwipeIndex] && (
                              <>
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
                                <CardHeader>
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle>{displayedCampaigns[currentSwipeIndex].name}</CardTitle>
                                      <div className="flex items-center mt-1">
                                        <Badge className={getStatusBadgeClass(displayedCampaigns[currentSwipeIndex].status || "")}>
                                          {getStatusLabel(displayedCampaigns[currentSwipeIndex].status || "")}
                                        </Badge>
                                      </div>
                                    </div>
                                    <Checkbox 
                                      checked={selectedCampaigns.includes(displayedCampaigns[currentSwipeIndex].id || "")}
                                      onCheckedChange={() => toggleSelectCampaign(displayedCampaigns[currentSwipeIndex].id || "")}
                                    />
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{new Date(displayedCampaigns[currentSwipeIndex].created_at || "").toLocaleDateString()}</span>
                                    <span className="mx-2">•</span>
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>{displayedCampaigns[currentSwipeIndex].total_leads || 0} empresas</span>
              </div>
                                  
                                  <div className="flex justify-between mt-4">
                                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewReport(displayedCampaigns[currentSwipeIndex])}>
                                      <Eye className="h-4 w-4" />
                                      <span>Relatório</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-1" asChild>
                                      <Link to={`/campaigns/${displayedCampaigns[currentSwipeIndex].id}`}>
                                        <ChevronRight className="h-4 w-4" />
                                        <span>Detalhes</span>
                                      </Link>
                                    </Button>
                                  </div>
                                </CardContent>
                              </>
                            )}
                          </Card>
              </div>
                        
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                          <div className="flex space-x-1">
                            {displayedCampaigns.map((_, index) => (
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
                    <div className="flex justify-center my-4">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Barra de ações flutuante para seleção múltipla */}
        {showActionBar && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center space-x-2 z-50">
            <span className="text-sm font-medium text-gray-700">{selectedCampaigns.length} selecionados</span>
            <Button variant="outline" size="sm" className="gap-1">
              <Play className="h-4 w-4" />
              <span>Iniciar</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Pause className="h-4 w-4" />
              <span>Pausar</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-red-500">
              <X className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        )}
        
        {/* Banner de upgrade */}
        {showUpgradeBanner && (
          <Dialog open={showUpgradeBanner} onOpenChange={setShowUpgradeBanner}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créditos esgotados</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600 mb-4">
                  Você não tem mais créditos disponíveis para desbloquear campanhas. Faça upgrade para o plano Pro e obtenha créditos ilimitados!
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Plano Pro</h3>
                      <p className="text-sm text-gray-600">Créditos ilimitados e recursos avançados</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUpgradeBanner(false)}>
                  Fechar
                </Button>
                <Button asChild>
                  <Link to="/pricing">
                    Fazer Upgrade
                  </Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Menu inferior para mobile */}
      <BottomMenu />
    </div>
  );
};

export default Campaigns;
