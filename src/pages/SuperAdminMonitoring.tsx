import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SuperAdminMonitoring = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Redirecionar se não for super admin
  if (profile && !profile.is_superadmin) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <a href="/superadmin">
                  <ArrowLeft size={20} />
                </a>
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Monitoramento do Sistema</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Uso do Sistema</CardTitle>
                <CardDescription>Métricas de uso em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Adicionar gráficos de uso aqui */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Instâncias</CardTitle>
                <CardDescription>Monitoramento das instâncias do WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Adicionar status das instâncias aqui */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logs do Sistema</CardTitle>
                <CardDescription>Registros de atividades e erros</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Adicionar logs aqui */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Métricas de performance do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Adicionar métricas de performance aqui */}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminMonitoring; 