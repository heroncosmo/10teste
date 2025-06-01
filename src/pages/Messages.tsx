import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/dashboard/Sidebar";
import { useWhatsappConnections } from "@/hooks/useWhatsappConnections";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";
import { QRCodeScanner } from "@/components/whatsapp/QRCodeScanner";
import { disconnectInstance, forceDisconnectInstance } from "@/services/whatsappService";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft, 
  RefreshCcw, 
  Loader2, 
  Smartphone,
  Trash2,
  MoreVertical,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/AuthProvider";

const getConnectionStatus = (status: string) => {
  switch (status) {
    case 'connected':
      return {
        label: 'Conectado',
        badge: 'Online',
        className: 'bg-green-100 text-green-800'
      };
    case 'connecting':
      return {
        label: 'Conectando...',
        badge: 'Conectando',
        className: 'bg-yellow-100 text-yellow-800'
      };
    default:
      return {
        label: 'Desconectado',
        badge: 'Offline',
        className: 'bg-gray-100 text-gray-800'
      };
  }
};

const WhatsAppConnections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [usePairingCode, setUsePairingCode] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { connections, isLoading, addConnection, updateConnection, updateConnectionName, deleteConnection } = useWhatsappConnections();
  const { qrCode, pairingCode, isConnecting, startConnection } = useWhatsAppIntegration();
  const { profile } = useAuth();

  useEffect(() => {
    // Verifica se há alguma conexão em estado "connecting" e tenta reconectar
    const connectingConnection = connections.find(c => c.status === 'connecting');
    if (connectingConnection && !isConnecting && !isRetrying) {
      setIsRetrying(true);
      startConnection(connectingConnection.id, usePairingCode ? phoneNumber : undefined)
        .finally(() => setIsRetrying(false));
    }
  }, [connections, isConnecting, isRetrying]);

  const handleAddConnection = async () => {
    try {
      // Verifica o limite de conexões do plano
      if (profile?.whatsapp_connections_limit && connections.length >= profile.whatsapp_connections_limit) {
        toast.error(`Você atingiu o limite de ${profile.whatsapp_connections_limit} conexões do seu plano`);
        return;
      }

      const connection = await addConnection();
      if (connection) {
        setShowQRDialog(true);
        await startConnection(connection.id, usePairingCode ? phoneNumber : undefined);
      }
    } catch (error) {
      console.error('Error starting connection:', error);
      toast.error('Falha ao iniciar conexão com WhatsApp. Por favor, tente novamente.');
    }
  };

  const handleDeleteConnection = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta conexão?')) {
      try {
        // Primeiro busca a conexão
        const connection = connections.find(c => c.id === id);
        if (!connection) {
          throw new Error('Conexão não encontrada');
        }

        // Se tiver uma instância associada, força a desconexão
        if (connection.instance_id) {
          await forceDisconnectInstance(connection.instance_id);
        }
        
        // Depois exclui a conexão
        await deleteConnection(id);
        toast.success('Conexão excluída com sucesso');
      } catch (error) {
        console.error('Error deleting connection:', error);
        toast.error('Falha ao excluir conexão');
      }
    }
  };

  const handleEditName = async (id: string, currentName: string) => {
    const newName = prompt("Nome da conexão:", currentName);
    if (newName && newName !== currentName) {
      try {
        await updateConnectionName(id, newName);
        toast.success('Nome atualizado com sucesso');
      } catch (error) {
        console.error('Error updating connection name:', error);
        toast.error('Falha ao atualizar nome da conexão');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-3 px-4 md:py-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ArrowLeft className="h-5 w-5 text-gray-500 mr-3 md:hidden" onClick={() => window.history.back()} />
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Conexões WhatsApp</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative md:block hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Pesquisar conexões..." 
                  className="block w-60 pl-10 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddConnection}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Nova Conexão</span>
                <span className="md:hidden">Conectar</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 pb-20 md:pb-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="py-4 md:py-6 px-4 md:px-6 bg-white rounded-t-lg">
              <CardTitle className="text-lg md:text-xl">Suas Conexões WhatsApp</CardTitle>
              <CardDescription>Gerencie suas conexões do WhatsApp para envio de mensagens</CardDescription>
            </CardHeader>
            <CardContent className="py-4 md:py-6 px-4 md:px-6 bg-white rounded-b-lg">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-gray-500">Carregando conexões...</p>
                </div>
              ) : connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                  <Smartphone className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma conexão encontrada</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">Adicione uma conexão do WhatsApp para começar a enviar mensagens</p>
                  <Button onClick={handleAddConnection}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Conexão
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {connections.map((connection) => {
                    const status = getConnectionStatus(connection.status);
                    return (
                      <div
                        key={connection.id}
                        className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3 overflow-hidden">
                              <p className="font-medium text-sm md:text-base truncate">{connection.name}</p>
                              <p className="text-xs md:text-sm text-gray-500">{status.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                              {status.badge}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditName(connection.id, connection.name)}>
                                  Editar Nome
                                </DropdownMenuItem>
                                {connection.status === 'disconnected' && (
                                  <DropdownMenuItem onClick={() => {
                                    setShowQRDialog(true);
                                    startConnection(connection.id, usePairingCode ? phoneNumber : undefined);
                                  }}>
                                    Conectar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteConnection(connection.id)}
                                >
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={showQRDialog} onOpenChange={(open) => {
        if (!open) {
          // Se o diálogo for fechado e ainda estiver conectando, cancela a conexão
          const connectingConnection = connections.find(c => c.status === 'connecting');
          if (connectingConnection) {
            updateConnection(connectingConnection.id, { 
              status: 'disconnected',
              instance_id: null
            }).catch(error => {
              console.error('Error canceling connection:', error);
              toast.error('Erro ao cancelar conexão');
            });
          }
          // Limpa os estados
          setPhoneNumber("");
          setUsePairingCode(false);
          setShowQRDialog(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              Escolha como deseja conectar seu WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-center text-gray-600">
                Conectando ao WhatsApp...
                <br />
                <span className="text-sm text-gray-500">
                  Por favor, aguarde enquanto estabelecemos a conexão
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pairing-mode"
                  checked={usePairingCode}
                  onCheckedChange={setUsePairingCode}
                />
                <Label htmlFor="pairing-mode">
                  Usar código de pareamento
                </Label>
              </div>
              
              {usePairingCode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Número do WhatsApp</Label>
                    <Input
                      placeholder="Ex: 5511999999999"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {pairingCode && (
                    <div className="text-center">
                      <p className="text-2xl font-mono mb-2">{pairingCode}</p>
                      <p className="text-sm text-gray-500">
                        Digite este código no seu WhatsApp
                      </p>
                    </div>
                  )}
                </div>
              ) : qrCode ? (
                <div className="flex justify-center">
                  <QRCodeScanner qrCode={qrCode} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                  <p className="text-center text-gray-600">
                    Aguardando geração do QR Code...
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppConnections;
