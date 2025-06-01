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
  Activity,
  Zap,
  Eye,
  MousePointer,
  Share,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlanStatus } from "@/components/dashboard/PlanStatus";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
  badge?: number;
}

const SidebarItem = ({ icon, title, path, isCollapsed, isActive, onClick, badge }: SidebarItemProps) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex items-center justify-between p-3 mb-1 rounded-lg transition-all duration-200",
        isActive 
          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isCollapsed && "justify-center"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={cn(isCollapsed ? "mx-auto" : "mr-3")}>{icon}</div>
        {!isCollapsed && <span className="font-medium">{title}</span>}
      </div>
      {!isCollapsed && badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Simulando contadores de notificações
  const unreadCount = {
    dashboard: 0,
    prospection: 0,
    whatsapp: 8,
    messages: 15,
    campaigns: 3,
    reports: 1,
    team: 0,
    settings: 0
  };

  // Simulando campanhas recentes
  const recentCampaigns = [
    { name: "Black Friday - Restaurantes", status: "active", opens: 234, clicks: 45 },
    { name: "Promoção Verão", status: "draft", opens: 0, clicks: 0 },
    { name: "Newsletter Semanal", status: "completed", opens: 189, clicks: 32 }
  ];

  const menuItems = [
    { 
      icon: <Home size={20} />, 
      title: "Dashboard", 
      path: "/dashboard",
      badge: unreadCount.dashboard
    },
    { 
      icon: <Search size={20} />, 
      title: "Prospecção", 
      path: "/prospection",
      badge: unreadCount.prospection
    },
    { 
      icon: <MessageSquare size={20} />, 
      title: "Conexões WhatsApp", 
      path: "/whatsapp-connections",
      badge: unreadCount.whatsapp
    },
    { 
      icon: <MessageSquare size={20} />, 
      title: "Biblioteca de Mensagens", 
      path: "/messages/library",
      badge: unreadCount.messages 
    },
    { 
      icon: <Send size={20} />, 
      title: "Campanhas", 
      path: "/campaigns",
      badge: unreadCount.campaigns
    },
    { 
      icon: <BarChart3 size={20} />, 
      title: "Relatórios", 
      path: "/reports",
      badge: unreadCount.reports
    },
    { 
      icon: <Users size={20} />, 
      title: "Equipe", 
      path: "/team",
      badge: unreadCount.team
    },
    { 
      icon: <Settings size={20} />, 
      title: "Configurações", 
      path: "/settings",
      badge: unreadCount.settings
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
    <>
      {/* Botão de menu para mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </Button>
      </div>
      {/* Sidebar para desktop */}
      <div className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 md:relative md:flex md:w-[250px]",
        isCollapsed ? "w-[70px]" : "w-[250px]",
        "hidden md:flex"
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Lead Pilot</h1>
                <p className="text-xs text-gray-500">Marketing Automation</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5 text-white" />
            </div>
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
                badge={item.badge}
              />
            ))}
          </div>

          {/* Recent Campaigns - Estilo Facebook */}
          {!isCollapsed && (
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Campanhas Recentes</p>
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 mb-2 hover:bg-gray-100 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{campaign.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status === 'active' ? 'Ativa' : 
                      campaign.status === 'draft' ? 'Rascunho' : 'Finalizada'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{campaign.opens}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MousePointer size={14} />
                      <span>{campaign.clicks}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plan Status */}
          {!isCollapsed && (
            <div className="mb-6">
              <PlanStatus />
            </div>
          )}

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

          <div className="mb-6">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Ações Rápidas</p>}
            <Link to="/campaigns/new">
              <Button 
                variant="default" 
                className={cn(
                  "w-full justify-start mb-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
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
            <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-2 flex items-center justify-center text-xs font-semibold uppercase text-white flex-shrink-0">
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
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-semibold uppercase text-white">
                {user?.email?.charAt(0) || '?'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer para mobile */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="p-0 w-[80vw] max-w-xs h-screen">
          <div className="h-full flex flex-col">
            {/* Header no mobile */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Lead Pilot</h1>
                  <p className="text-xs text-gray-500">Marketing Automation</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="h-8 w-8">
                <X size={18} />
              </Button>
            </div>

            {/* Conteúdo do menu mobile */}
            <div className="flex-grow overflow-y-auto p-2">
              <div className="mb-6">
                {menuItems.map((item, index) => (
                  <SidebarItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    path={item.path}
                    isCollapsed={false}
                    isActive={location.pathname === item.path}
                    badge={item.badge}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              {/* Plan Status no mobile */}
              <div className="mb-6">
                <PlanStatus />
              </div>

              {/* Nova Campanha no mobile */}
              <div className="mb-6">
                <Link to="/campaigns/new" onClick={() => setMobileOpen(false)}>
                  <Button 
                    variant="default" 
                    className="w-full justify-start mb-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Nova Campanha
                  </Button>
                </Link>
              </div>
            </div>

            {/* User profile no mobile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-2 flex items-center justify-center text-xs font-semibold uppercase text-white flex-shrink-0">
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
