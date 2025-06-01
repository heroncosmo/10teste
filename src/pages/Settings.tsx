
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/dashboard/Sidebar";
import { ArrowLeft, Save, User, Lock, BellRing, Smartphone, MessageSquare, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    company: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    signature: "Atenciosamente,\nEquipe de Vendas"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Perfil atualizado com sucesso");
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (formState.newPassword !== formState.confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      
      if (formState.newPassword.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }
      
      toast.success("Senha alterada com sucesso");
      setFormState(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }, 1000);
  };

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
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Configurações</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-stretch h-auto space-y-1">
                    <button 
                      onClick={() => setActiveTab("account")}
                      className={`flex items-center justify-start text-left px-3 py-2 h-auto rounded-md ${activeTab === "account" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                      <User size={16} className="mr-2" />
                      Perfil da Conta
                    </button>
                    <button 
                      onClick={() => setActiveTab("security")}
                      className={`flex items-center justify-start text-left px-3 py-2 h-auto rounded-md ${activeTab === "security" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                      <Lock size={16} className="mr-2" />
                      Segurança
                    </button>
                    <button 
                      onClick={() => setActiveTab("notifications")}
                      className={`flex items-center justify-start text-left px-3 py-2 h-auto rounded-md ${activeTab === "notifications" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                      <BellRing size={16} className="mr-2" />
                      Notificações
                    </button>
                    <button 
                      onClick={() => setActiveTab("connections")}
                      className={`flex items-center justify-start text-left px-3 py-2 h-auto rounded-md ${activeTab === "connections" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                      <Smartphone size={16} className="mr-2" />
                      Conexões
                    </button>
                    <button 
                      onClick={() => setActiveTab("messaging")}
                      className={`flex items-center justify-start text-left px-3 py-2 h-auto rounded-md ${activeTab === "messaging" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Mensagens
                    </button>
                    <button 
                      onClick={() => setActiveTab("billing")}
                      className={`flex items-center justify-start text-left px-3 py-2 h-auto rounded-md ${activeTab === "billing" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                      <CreditCard size={16} className="mr-2" />
                      Faturamento
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 md:col-span-9">
              {activeTab === "account" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil da Conta</CardTitle>
                    <CardDescription>Gerencie suas informações pessoais e de contato</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input 
                        id="fullName" 
                        name="fullName"
                        placeholder="Seu nome completo" 
                        value={formState.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="seu@email.com" 
                        value={formState.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <p className="text-xs text-gray-500">O email não pode ser alterado após o cadastro</p>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        placeholder="(00) 00000-0000" 
                        value={formState.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="company">Empresa</Label>
                      <Input 
                        id="company" 
                        name="company"
                        placeholder="Nome da sua empresa" 
                        value={formState.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword"
                          type="password" 
                          value={formState.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword"
                          type="password" 
                          value={formState.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword"
                          type="password" 
                          value={formState.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Atualizando...
                          </>
                        ) : (
                          <>Alterar Senha</>
                        )}
                      </Button>
                    </form>
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Sessões Ativas</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <p className="font-medium">Navegador Web - Chrome</p>
                            <p className="text-sm text-gray-500">São Paulo, Brasil • Ativa agora</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <Button variant="outline" size="sm">Encerrar Sessão</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Gerencie como você recebe notificações do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Notificações por Email</h3>
                          <p className="text-sm text-gray-500">Receba atualizações via email</p>
                        </div>
                        <Switch 
                          checked={formState.emailNotifications} 
                          onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Notificações Push</h3>
                          <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                        </div>
                        <Switch 
                          checked={formState.pushNotifications} 
                          onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Notificações SMS</h3>
                          <p className="text-sm text-gray-500">Receba notificações via SMS</p>
                        </div>
                        <Switch 
                          checked={formState.smsNotifications} 
                          onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Preferências de Notificação</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">Novas Respostas</h3>
                            <p className="text-sm text-gray-500">Quando um lead responde uma mensagem</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">Campanhas Concluídas</h3>
                            <p className="text-sm text-gray-500">Quando uma campanha é finalizada</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">Relatórios Semanais</h3>
                            <p className="text-sm text-gray-500">Resumo semanal de desempenho</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full sm:w-auto" onClick={() => toast.success("Preferências salvas com sucesso")}>
                      Salvar Preferências
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "connections" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Conexões</CardTitle>
                    <CardDescription>Gerencie suas conexões com o WhatsApp</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-12">
                      <Smartphone className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-4">Gerencie suas conexões na página de Mensagens</p>
                      <Button asChild>
                        <a href="/messages">Ir para Mensagens</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "messaging" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Mensagens</CardTitle>
                    <CardDescription>Personalize suas mensagens e assinaturas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="signature">Assinatura Padrão</Label>
                      <Textarea 
                        id="signature" 
                        name="signature"
                        placeholder="Sua assinatura padrão" 
                        value={formState.signature}
                        onChange={handleInputChange}
                        rows={4}
                      />
                      <p className="text-xs text-gray-500">Esta assinatura será adicionada ao final das suas mensagens</p>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Mensagens Automáticas</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">Resposta Automática</h3>
                            <p className="text-sm text-gray-500">Responder automaticamente a novas mensagens</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">Mensagem de Ausência</h3>
                            <p className="text-sm text-gray-500">Enviar mensagem quando você estiver indisponível</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full sm:w-auto" onClick={() => toast.success("Configurações salvas com sucesso")}>
                      Salvar Configurações
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "billing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Faturamento</CardTitle>
                    <CardDescription>Gerencie seu plano e informações de pagamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Plano Atual: Gratuito</h3>
                          <p className="text-sm text-gray-500">100 leads, 50 mensagens por mês</p>
                        </div>
                        <Button variant="outline" asChild>
                          <a href="/pricing">Fazer Upgrade</a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Métodos de Pagamento</h3>
                      
                      <div className="flex flex-col items-center justify-center py-12">
                        <CreditCard className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-gray-500 mb-4">Nenhum método de pagamento cadastrado</p>
                        <Button variant="outline">Adicionar Cartão</Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Histórico de Faturas</h3>
                      <p className="text-sm text-gray-500">Nenhuma fatura disponível</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
