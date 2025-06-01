
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Database, MessageSquare, Settings } from 'lucide-react';
import SetAdminForm from '@/components/SetAdminForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Redirecionar se não for admin
  if (profile && !profile.is_admin) {
    navigate('/dashboard');
    return null;
  }

  const adminSections = [
    {
      title: 'WhatsApp Instâncias',
      description: 'Gerencie as instâncias de WhatsApp disponíveis no sistema',
      icon: <MessageSquare className="h-12 w-12 text-blue-600" />,
      path: '/admin/whatsapp'
    },
    {
      title: 'Usuários',
      description: 'Visualize e gerencie os usuários do sistema',
      icon: <Users className="h-12 w-12 text-green-600" />,
      path: '/admin/users'
    },
    {
      title: 'Banco de Dados',
      description: 'Acesse informações do banco de dados',
      icon: <Database className="h-12 w-12 text-purple-600" />,
      path: '/admin/database'
    },
    {
      title: 'Configurações',
      description: 'Configure parâmetros gerais do sistema',
      icon: <Settings className="h-12 w-12 text-orange-600" />,
      path: '/admin/settings'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <a href="/dashboard">
                  <ArrowLeft size={20} />
                </a>
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Painel Administrativo</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {adminSections.map((section) => (
              <Card key={section.path} className="hover:shadow-md transition-shadow">
                <button 
                  className="w-full h-full text-left" 
                  onClick={() => navigate(section.path)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                    <div>{section.icon}</div>
                  </CardHeader>
                </button>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <SetAdminForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
