import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/dashboard/Sidebar";
import { Plus, Search, MessageSquare, FolderPlus, Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageService, MessageCategory, MessageTemplate } from '@/services/messageService';

const MessageLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<MessageTemplate | null>(null);
  
  const [categories, setCategories] = useState<MessageCategory[]>([]);
  const [messages, setMessages] = useState<MessageTemplate[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Estados para os formulários
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [messageForm, setMessageForm] = useState({ 
    content: '', 
    category_id: '' 
  });
  
  const { toast } = useToast();

  // Carregar categorias na inicialização
  useEffect(() => {
    loadCategories();
  }, []);

  // Carregar mensagens quando uma categoria for selecionada
  useEffect(() => {
    if (selectedCategory) {
      loadMessagesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Função para carregar categorias
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await messageService.getCategories();
      setCategories(data);
      
      // Se tiver categorias, seleciona a primeira automaticamente
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error.message);
      toast({
        title: 'Erro ao carregar categorias',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Função para carregar mensagens por categoria
  const loadMessagesByCategory = async (categoryId: string) => {
    setIsLoadingMessages(true);
    try {
      const data = await messageService.getTemplatesByCategory(categoryId);
      setMessages(data);
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error.message);
      toast({
        title: 'Erro ao carregar mensagens',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Função para criar nova categoria
  const createCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast({
          title: 'Nome obrigatório',
          description: 'O nome da categoria é obrigatório',
          variant: 'destructive'
        });
        return;
      }

      await messageService.createCategory({
        name: newCategory.name,
        description: newCategory.description
      });
      
      toast({
        title: 'Categoria criada',
        description: 'Categoria criada com sucesso!'
      });
      
      // Recarregar categorias e fechar o diálogo
      loadCategories();
      setShowNewCategoryDialog(false);
      setNewCategory({ name: '', description: '' });
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error.message);
      toast({
        title: 'Erro ao criar categoria',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Função para criar/editar mensagem
  const saveMessage = async () => {
    try {
      if (!messageForm.content.trim()) {
        toast({
          title: 'Conteúdo obrigatório',
          description: 'O conteúdo da mensagem é obrigatório',
          variant: 'destructive'
        });
        return;
      }

      const categoryId = messageForm.category_id || selectedCategory;
      if (!categoryId) {
        toast({
          title: 'Categoria obrigatória',
          description: 'Selecione uma categoria para a mensagem',
          variant: 'destructive'
        });
        return;
      }

      if (editingMessage) {
        // Editar mensagem existente
        await messageService.updateTemplate(editingMessage.id, {
          content: messageForm.content,
          category_id: categoryId
        });
        toast({
          title: 'Mensagem atualizada',
          description: 'Mensagem atualizada com sucesso!'
        });
      } else {
        // Criar nova mensagem
        await messageService.createTemplate({
          name: 'Template',
          content: messageForm.content,
          category_id: categoryId
        });
        toast({
          title: 'Mensagem criada',
          description: 'Mensagem criada com sucesso!'
        });
      }
      
      // Recarregar mensagens e categorias
      if (selectedCategory) {
        loadMessagesByCategory(selectedCategory);
      }
      loadCategories();
      setShowMessageDialog(false);
      setMessageForm({ content: '', category_id: '' });
      setEditingMessage(null);
    } catch (error: any) {
      console.error('Erro ao salvar mensagem:', error.message);
      toast({
        title: `Erro ao ${editingMessage ? 'atualizar' : 'criar'} mensagem`,
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Função para excluir uma categoria
  const deleteCategory = async (categoryId: string) => {
    try {
      await messageService.deleteCategory(categoryId);
      
      toast({
        title: 'Categoria excluída',
        description: 'Categoria excluída com sucesso!'
      });
      
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
      
      loadCategories();
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error.message);
      toast({
        title: 'Erro ao excluir categoria',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Função para excluir uma mensagem
  const deleteMessage = async (messageId: string) => {
    try {
      if (!selectedCategory) return;
      
      await messageService.deleteTemplate(messageId, selectedCategory);
      
      toast({
        title: 'Mensagem excluída',
        description: 'Mensagem excluída com sucesso!'
      });
      
      if (selectedCategory) {
        loadMessagesByCategory(selectedCategory);
      }
      loadCategories(); // Recarrega categorias para atualizar contagem
    } catch (error: any) {
      console.error('Erro ao excluir mensagem:', error.message);
      toast({
        title: 'Erro ao excluir mensagem',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Filtrar mensagens com base no termo de busca
  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Biblioteca de Mensagens</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNewCategoryDialog(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
              <Button onClick={() => {
                setEditingMessage(null);
                setMessageForm({ content: '', category_id: '' });
                setShowMessageDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Mensagem
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Categorias */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categorias</CardTitle>
                  <CardDescription>Organize suas mensagens em grupos</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCategories ? (
                    <p className="text-center py-4 text-gray-500">Carregando categorias...</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.length === 0 ? (
                        <p className="text-center py-4 text-gray-500">Nenhuma categoria encontrada</p>
                      ) : (
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                              selectedCategory === category.id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="font-medium">{category.name}</p>
                                <p className="text-xs text-gray-500">{category.message_count || 0} mensagens</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={e => {
                                  e.stopPropagation();
                                  // Implementar edição
                                }}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={e => {
                                    e.stopPropagation();
                                    deleteCategory(category.id);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lista de Mensagens */}
            <div className="col-span-1 lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Mensagens</CardTitle>
                  <CardDescription>
                    {selectedCategory 
                      ? `Mensagens da categoria ${categories.find(c => c.id === selectedCategory)?.name}`
                      : 'Selecione uma categoria para ver suas mensagens'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                      <Input
                        placeholder="Buscar mensagens..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {!selectedCategory ? (
                    <p className="text-center py-4 text-gray-500">Selecione uma categoria para ver suas mensagens</p>
                  ) : isLoadingMessages ? (
                    <p className="text-center py-4 text-gray-500">Carregando mensagens...</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredMessages.length === 0 ? (
                        <p className="text-center py-4 text-gray-500">
                          {searchTerm 
                            ? 'Nenhuma mensagem encontrada para esta busca' 
                            : 'Nenhuma mensagem nesta categoria'}
                        </p>
                      ) : (
                        filteredMessages.map((message) => (
                          <div key={message.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{message.name}</h3>
                                {message.description && (
                                  <p className="text-sm text-gray-500 mt-1">{message.description}</p>
                                )}
                                {message.variables && message.variables.length > 0 && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Variáveis: {message.variables.map(v => `{{${v}}}`).join(', ')}
                                  </p>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => deleteMessage(message.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-3 bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Criada em {new Date(message.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Dialog para Nova Categoria */}
        <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para organizar suas mensagens
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Restaurantes, Black Friday"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva o propósito desta categoria"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createCategory}>Criar Categoria</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Nova Mensagem */}
        <Dialog open={showMessageDialog} onOpenChange={(open) => {
          setShowMessageDialog(open);
          if (!open) {
            setEditingMessage(null);
            setMessageForm({ content: '', category_id: '' });
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMessage ? 'Editar Mensagem' : 'Nova Mensagem'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoria
                </Label>
                <select
                  id="category"
                  className="col-span-3"
                  value={messageForm.category_id || selectedCategory || ''}
                  onChange={(e) => setMessageForm({ ...messageForm, category_id: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Mensagem
                </Label>
                <Textarea
                  id="content"
                  className="col-span-3 min-h-[100px]"
                  placeholder="Digite sua mensagem aqui..."
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowMessageDialog(false);
                setEditingMessage(null);
                setMessageForm({ content: '', category_id: '' });
              }}>
                Cancelar
              </Button>
              <Button onClick={saveMessage}>
                {editingMessage ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MessageLibrary; 