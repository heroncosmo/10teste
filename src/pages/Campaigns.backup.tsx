
import { useState } from "react";
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
  BarChart3
} from "lucide-react";

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  
  const { 
    data: campaigns,
    isLoading,
    fetchData: fetchCampaigns
  } = useSupabaseData<Campaign>('campaigns', { 
    fetchOnMount: true,
    queryFilter: (query) => query.eq('user_id', user?.id || '')
  });

  const filteredCampaigns = campaigns?.filter(campaign => 
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
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
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  <span>Filtros</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="paused">Pausadas</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="bg-white rounded-md border">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">Carregando campanhas...</p>
                  </div>
                ) : filteredCampaigns?.length === 0 ? (
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
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Nome</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Criada em</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Empresas</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Enviadas</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCampaigns?.map((campaign) => (
                          <tr key={campaign.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{campaign.name}</td>
                            <td className="py-3 px-4 text-gray-500">
                              {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('pt-BR') : "N/A"}
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {campaign.total_leads || 0}
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {campaign.sent_count || 0}
                              {campaign.success_count && campaign.sent_count ? (
                                <span className="ml-2 text-green-600">
                                  ({Math.round((campaign.success_count / campaign.sent_count) * 100)}% sucesso)
                                </span>
                              ) : null}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                                {getStatusLabel(campaign.status)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                {campaign.status === 'completed' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8" 
                                    title="Ver Relatório"
                                    onClick={() => handleViewReport(campaign)}
                                  >
                                    <BarChart3 size={16} />
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver Detalhes">
                                  <Eye size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                Sem campanhas ativas para exibir
              </div>
            </TabsContent>
            
            <TabsContent value="paused" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                Sem campanhas pausadas para exibir
              </div>
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                Sem rascunhos para exibir
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                {filteredCampaigns?.filter(c => c.status === 'completed').length === 0 
                  ? "Sem campanhas concluídas para exibir"
                  : "Use a aba 'Todas' para ver campanhas concluídas"
                }
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Campaigns;
