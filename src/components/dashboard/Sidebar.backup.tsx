import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  MessageSquare,
  Send,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Users,
  Gauge,
  PlusCircle,
  ShieldCheck,
  Database,
  Crown,
  Server,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, title, path, isCollapsed, isActive, onClick }: SidebarItemProps) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex items-center p-3 mb-1 rounded-md transition-all",
        isActive 
          ? "bg-brandBlue-100 text-brandBlue-700" 
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        {!isCollapsed && <span>{title}</span>}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { 
      icon: <Home size={20} />, 
      title: "Dashboard", 
      path: "/dashboard" 
    },
    { 
      icon: <Search size={20} />, 
      title: "Prospecção", 
      path: "/prospection" 
    },
    { 
      icon: <MessageSquare size={20} />, 
      title: "Conexões WhatsApp", 
      path: "/whatsapp-connections" 
    },
    { 
      icon: <MessageSquare size={20} />, 
      title: "Biblioteca de Mensagens", 
      path: "/messages/library" 
    },
    { 
      icon: <Send size={20} />, 
      title: "Campanhas", 
      path: "/campaigns" 
    },
    { 
      icon: <BarChart3 size={20} />, 
      title: "Relatórios", 
      path: "/reports" 
    },
    { 
      icon: <Users size={20} />, 
      title: "Equipe", 
      path: "/team" 
    },
    { 
      icon: <Settings size={20} />, 
      title: "Configurações", 
      path: "/settings" 
    }
  ];

  const adminMenuItems = profile?.is_admin ? [
    { icon: <ShieldCheck size={20} />, title: "Painel Admin", path: "/admin" },
    { icon: <MessageSquare size={20} />, title: "Admin WhatsApp", path: "/admin/whatsapp" },
    { icon: <Users size={20} />, title: "Usuários", path: "/admin/users" },
    { icon: <Database size={20} />, title: "Banco de Dados", path: "/admin/database" },
    { icon: <Settings size={20} />, title: "Config. Sistema", path: "/admin/settings" }
  ] : [];

  const superAdminMenuItems = profile?.is_superadmin ? [
    { icon: <Crown size={20} />, title: "Super Admin", path: "/superadmin" },
    { icon: <Server size={20} />, title: "Instâncias", path: "/superadmin/instances" },
    { icon: <Users size={20} />, title: "Todos Usuários", path: "/superadmin/users" },
    { icon: <Activity size={20} />, title: "Monitoramento", path: "/superadmin/monitoring" }
  ] : [];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              className="h-6 w-6 text-brandBlue-600 mr-2"
              fill="currentColor"
            >
              <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5zM16.25 13.97c-.19-.1-1.12-.55-1.3-.61c-.17-.06-.3-.09-.42.09c-.12.19-.47.61-.58.74c-.11.13-.21.14-.4.05c-1.07-.54-1.77-.97-2.47-2.2c-.19-.32.19-.3.54-1c.06-.11.03-.21-.02-.3c-.05-.08-.42-1.01-.58-1.38c-.15-.36-.31-.31-.42-.32c-.11 0-.24-.03-.36-.03s-.33.05-.5.24c-.17.19-.64.63-.64 1.53c0 .9.67 1.77.76 1.89c.09.12 1.24 1.97 3.05 2.69c1.13.45 1.57.49 2.13.41c.34-.05 1.12-.46 1.28-.9c.16-.45.16-.83.11-.91c-.05-.08-.19-.14-.38-.24z"/>
            </svg>
            <span className="font-semibold text-gray-800">Lead Pilot</span>
          </div>
        )}
        {isCollapsed && (
          <svg 
            viewBox="0 0 24 24" 
            className="h-6 w-6 text-brandBlue-600 mx-auto"
            fill="currentColor"
          >
            <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5zM16.25 13.97c-.19-.1-1.12-.55-1.3-.61c-.17-.06-.3-.09-.42.09c-.12.19-.47.61-.58.74c-.11.13-.21.14-.4.05c-1.07-.54-1.77-.97-2.47-2.2c-.19-.32.19-.3.54-1c.06-.11.03-.21-.02-.3c-.05-.08-.42-1.01-.58-1.38c-.15-.36-.31-.31-.42-.32c-.11 0-.24-.03-.36-.03s-.33.05-.5.24c-.17.19-.64.63-.64 1.53c0 .9.67 1.77.76 1.89c.09.12 1.24 1.97 3.05 2.69c1.13.45 1.57.49 2.13.41c.34-.05 1.12-.46 1.28-.9c.16-.45.16-.83.11-.91c-.05-.08-.19-.14-.38-.24z"/>
          </svg>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-2">
        <div className="mb-6">
          {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Menu</p>}
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        {profile?.is_superadmin && superAdminMenuItems.length > 0 && (
          <div className="mb-6">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-red-400 uppercase mb-2">Super Admin</p>}
            {superAdminMenuItems.map((item, index) => (
              <SidebarItem
                key={`superadmin-${index}`}
                icon={item.icon}
                title={item.title}
                path={item.path}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
              />
            ))}
          </div>
        )}

        {profile?.is_admin && adminMenuItems.length > 0 && (
          <div className="mb-6">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Administração</p>}
            {adminMenuItems.map((item, index) => (
              <SidebarItem
                key={`admin-${index}`}
                icon={item.icon}
                title={item.title}
                path={item.path}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
              />
            ))}
          </div>
        )}

        {!isCollapsed && (
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Seu Plano</p>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Plano Gratuito</span>
                <Link to="/pricing" className="text-xs text-brandBlue-600 hover:text-brandBlue-700">Upgrade</Link>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Leads: 50 / 100</span>
                    <span>50%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brandBlue-500 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Mensagens: 30 / 50</span>
                    <span>60%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brandBlue-500 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mb-6 flex justify-center">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold uppercase">
              {user?.email?.charAt(0) || '?'}
            </div>
          </div>
        )}

        <div className="mb-6">
          {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Ações Rápidas</p>}
          <Link to="/campaigns/new">
            <Button 
              variant="default" 
              className={cn(
                "w-full justify-start mb-2",
                isCollapsed && "justify-center px-2"
              )}
            >
              <PlusCircle size={18} className="mr-2" />
              {!isCollapsed && "Nova Campanha"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center justify-between user-menu">
            <div className="flex items-center overflow-hidden">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs font-semibold uppercase flex-shrink-0">
                {user?.email?.charAt(0) || '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}</p>
                <p className="text-xs text-gray-500 email-container">{user?.email || ''}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 logout-button"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold uppercase">
              {user?.email?.charAt(0) || '?'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
