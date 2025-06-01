
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/dashboard/Sidebar";
import { ArrowLeft, Plus, RefreshCcw, Search, UserPlus, Users, Mail, Phone, Shield, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

// Mock team members data
const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Administrador",
    status: "active",
    avatar: null
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Gerente",
    status: "active",
    avatar: null
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos@empresa.com",
    role: "Agente",
    status: "inactive",
    avatar: null
  }
];

const Team = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newMemberDialog, setNewMemberDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "agent"
  });

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Add member logic would go here
    toast.success(`Convite enviado para ${newMember.email}`);
    setNewMemberDialog(false);
    setNewMember({
      name: "",
      email: "",
      role: "agent"
    });
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
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Equipe</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCcw size={16} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Dialog open={newMemberDialog} onOpenChange={setNewMemberDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Adicionar Membro</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Membro</DialogTitle>
                    <DialogDescription>
                      Envie um convite para um novo membro da equipe.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input 
                        id="name" 
                        placeholder="Nome completo"
                        value={newMember.name}
                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@exemplo.com"
                        value={newMember.email}
                        onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Função</Label>
                      <Select 
                        value={newMember.role} 
                        onValueChange={(value) => setNewMember({...newMember, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="agent">Agente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewMemberDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAddMember}>Enviar Convite</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Card className="mb-6">
            <CardHeader className="pb-0">
              <CardTitle>Membros da Equipe</CardTitle>
              <CardDescription>Gerencie usuários que têm acesso ao seu dashboard</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    placeholder="Buscar por nome, email ou função..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <UserPlus size={16} />
                  <span>Convidar</span>
                </Button>
              </div>

              <div className="bg-white rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Usuário</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Email</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Função</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            Nenhum membro encontrado
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map((member) => (
                          <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                  {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full" />
                                  ) : (
                                    <Users size={18} className="text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500">{member.email}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Shield size={16} className="text-gray-400 mr-2" />
                                <span>{member.role}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                member.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {member.status === 'active' ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convites Pendentes</CardTitle>
              <CardDescription>Convites de membros da equipe que ainda não foram aceitos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">Nenhum convite pendente</p>
                <Button variant="outline" onClick={() => setNewMemberDialog(true)}>
                  Enviar um convite
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Team;
