
import { useUserPlan } from '@/hooks/useUserPlan';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const UsageSummary = () => {
  const { userPlan, isLoading } = useUserPlan();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!userPlan) {
    return null;
  }
  
  // Simulated values - replace with real data
  const leadsUsed = 850;
  const messagesUsed = 650;
  const campaignsActive = 2;
  
  const leadsPercentage = Math.min(100, (leadsUsed / (userPlan.plan.leads_limit || 100)) * 100);
  const messagesPercentage = Math.min(100, (messagesUsed / (userPlan.plan.messages_limit || 100)) * 100);
  const campaignsPercentage = Math.min(100, (campaignsActive / (userPlan.plan.campaigns_limit || 1)) * 100);
  
  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return 'bg-destructive';
    if (percentage > 75) return 'bg-amber-500';
    return '';
  };

  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Uso do Plano</h3>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {userPlan.plan.name}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Leads</span>
              </div>
              <span className="text-sm">{leadsUsed} / {userPlan.plan.leads_limit}</span>
            </div>
            <Progress 
              value={leadsPercentage} 
              className={`h-2 ${getProgressColor(leadsPercentage)}`} 
            />
            {leadsPercentage > 80 && (
              <p className="mt-1 text-xs text-amber-600">
                {leadsPercentage >= 100 
                  ? 'Limite atingido. Faça upgrade para mais leads.' 
                  : `Restam apenas ${userPlan.plan.leads_limit - leadsUsed} leads.`
                }
              </p>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Mensagens</span>
              </div>
              <span className="text-sm">{messagesUsed} / {userPlan.plan.messages_limit}</span>
            </div>
            <Progress 
              value={messagesPercentage} 
              className={`h-2 ${getProgressColor(messagesPercentage)}`} 
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Campanhas</span>
              </div>
              <span className="text-sm">{campaignsActive} / {userPlan.plan.campaigns_limit}</span>
            </div>
            <Progress 
              value={campaignsPercentage} 
              className={`h-2 ${getProgressColor(campaignsPercentage)}`} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/pricing')}
        >
          Fazer Upgrade
        </Button>
      </CardFooter>
    </Card>
  );
};
