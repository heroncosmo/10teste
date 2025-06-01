
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Calendar, TrendingUp, Eye } from 'lucide-react';
import { Lead } from '@/types/database';

export const LeadInsights = () => {
  // Mock data - this would come from your database
  const newLeadsToday: Lead[] = [
    {
      id: '1',
      user_id: 'user1',
      cnpj: '12.345.678/0001-90',
      company_name: 'Restaurante Sabor Mineiro',
      phone: '+5511999887766',
      email: 'contato@sabormineiro.com.br',
      city: 'São Paulo',
      state: 'SP',
      cnae_code: '5611-2',
      cnae_description: 'Restaurantes e similares',
      opening_date: '2024-01-15T00:00:00Z',
      capital_social: 150000,
      company_status: 'active',
      has_whatsapp: true,
      status: 'new',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      user_id: 'user1',
      cnpj: '98.765.432/0001-01',
      company_name: 'Clínica Veterinária Pet Care',
      phone: '+5511888776655',
      email: 'contato@petcare.vet.br',
      city: 'Rio de Janeiro',
      state: 'RJ',
      cnae_code: '7500-1',
      cnae_description: 'Atividades veterinárias',
      opening_date: '2024-01-14T00:00:00Z',
      capital_social: 80000,
      company_status: 'active',
      has_whatsapp: true,
      status: 'new',
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z'
    }
  ];

  const insights = [
    {
      title: 'Leads Disponíveis Hoje',
      value: '3.218',
      change: '+124 novos',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Segmento em Alta',
      value: 'Restaurantes',
      change: '+18% esta semana',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Região com Mais Oportunidades',
      value: 'São Paulo - SP',
      change: '847 novos leads',
      icon: MapPin,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-primary/10`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{insight.title}</p>
                  <p className="text-lg font-bold truncate">{insight.value}</p>
                  <p className="text-xs text-green-600">{insight.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Leads Today */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Novos Leads Hoje</CardTitle>
            <Badge variant="secondary">{newLeadsToday.length} leads</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {newLeadsToday.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{lead.company_name}</h4>
                  {lead.has_whatsapp && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      WhatsApp ✓
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {lead.cnae_description || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {lead.city || 'N/A'}
                  </span>
                  {lead.opening_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Aberta há {Math.floor((new Date().getTime() - new Date(lead.opening_date).getTime()) / (1000 * 60 * 60 * 24))} dias
                    </span>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalhes
              </Button>
            </div>
          ))}
          
          <div className="pt-2">
            <Button variant="outline" className="w-full">
              Ver Todos os Leads Disponíveis ({newLeadsToday.length + 3216} total)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
