import { Plus, MessageSquare, Target, Mail, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { icon: <Plus size={16} />, label: "Nova Campanha", action: "/campaigns/new", color: "bg-blue-500" },
  { icon: <MessageSquare size={16} />, label: "Mensagem", action: "/mensagens", color: "bg-green-500" },
  { icon: <Target size={16} />, label: "Prospectar", action: "/prospection", color: "bg-purple-500" },
  { icon: <Mail size={16} />, label: "Email", action: "/email", color: "bg-orange-500" }
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.action)}
            className="flex items-center justify-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center text-white`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Destaque para plano PRO */}
      <div className="mt-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white mr-3">
            <Zap size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Acelere seus resultados!</p>
            <p className="text-xs text-gray-600">Acesso a IA para automação com o plano PRO.</p>
          </div>
          <button 
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full"
            onClick={() => navigate('/pricing')}
          >
            Saiba mais
          </button>
        </div>
      </div>
    </div>
  );
}
