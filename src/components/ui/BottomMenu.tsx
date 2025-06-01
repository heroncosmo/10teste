import { Home, MessageSquare, Send, BarChart3, User, Zap, Sparkles, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Simulando contadores de notificações
const unreadCount = {
  dashboard: 5,
  mensagens: 12,
  campaigns: 3,
  relatorios: 0,
  conta: 1
};

export default function BottomMenu() {
  const location = useLocation();
  const [animate, setAnimate] = useState<string | null>(null);

  const menuItems = [
    { icon: <Home size={22} />, label: "Home", path: "/dashboard", badge: unreadCount.dashboard },
    { icon: <MessageSquare size={22} />, label: "Mensagens", path: "/whatsapp-connections", badge: unreadCount.mensagens },
    { icon: <Send size={22} />, label: "Campanhas", path: "/campaigns", badge: unreadCount.campaigns },
    { icon: <BarChart3 size={22} />, label: "Relatórios", path: "/reports", badge: unreadCount.relatorios },
    { icon: <User size={22} />, label: "Perfil", path: "/settings", badge: unreadCount.conta },
  ];

  useEffect(() => {
    // Animar o item ativo quando a rota muda
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => currentPath.startsWith(item.path));
    if (matchingItem) {
      setAnimate(matchingItem.path);
      setTimeout(() => setAnimate(null), 500);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Barra de pesquisa para dispositivos móveis */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 md:hidden py-2 px-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu de navegação inferior para mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden shadow-lg">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full text-xs transition-all duration-300 relative",
                isActive 
                  ? "text-blue-600 font-semibold" 
                  : "text-gray-500 hover:text-gray-700",
                animate === item.path && "scale-110"
              )}
            >
              <div className={cn(
                "relative p-1 rounded-full",
                isActive && "bg-blue-100",
              )}>
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-blue-500 rounded-t-md"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
} 