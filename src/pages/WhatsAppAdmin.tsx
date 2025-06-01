import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWhatsappInstances } from "@/hooks/useWhatsappInstances";
import { useAuth } from "@/providers/AuthProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Plus, RefreshCcw, Trash2, Edit, AlertCircle, Check, X, User, Key, Users, LogOut } from "lucide-react";
import { toast } from "sonner";

const instanceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  instance_id: z.string().min(1, "ID da instância é obrigatório"),
  api_key: z.string().min(1, "API Key é obrigatória"),
  host: z.string().min(1, "Host é obrigatório"),
  max_free_users: z.number().min(1, "Número de usuários gratuitos é obrigatório")
});

const WhatsAppAdmin = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { instances, isLoading, fetchInstances, addInstance, updateInstance, deleteInstance } = useWhatsappInstances();
  const [newInstanceDialog, setNewInstanceDialog] = useState(false);
  const [editInstanceDialog, setEditInstanceDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<any>(null);

  // Verificação de admin e redirecionamento
  if (profile && profile.is_admin === false) {
    navigate("/dashboard");
    return null;
  }

  const newInstanceForm = useForm<z.infer<typeof instanceSchema>>({
    resolver: zodResolver(instanceSchema),
    defaultValues: {
      name: "",
      instance_id: "",
      api_key: "",
      host: "api.w-api.app",
      max_free_users: 5
    }
  });

  const editInstanceForm = useForm<z.infer<typeof instanceSchema>>({
    resolver: zodResolver(instanceSchema),
    defaultValues: {
      name: "",
      instance_id: "",
      api_key: "",
      host: "api.w-api.app",
      max_free_users: 5
    }
  });

  const handleAddInstance = async (values: z.infer<typeof instanceSchema>) => {
    const result = await addInstance(
      values.name, 
      values.instance_id, 
      values.api_key,
      values.max_free_users,
      values.host
    );
    if (result) {
      setNewInstanceDialog(false);
      newInstanceForm.reset();
    }
  };

  const handleEditInstance = async (values: z.infer<typeof instanceSchema>) => {
    if (!selectedInstance) return;
    
    const result = await updateInstance(selectedInstance.id, values);
    if (result) {
      setEditInstanceDialog(false);
      editInstanceForm.reset();
    }
  };

  const openEditDialog = (instance: any) => {
    setSelectedInstance(instance);
    editInstanceForm.setValue("name", instance.name);
    editInstanceForm.setValue("instance_id", instance.instance_id);
    editInstanceForm.setValue("api_key", instance.api_key);
    editInstanceForm.setValue("host", instance.host);
    editInstanceForm.setValue("max_free_users", instance.max_free_users);
    setEditInstanceDialog(true);
  };

  const confirmDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta instância?")) {
      await deleteInstance(id);
    }
  };

  const disconnectUser = async (userId: string) => {
    if (window.confirm("Tem certeza que deseja desconectar este usuário?")) {
      await deleteInstance(userId);
    }
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
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Administração de WhatsApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchInstances()}>
                <RefreshCcw size={16} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Dialog open={newInstanceDialog} onOpenChange={setNewInstanceDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus size={16} />
                    <span className="hidden sm:inline">Nova Instância</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Instância</DialogTitle>
                    <DialogDescription>
                      Insira os dados da nova instância do WhatsApp para disponibilização aos usuários.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...newInstanceForm}>
                    <form onSubmit={newInstanceForm.handleSubmit(handleAddInstance)} className="space-y-4 py-4">
                      <FormField
                        control={newInstanceForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Instância</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: WhatsApp Business 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={newInstanceForm.control}
                        name="instance_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID da Instância</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: whatsapp-business-1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={newInstanceForm.control}
                        name="api_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: sk_live_..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={newInstanceForm.control}
                        name="host"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Host</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: api.w-api.app" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={newInstanceForm.control}
                        name="max_free_users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Usuários Gratuitos</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setNewInstanceDialog(false)}>Cancelar</Button>
                        <Button type="submit">Adicionar</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Instâncias do WhatsApp</CardTitle>
              <CardDescription>Gerencie instâncias disponíveis para os usuários</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : instances.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 mb-4">Nenhuma instância cadastrada</p>
                  <Button variant="outline" onClick={() => setNewInstanceDialog(true)}>
                    Adicionar instância
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Nome</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">ID da Instância</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Disponível</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Usuários Gratuitos</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Usuário Atual</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instances.map((instance) => (
                          <tr key={instance.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{instance.name}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Key size={16} className="text-gray-400 mr-2" />
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{instance.instance_id}</code>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                instance.is_available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {instance.is_available ? (
                                  <><Check size={12} className="mr-1" /> Sim</>
                                ) : (
                                  <><X size={12} className="mr-1" /> Não</>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Users size={16} className="text-gray-400 mr-2" />
                                <span>{instance.current_free_users} / {instance.max_free_users}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {instance.current_user_id ? (
                                <div className="flex items-center">
                                  <User size={16} className="text-gray-400 mr-2" />
                                  <span className="text-sm">{instance.current_user_id.substring(0, 8)}...</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(instance)}>
                                  <Edit size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => confirmDelete(instance.id)}>
                                  <Trash2 size={16} />
                                </Button>
                                {instance.current_user_id && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-orange-500"
                                    onClick={() => disconnectUser(instance.current_user_id)}
                                  >
                                    <LogOut size={16} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <Dialog open={editInstanceDialog} onOpenChange={setEditInstanceDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Instância</DialogTitle>
                    <DialogDescription>
                      Atualize as informações da instância do WhatsApp.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...editInstanceForm}>
                    <form onSubmit={editInstanceForm.handleSubmit(handleEditInstance)} className="space-y-4 py-4">
                      <FormField
                        control={editInstanceForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Instância</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editInstanceForm.control}
                        name="instance_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID da Instância</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editInstanceForm.control}
                        name="api_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editInstanceForm.control}
                        name="host"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Host</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editInstanceForm.control}
                        name="max_free_users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Usuários Gratuitos</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setEditInstanceDialog(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default WhatsAppAdmin;
