
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  Search,
  MessageSquare,
  Send,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Users,
  Database,
  Crown,
  Server,
  Activity,
  Star,
  Mail,
  Phone,
  Zap,
  Target,
  TrendingUp,
  Bell,
  Plus,
  Filter,
  Calendar,
  FileText,
  Archive,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

const ModernSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Mock data - replace with real data from hooks
  const [unreadCount] = useState({
    inbox: 23,
    whatsapp: 8,
    campaigns: 3,
    reports: 1
  });

  const planLimits = {
    leads: { used: 47, total: 100, percentage: 47 },
    messages: { used: 8, total: 10, percentage: 80 },
    campaigns: { used: 2, total: 3, percentage: 67 }
  };

  const quickActions = [
    { 
      icon: <Plus size={16} />, 
      label: "Nova Campanha", 
      action: "/campaigns/new", 
      color: "bg-blue-500" 
    },
    { 
      icon: <MessageSquare size={16} />, 
      label: "Mensagem", 
      action: "/messages/library", 
      color: "bg-green-500" 
    },
    { 
      icon: <Target size={16} />, 
      label: "Prospectar", 
      action: "/prospection", 
      color: "bg-purple-500" 
    },
    { 
      icon: <BarChart3 size={16} />, 
      label: "Relatórios", 
      action: "/reports", 
      color: "bg-orange-500" 
    }
  ];

  const menuSections = [
    {
      title: "Principal",
      items: [
        { icon: <Home size={20} />, title: "Dashboard", path: "/dashboard", badge: null },
        { icon: <Target size={20} />, title: "Prospecção", path: "/prospection", badge: null },
        { icon: <MessageSquare size={20} />, title: "WhatsApp", path: "/whatsapp-connections", badge: unreadCount.whatsapp },
        { icon: <FileText size={20} />, title: "Mensagens", path: "/messages/library", badge: unreadCount.inbox },
        { icon: <Send size={20} />, title: "Campanhas", path: "/campaigns", badge: unreadCount.campaigns },
        { icon: <BarChart3 size={20} />, title: "Relatórios", path: "/reports", badge: unreadCount.reports }
      ]
    },
    {
      title: "Organização",
      items: [
        { icon: <Users size={20} />, title: "Equipe", path: "/team", badge: null },
        { icon: <Settings size={20} />, title: "Configurações", path: "/settings", badge: null }
      ]
    }
  ];

  // Add admin/superadmin sections if user has permissions
  if (profile?.is_admin || profile?.is_superadmin) {
    menuSections.push({
      title: "Administração",
      items: [
        ...(profile?.is_admin ? [
          { icon: <Database size={20} />, title: "Admin Dashboard", path: "/admin", badge: null },
          { icon: <Phone size={20} />, title: "Admin WhatsApp", path: "/admin/whatsapp", badge: null }
        ] : []),
        ...(profile?.is_superadmin ? [
          { icon: <Crown size={20} />, title: "Super Admin", path: "/superadmin", badge: null },
          { icon: <Server size={20} />, title: "Instâncias", path: "/superadmin/instances", badge: null },
          { icon: <Activity size={20} />, title: "Monitoramento", path: "/superadmin/monitoring", badge: null }
        ] : [])
      ]
    });
  }

  const recentCampaigns = [
    { name: "Black Friday - Restaurantes", status: "active", opens: 234, clicks: 45 },
    { name: "Promoção Verão", status: "draft", opens: 0, clicks: 0 },
    { name: "Newsletter Semanal", status: "completed", opens: 189, clicks: 32 }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const SidebarItem = ({ icon, title, path, badge, isActive, onClick }) => (
    <Link
      to={path}
      className={cn(
        "flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-all duration-200",
        isActive 
          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isCollapsed && "justify-center"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={isCollapsed ? "mx-auto" : "mr-3"}>{icon}</div>
        {!isCollapsed && <span className="font-medium">{title}</span>}
      </div>
      {!isCollapsed && badge && (
        <Badge variant="destructive" className="text-xs">
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}
    </Link>
  );

  const PostAction = ({ icon, label, count, color = "text-gray-600" }) => (
    <div className={cn("flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors", color)}>
      {icon}
      {!isCollapsed && (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{label}</span>
          {count && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-80"
    )}>
      
      {/* Header */}
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
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center justify-start space-x-2 p-3 h-auto"
                onClick={() => navigate(action.action)}
              >
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white", action.color)}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <SidebarItem
                  key={itemIndex}
                  icon={item.icon}
                  title={item.title}
                  path={item.path}
                  badge={item.badge}
                  isActive={location.pathname === item.path}
                  onClick={() => setActiveSection(item.path.substring(1))}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Recent Campaigns */}
        {!isCollapsed && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Campanhas Recentes
            </h3>
            {recentCampaigns.map((campaign, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{campaign.name}</h4>
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : campaign.status === 'draft' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {campaign.status === 'active' ? 'Ativa' : 
                     campaign.status === 'draft' ? 'Rascunho' : 'Finalizada'}
                  </Badge>
                </div>
                
                {/* Post Actions */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2 mt-2">
                  <PostAction icon={<Eye size={14} />} label="Visualizações" count={campaign.opens} />
                  <PostAction icon={<MousePointer size={14} />} label="Cliques" count={campaign.clicks} />
                  <PostAction icon={<Share size={14} />} label="Compartilhar" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Plano Gratuito</span>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs"
                onClick={() => navigate("/pricing")}
              >
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
                    <span className={cn("font-medium", limit.percentage > 80 ? "text-red-600" : "text-gray-600")}>
                      {limit.used} / {limit.total}
                    </span>
                  </div>
                  <Progress 
                    value={limit.percentage} 
                    className={cn(
                      "h-2",
                      limit.percentage > 80 ? "bg-red-100" : 
                      limit.percentage > 60 ? "bg-yellow-100" : "bg-green-100"
                    )}
                  />
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
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
              <LogOut size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSidebar;
