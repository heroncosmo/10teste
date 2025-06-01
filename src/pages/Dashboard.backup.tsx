
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";
import { PlusCircle, RefreshCcw, Bell } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CampaignStatus } from "@/components/dashboard/CampaignStatus";
import { UsageSummary } from "@/components/dashboard/UsageSummary";
import { LeadInsights } from "@/components/dashboard/LeadInsights";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ActionSuggestions } from "@/components/dashboard/ActionSuggestions";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleRefresh = () => {
    toast.success("Dados atualizados com sucesso");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
                <RefreshCcw size={16} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </div>
              <Button 
                className="gap-2"
                onClick={() => navigate('/campaigns/new')}
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Nova Campanha</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Quick Access Actions */}
          <QuickActions />
          
          {/* Performance Metrics */}
          <PerformanceMetrics />
          
          {/* Campaign Status + Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              {/* Active Campaign Status */}
              <CampaignStatus />
              
              {/* Intelligent Suggestions */}
              <ActionSuggestions />
            </div>
            <div className="lg:col-span-1">
              {/* Plan Usage Summary */}
              <UsageSummary />
            </div>
          </div>
          
          {/* Leads Insights */}
          <LeadInsights />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
