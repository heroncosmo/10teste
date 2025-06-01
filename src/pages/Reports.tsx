
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import Sidebar from "@/components/dashboard/Sidebar";
import { BarChart3, ArrowLeft, Download, Calendar, RefreshCcw } from "lucide-react";

// Mock data for the charts
const messageData = [
  { day: 'Segunda', sent: 120, responses: 24 },
  { day: 'Terça', sent: 145, responses: 32 },
  { day: 'Quarta', sent: 132, responses: 29 },
  { day: 'Quinta', sent: 156, responses: 34 },
  { day: 'Sexta', sent: 178, responses: 41 },
  { day: 'Sábado', sent: 92, responses: 18 },
  { day: 'Domingo', sent: 76, responses: 12 }
];

const campaignData = [
  { name: 'Black Friday', sent: 520, responses: 84, conversionRate: 16.2 },
  { name: 'Lançamento Premium', sent: 340, responses: 62, conversionRate: 18.2 },
  { name: 'Promoção Julho', sent: 420, responses: 72, conversionRate: 17.1 },
  { name: 'Dia dos Pais', sent: 280, responses: 48, conversionRate: 17.1 },
  { name: 'Fim de Ano', sent: 380, responses: 68, conversionRate: 17.9 }
];

const segmentData = [
  { name: 'Restaurantes', value: 35 },
  { name: 'Clínicas', value: 25 },
  { name: 'Lojas', value: 20 },
  { name: 'Academias', value: 15 },
  { name: 'Outros', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Reports = () => {
  const [dateRange, setDateRange] = useState("last7days");
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <a href="/dashboard">
                  <ArrowLeft size={20} />
                </a>
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Relatórios</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-48">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                    <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                    <SelectItem value="thisMonth">Este mês</SelectItem>
                    <SelectItem value="lastMonth">Mês passado</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCcw size={16} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Envios</p>
                    <p className="text-2xl font-bold mt-1">1,892</p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Respostas</p>
                    <p className="text-2xl font-bold mt-1">342</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Taxa de Resposta</p>
                    <p className="text-2xl font-bold mt-1">18.1%</p>
                  </div>
                  <div className="p-2 rounded-full bg-orange-100">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Campanhas Ativas</p>
                    <p className="text-2xl font-bold mt-1">3</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade de Mensagens</CardTitle>
                  <CardDescription>Volume de mensagens enviadas e respondidas nos últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={messageData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sent" name="Mensagens Enviadas" fill="#3B82F6" />
                        <Bar dataKey="responses" name="Respostas Recebidas" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Campanha</CardTitle>
                    <CardDescription>Taxas de resposta por campanha</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={campaignData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="conversionRate" name="Taxa de Conversão (%)" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Segmento</CardTitle>
                    <CardDescription>Leads distribuídos por segmento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={segmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {segmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho de Campanhas</CardTitle>
                  <CardDescription>Análise detalhada por campanha</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Campanha</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Mensagens Enviadas</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Respostas</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Taxa de Resposta</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaignData.map((campaign, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{campaign.name}</td>
                            <td className="py-3 px-4 text-gray-500">{campaign.sent}</td>
                            <td className="py-3 px-4 text-gray-500">{campaign.responses}</td>
                            <td className="py-3 px-4 text-gray-500">{campaign.conversionRate}%</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                index % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {index % 2 === 0 ? 'Concluída' : 'Em andamento'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de Desempenho</CardTitle>
                  <CardDescription>Comparação entre campanhas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={campaignData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sent" name="Mensagens Enviadas" fill="#3B82F6" />
                        <Bar dataKey="responses" name="Respostas Recebidas" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-6">
              <p className="text-center text-gray-500 py-12">Dados estatísticos de mensagens ainda não disponíveis</p>
            </TabsContent>
            
            <TabsContent value="leads" className="space-y-6">
              <p className="text-center text-gray-500 py-12">Dados estatísticos de leads ainda não disponíveis</p>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;
