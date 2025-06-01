
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  sent_count: number;
  total_leads: number;
  success_count: number;
  failed_count: number;
}

export const CampaignStatus = () => {
  // Mock data - this would come from your database
  const activeCampaign: Campaign = {
    id: '1',
    name: 'Campanha Restaurantes - Dezembro',
    status: 'active',
    sent_count: 847,
    total_leads: 1200,
    success_count: 823,
    failed_count: 24
  };

  const progressPercentage = (activeCampaign.sent_count / activeCampaign.total_leads) * 100;

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return 'Rascunho';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Campanha Ativa</CardTitle>
          <Badge variant="secondary" className={`text-white ${getStatusColor(activeCampaign.status)}`}>
            {getStatusText(activeCampaign.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{activeCampaign.name}</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{activeCampaign.sent_count}/{activeCampaign.total_leads} enviadas</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% concluído
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sucessos:</span>
              <span className="text-green-600 font-medium">{activeCampaign.success_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Falhas:</span>
              <span className="text-red-600 font-medium">{activeCampaign.failed_count}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa de sucesso:</span>
              <span className="font-medium">
                {Math.round((activeCampaign.success_count / activeCampaign.sent_count) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tempo restante:</span>
              <span className="font-medium">~12 min</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Pause className="h-4 w-4 mr-1" />
            Pausar
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reenviar Falhas
          </Button>
        </div>

        {activeCampaign.failed_count > 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md text-sm text-amber-700">
            <AlertCircle className="h-4 w-4" />
            <span>{activeCampaign.failed_count} mensagens falharam - verifique a conexão</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
