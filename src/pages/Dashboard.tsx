import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";
import { PlusCircle, RefreshCcw, Bell, Users, TrendingUp, Target, BarChart3, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CampaignStatus } from "@/components/dashboard/CampaignStatus";
import { UsageSummary } from "@/components/dashboard/UsageSummary";
import { LeadInsights } from "@/components/dashboard/LeadInsights";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ActionSuggestions } from "@/components/dashboard/ActionSuggestions";
import BottomMenu from "@/components/ui/BottomMenu";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare } from "lucide-react";
import { PlanStatus } from "@/components/dashboard/PlanStatus";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleRefresh = () => {
    toast.success("Dados atualizados com sucesso");
  };

  const statsData = [
    {
      title: "Total de Leads",
      value: "1,234",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100"
    },
    {
      title: "Taxa de Abertura",
      value: "24.5%",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100"
    },
    {
      title: "Conversões",
      value: "89",
      icon: <Target className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-100"
    },
    {
      title: "ROI",
      value: "340%",
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      bgColor: "bg-orange-100"
    }
  ];

  // Dados simulados para demonstração
  const campaigns = [
    { 
      id: '1', 
      name: 'Campanha Black Friday', 
      status: 'active', 
      stats: { sent: 150, opened: 89, replies: 32 } 
    },
    { 
      id: '2', 
      name: 'Promoção Verão', 
      status: 'paused', 
      stats: { sent: 200, opened: 120, replies: 45 } 
    },
    { 
      id: '3', 
      name: 'Lançamento Produto', 
      status: 'completed', 
      stats: { sent: 500, opened: 350, replies: 125 } 
    }
  ];

  const recentMessages = [
    { 
      id: '1', 
      sender: 'João Silva', 
      content: 'Tenho interesse no produto, pode me dar mais informações?', 
      sent_at: new Date().toISOString() 
    },
    { 
      id: '2', 
      sender: 'Maria Oliveira', 
      content: 'Obrigada pelo contato, vou analisar a proposta e retorno em breve.', 
      sent_at: new Date(Date.now() - 3600000).toISOString() 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 md:block">
            <div className="md:flex md:items-center md:justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 md:inline-flex hidden"
                onClick={handleRefresh}
              >
                <RefreshCcw className="h-4 w-4" />
                <span>Atualizar Dados</span>
              </Button>
              
              <div className="flex items-center gap-4 md:inline-flex hidden">
                <button className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto pb-20 md:pb-6">
            <div className="p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-10 md:mt-0">Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Usuário'}!</h1>
                    <p className="text-gray-600">Gerenciador de campanhas e leads inteligente</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button asChild>
                      <Link to="/campaigns/new" className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Nova Campanha</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {/* Ações Rápidas */}
                <QuickActions />
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                  {statsData.map((stat, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 md:p-4 border border-gray-200 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
                          <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mt-2 md:mt-0`}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Content Cards */}
                  <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    {/* Recent Campaigns */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Campanhas Recentes</h2>
                        <Link to="/campaigns" className="text-xs md:text-sm text-blue-600 hover:text-blue-800">Ver todas</Link>
                      </div>
                      {campaigns?.length === 0 ? (
                        <div className="text-center py-6 md:py-8">
                          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                            <Send className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                          </div>
                          <h3 className="text-sm md:text-base text-gray-500 font-medium mb-2">Nenhuma campanha ainda</h3>
                          <p className="text-xs md:text-sm text-gray-400 mb-4">Crie sua primeira campanha para começar a prospectar leads</p>
                          <Button size="sm" asChild>
                            <Link to="/campaigns/new">Criar Campanha</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 md:space-y-4">
                          {campaigns?.slice(0, 3).map((campaign) => (
                            <div key={campaign.id} className="bg-gray-50 rounded-lg p-3 md:p-4 hover:bg-gray-100 transition-colors">
                              <Link to={`/campaigns/${campaign.id}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="text-sm md:text-base font-medium text-gray-900 truncate pr-2">{campaign.name}</h3>
                                  <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'outline' : 'secondary'}>
                                    {campaign.status === 'active' ? 'Ativa' : 
                                     campaign.status === 'paused' ? 'Pausada' : 
                                     campaign.status === 'completed' ? 'Finalizada' : 
                                     'Rascunho'}
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm text-gray-500">
                                  <div>Enviadas: {campaign.stats?.sent || 0}</div>
                                  <div>Abertas: {campaign.stats?.opened || 0}</div>
                                  <div>Respostas: {campaign.stats?.replies || 0}</div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Recent Messages */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Mensagens Recentes</h2>
                        <Link to="/messages" className="text-sm text-blue-600 hover:text-blue-800">Ver todas</Link>
                      </div>
                      <div className="space-y-3">
                        {recentMessages?.length > 0 ? recentMessages.map((message) => (
                          <div key={message.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-gray-900">{message.sender || 'Lead'}</h4>
                                  <span className="ml-2 text-xs text-gray-500">{new Date(message.sent_at).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{message.content.length > 100 ? message.content.substring(0, 100) + '...' : message.content}</p>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-4 text-gray-500">
                            Nenhuma mensagem recente
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Plan Status */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Status do Plano</h2>
                      <PlanStatus />
                    </div>
                    
                    {/* Tips Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Dica do dia</h3>
                          <p className="text-sm text-gray-700 mt-1">
                            Personalize suas mensagens com o nome do lead para aumentar a taxa de resposta em até 35%!
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full justify-center bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                        Ver mais dicas
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <BottomMenu />
    </div>
  );
};

export default Dashboard;
