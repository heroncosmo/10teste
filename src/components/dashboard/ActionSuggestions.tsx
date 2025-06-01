
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LightbulbIcon, Users, PieChart, Clock, Zap, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Suggestion = {
  icon: React.ReactNode;
  title: string;
  action: string;
  badge: string;
  badgeColor: string;
  description: string;
  to: string;
};

export const ActionSuggestions = () => {
  const navigate = useNavigate();
  
  const suggestions: Suggestion[] = [
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Oportunidade de Restaurantes",
      action: "Ver Leads",
      badge: "246 novos leads",
      badgeColor: "bg-blue-100 text-blue-800",
      description: "Detectamos 246 novos restaurantes abertos nos últimos 30 dias com WhatsApp válido.",
      to: "/prospection?segment=restaurants"
    },
    {
      icon: <PieChart className="h-5 w-5 text-purple-600" />,
      title: "Melhor Segmento da Semana",
      action: "Ver Relatório",
      badge: "Taxa de 12.3%",
      badgeColor: "bg-purple-100 text-purple-800",
      description: "Clínicas e consultórios médicos tiveram a maior taxa de resposta esta semana.",
      to: "/reports"
    },
    {
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      title: "Horário Ideal de Envio",
      action: "Agendar",
      badge: "14:00 - 15:30",
      badgeColor: "bg-amber-100 text-amber-800",
      description: "Este é o melhor horário para envio de mensagens para o seu público-alvo.",
      to: "/campaigns/new"
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-green-600" />,
      title: "Otimize suas Mensagens",
      action: "Ver Sugestões",
      badge: "Aumentar engajamento",
      badgeColor: "bg-green-100 text-green-800",
      description: "Adicione mais variações nas suas mensagens para aumentar a taxa de resposta.",
      to: "/messages/library"
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <LightbulbIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-medium">Sugestões Inteligentes</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="border border-muted rounded-lg p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-1">{suggestion.icon}</div>
                  <div>
                    <h4 className="font-medium mb-1">{suggestion.title}</h4>
                    <Badge className={`${suggestion.badgeColor} mb-2`}>
                      {suggestion.badge}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(suggestion.to)}
              >
                {suggestion.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
