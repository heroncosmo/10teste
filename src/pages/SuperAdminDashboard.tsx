import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Monitor, Server } from 'lucide-react';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Redirecionar se não for super admin
  if (profile && !profile.is_superadmin) {
    navigate('/dashboard');
    return null;
  }

  const menuItems = [
    {
      title: 'Gerenciar Usuários',
      description: 'Administre todos os usuários do sistema',
      icon: <Users className="h-8 w-8" />,
      link: '/superadmin/users'
    },
    {
      title: 'Monitoramento',
      description: 'Monitore o desempenho do sistema',
      icon: <Monitor className="h-8 w-8" />,
      link: '/superadmin/monitoring'
    },
    {
      title: 'Instâncias',
      description: 'Gerencie as instâncias do WhatsApp',
      icon: <Server className="h-8 w-8" />,
      link: '/superadmin/instances'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <h1 className="text-2xl font-semibold text-gray-800">Painel Super Admin</h1>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(item.link)}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {item.icon}
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 