
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Send,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

type Stat = {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
};

export const PerformanceMetrics = () => {
  const stats: Stat[] = [
    {
      title: "Total de Leads",
      value: "2,458",
      change: "+12.5%",
      changeType: "positive",
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Mensagens Enviadas",
      value: "1,892",
      change: "+18.2%",
      changeType: "positive",
      icon: <MessageSquare className="h-5 w-5 text-green-600" />
    },
    {
      title: "Taxa de Resposta",
      value: "8.7%",
      change: "-2.3%",
      changeType: "negative",
      icon: <BarChart3 className="h-5 w-5 text-orange-500" />
    },
    {
      title: "Campanhas Ativas",
      value: "2",
      change: "+1",
      changeType: "positive",
      icon: <Send className="h-5 w-5 text-purple-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === "positive" ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : stat.changeType === "negative" ? (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-sm font-medium ${
                stat.changeType === "positive" ? "text-green-500" : 
                stat.changeType === "negative" ? "text-red-500" : 
                "text-gray-500"
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground ml-1">em 30 dias</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
