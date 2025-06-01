import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProfileEditor from '@/components/ui/ProfileEditor';
import BottomNavigation from '@/components/ui/BottomNavigation';
import { User, Shield, CreditCard, Gift, ChevronRight, HelpCircle, LogOut, ChevronLeft, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };

  // Função para abrir WhatsApp de suporte
  const openSupportWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5517981679818&text=Oi%2C%20tudo%20bem%3F%20Preciso%20de%20ajuda%20com%20LeadPilot%20.', '_blank');
    toast.success("Abrindo suporte via WhatsApp...");
  };

  // Função para ir para página de planos
  const goToPricingPage = () => {
    window.location.href = "/pricing";
  };

  // Se não estiver logado, redirecionar para login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-500 text-sm">🚀</span>
            </div>
            <span className="font-bold text-lg ml-2">Lead Pilot</span>
          </div>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Faça login para continuar</h2>
          <p className="text-gray-600 text-center mb-6">
            É necessário fazer login para acessar seu perfil e configurações.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => window.location.href = "/login"}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Fazer Login
            </button>
            <button 
              onClick={() => window.location.href = "/register"}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Criar Conta
            </button>
          </div>
        </div>
        
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
  }

  // Se estiver mostrando o editor de perfil
  if (showEditor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-40 shadow-sm">
          <button 
            onClick={() => setShowEditor(false)}
            className="flex items-center text-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold text-center flex-1">Editar Perfil</h2>
        </div>
        
        <div className="flex-1 flex flex-col p-4 pb-20">
          <ProfileEditor onClose={() => setShowEditor(false)} />
        </div>
        
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
  }

  // Página principal de perfil
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <span className="text-green-500 text-sm">🚀</span>
          </div>
          <span className="font-bold text-lg ml-2">Perfil</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
            <span className="text-amber-500">🪙</span>
            <span className="text-gray-700">7/10</span>
          </div>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Cabeçalho de perfil */}
        <div className="bg-white p-4 flex items-center border-b border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-blue-600 font-bold text-xl">
              {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800">{profile?.full_name || 'Usuário'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center mt-1">
              <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                <Gift className="h-3 w-3 mr-1" />
                <span>Plano Gratuito</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowEditor(true)} 
            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Editar
          </button>
        </div>
        
        {/* Lista de opções */}
        <div className="mt-4">
          <div className="bg-white">
            {/* Seção de Conta */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Conta</h3>
            </div>
            
            <button 
              onClick={() => setShowEditor(true)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-800">Meus Dados</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => setShowEditor(true)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-800">Privacidade e Segurança</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Seção de Pagamentos */}
            <div className="px-4 py-3 border-b border-gray-200 mt-4">
              <h3 className="text-sm font-medium text-gray-500">Pagamentos</h3>
            </div>
            
            <button 
              onClick={goToPricingPage}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-3">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-800">Métodos de Pagamento</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={goToPricingPage}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center mr-3">
                  <Gift className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800">Planos e Assinatura</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-2">Gratuito</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Seção de Ajuda */}
            <div className="px-4 py-3 border-b border-gray-200 mt-4">
              <h3 className="text-sm font-medium text-gray-500">Suporte</h3>
            </div>
            
            <button 
              onClick={openSupportWhatsApp}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-cyan-50 rounded-full flex items-center justify-center mr-3">
                  <HelpCircle className="h-4 w-4 text-cyan-600" />
                </div>
                <span className="text-gray-800">Ajuda e Suporte</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Botão de Logout */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors mt-6"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="font-medium">Sair da conta</span>
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 py-6">
            <p>© 2024 Lead Pilot | Versão 1.0.0</p>
            <p className="mt-1">Todos os direitos reservados</p>
          </div>
        </div>
      </div>
      
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
} 