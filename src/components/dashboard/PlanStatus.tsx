import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

// Simulando dados do usuário e limites do plano
const planLimits = {
  leads: { used: 47, total: 100, percentage: 47 },
  messages: { used: 8, total: 10, percentage: 80 },
  campaigns: { used: 2, total: 3, percentage: 67 }
};

export function PlanStatus() {
  const { user, profile } = useAuth();
  const planName = "Gratuito"; // Pode ser obtido do perfil do usuário depois

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Plano {planName}</span>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-1 text-xs">
          Upgrade
        </Button>
      </div>
      
      <div className="space-y-3">
        {Object.entries(planLimits).map(([key, limit]) => (
          <div key={key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="capitalize text-gray-600">
                {key === 'leads' ? 'Leads' : key === 'messages' ? 'Mensagens' : 'Campanhas'}
              </span>
              <span className={`font-medium ${limit.percentage > 80 ? 'text-red-600' : 'text-gray-600'}`}>
                {limit.used} / {limit.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  limit.percentage > 80 ? 'bg-red-500' : 
                  limit.percentage > 60 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${limit.percentage}%` }}
              />
            </div>
            {limit.percentage > 80 && (
              <div className="flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600">Limite quase atingido!</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-3 p-2 bg-white rounded border border-blue-200">
        <p className="text-xs text-gray-600 mb-1">🚀 Desbloqueie recursos PRO:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Leads ilimitados</li>
          <li>• 10.000 mensagens/mês</li>
          <li>• IA para automação</li>
          <li>• Relatórios avançados</li>
        </ul>
      </div>
    </div>
  );
} 