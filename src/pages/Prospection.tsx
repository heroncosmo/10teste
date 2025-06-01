import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Sidebar from "@/components/dashboard/Sidebar";
import { databaseService, Company, SearchParams } from "@/services/DatabaseService";
import { Search, Filter, Building, Loader2, ArrowLeft, MoreHorizontal, FilterX, PlusCircle, ChevronLeft, ChevronRight, FolderSearch, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import citiesData from '@/data/cities.json';
import cnaesData from '@/data/cnaes.json';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import { useFilters } from "@/hooks/useFilters";
import { cnaeService } from "@/services/CNAEService";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { messageService, MessageCategory } from '@/services/messageService';

// Lazy loaded components
const CitiesList = lazy(() => import('@/components/CitiesList'));
const CNAEsList = lazy(() => import('@/components/CNAEsList'));

// Função para formatar código CNAE
const formatCNAECode = (code: string) => {
  // Formata o código CNAE para o padrão XX.XX-X
  if (code.length === 7) {
    return `${code.slice(0, 2)}.${code.slice(2, 4)}-${code.slice(4)}`;
  }
  return code;
};

interface CompaniesData {
  companies: Company[];
  total: number;
  totalPages: number;
  currentPage: number;
  mockData?: boolean;
  fallback?: boolean;
  realData?: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

const Prospection = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('cnpj_basico');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    order_by: 'razao_social',
    order_dir: 'asc' as 'asc' | 'desc',
    page: 1,
    limit: 10
  });
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [cnaeSearchTerm, setCnaeSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [categories, setCategories] = useState<MessageCategory[]>([]);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMessage, setNewGroupMessage] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Use o novo hook de filtros
  const { filters, updateFilter, clearFilters, states } = useFilters();
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Memoize filtered cities
  const filteredCitiesMemo = useMemo(() => {
    if (!citySearchTerm.trim()) return citiesData[filters.uf as keyof typeof citiesData] || [];
    return citiesData[filters.uf as keyof typeof citiesData].filter(city => 
      city.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
  }, [citySearchTerm, filters.uf]);

  // Memoize filtered CNAEs
  const filteredCnaesMemo = useMemo(() => {
    return cnaeService.searchCNAEs(cnaeSearchTerm);
  }, [cnaeSearchTerm]);

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);
  
  // Função para formatar número de telefone
  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return null;
    
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Se começar com 0, remove o zero
    const cleanNumbers = numbers.startsWith('0') ? numbers.substring(1) : numbers;
    
    // Se tiver 10 ou mais dígitos, formata com DDD
    if (cleanNumbers.length >= 8) {
      const ddd = cleanNumbers.substring(0, 2);
      // Remove zeros à esquerda após o DDD
      const rest = cleanNumbers.substring(2).replace(/^0+/, '');
      return `(${ddd}) ${rest}`;
    }
    
    return cleanNumbers;
  };
  
  const loadCompanies = useCallback(async (params: SearchParams) => {
    setLoading(true);
    if (!params.cursor) {
      setNextCursor(undefined);
      setPrevCursor(undefined);
    }
    try {
      console.log('Buscando empresas com parâmetros:', params);
      const data = await databaseService.getCompanies(params);
      
      console.log('Dados recebidos do servidor:', data);
      if (data.companies.length > 0) {
        console.log('Exemplo do primeiro registro:', data.companies[0]);
      }
      
      setCompanies(data.companies);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      
      // Configurar cursores para paginação
      if (data.currentPage > 1) {
        setPrevCursor(String(data.currentPage - 1));
      } else {
        setPrevCursor(undefined);
      }
      
      if (data.currentPage < data.totalPages) {
        setNextCursor(String(data.currentPage + 1));
      } else {
        setNextCursor(undefined);
      }
      
      if (data.mockData) {
        console.warn('Exibindo dados de mock. Verifique a conexão com o banco de dados.');
      } else if (data.fromCache) {
        console.log('Dados carregados do cache local.');
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setNextCursor(undefined);
      setPrevCursor(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("EXECUTANDO useEffect INICIAL - CHAMANDO loadCompanies");
    // Carregar primeira página com o tamanho de página padrão
    loadCompanies({ 
      limit: 10,
      page: 1
    });
  }, [loadCompanies]);

  // Função para obter o texto do valor selecionado
  const getSelectedText = (type: 'uf' | 'cidade' | 'cnae' | 'porte') => {
    switch (type) {
      case 'uf':
        if (!filters.uf) return "Todos os estados";
        const state = states.find(s => s.value === filters.uf);
        return state ? state.label : "Todos os estados";
      case 'cidade':
        if (!filters.cidade) return "Todas as cidades";
        return filters.cidade;
      case 'cnae':
        if (!filters.cnae) return "Todos os CNAEs";
        const selectedCnae = filteredCnaesMemo.find(c => c.code === filters.cnae);
        return selectedCnae ? `${formatCNAECode(selectedCnae.code)} - ${selectedCnae.description}` : "Todos os CNAEs";
      case 'porte':
        switch (filters.porte) {
          case 'pequeno': return "Pequeno";
          case 'medio': return "Médio";
          case 'grande': return "Grande";
          default: return "Todos os portes";
        }
    }
  };

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages || loading) return;
    
    console.log('Navegando para a página:', page);
    
    const cleanFilters = { ...filters };
    if (cleanFilters.uf === 'all') cleanFilters.uf = '';
    if (cleanFilters.porte === 'all') cleanFilters.porte = '';

    const newParams: SearchParams = {
      limit: searchParams.limit || 10,
      page: page,
      search: searchTerm,
      order_by: orderBy,
      order_dir: orderDir as 'asc' | 'desc',
      ...cleanFilters
    };
    
    setCurrentPage(page);
    setSearchParams(newParams);
    loadCompanies(newParams);
  };
  
  const handleSearch = () => {
    const cleanFilters = { ...filters };
    if (cleanFilters.uf === 'all') cleanFilters.uf = '';
    if (cleanFilters.porte === 'all') cleanFilters.porte = '';
    
    const newParams = { 
      limit: searchParams.limit || 10,
      page: 1,
      search: searchTerm,
      ...cleanFilters
    };
    
    setCurrentPage(1);
    setSearchParams(newParams);
    loadCompanies(newParams);
  };
  
  const handleSort = (field: string) => {
    setOrderBy(field);
    const newDir = (orderDir === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc';
    setOrderDir(newDir);
    
    const newParams = {
      ...searchParams,
      order_by: field,
      order_dir: newDir
    };
    
    loadCompanies(newParams);
  };

  // Atualizar a parte do select de estados
  const renderStateSelect = () => (
    <div>
      <Label htmlFor="uf">Estado</Label>
      <Select
        value={filters.uf || "all"}
        onValueChange={(value) => updateFilter('uf', value === "all" ? "" : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um estado">
            {getSelectedText('uf')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os estados</SelectItem>
          {states.map((state) => (
            <SelectItem key={state.value} value={state.value}>
              {state.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(companies.map(company => company.cnpj));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectLead = (cnpj: string) => {
    if (selectedLeads.includes(cnpj)) {
      setSelectedLeads(selectedLeads.filter(id => id !== cnpj));
      setSelectAll(false);
    } else {
      setSelectedLeads([...selectedLeads, cnpj]);
      if (selectedLeads.length + 1 === companies.length) {
        setSelectAll(true);
      }
    }
  };

  // Carregar categorias na inicialização
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await messageService.getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Função para criar novo grupo e mensagem
  const createGroupAndMessage = async () => {
    try {
      // Criar categoria com nome sequencial se não fornecido
      const groupName = newGroupName.trim() || `Grupo ${categories.length + 1}`;
      
      // Criar categoria
      const category = await messageService.createCategory({
        name: groupName
      });
      
      // Criar mensagem na categoria
      if (newGroupMessage.trim()) {
        await messageService.createTemplate({
          name: 'Template',
          content: newGroupMessage,
          category_id: category.id
        });
      }
      
      // Recarregar categorias
      await loadCategories();
      
      // Limpar formulário
      setNewGroupName('');
      setNewGroupMessage('');
      setShowNewGroupDialog(false);
      
      // Fechar diálogo de campanha
      setShowCampaignDialog(false);
    } catch (error: any) {
      console.error('Erro ao criar grupo:', error);
    }
  };

  // Função para renderizar números de página
  const renderPageNumbers = () => {
    // Array para armazenar os itens de paginação
    const pageItems = [];
    
    // Determinar o intervalo de páginas a serem exibidas
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar o intervalo se necessário
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Adicionar a primeira página e reticências, se necessário
    if (startPage > 1) {
      pageItems.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => navigateToPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        pageItems.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Adicionar páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={i === currentPage} 
            onClick={() => navigateToPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Adicionar reticências e última página, se necessário
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => navigateToPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageItems;
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
              <h1 className="text-2xl font-semibold text-gray-800 ml-2">Prospecção</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Card className="mb-6">
            <CardHeader className="pb-0">
              <CardTitle>Busca de Leads</CardTitle>
              <CardDescription>Encontre leads para sua próxima campanha</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Buscar empresas</Label>
                    <div className="flex gap-2">
                  <Input
                        id="search"
                        placeholder="Nome da empresa, CNPJ ou cidade..."
                    value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button onClick={handleSearch} disabled={loading}>
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-4 w-4" />
                        )}
                        Buscar
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {renderStateSelect()}
                  
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Select
                      value={filters.cidade || "all"}
                      onValueChange={(value) => updateFilter('cidade', value === "all" ? "" : value)}
                      disabled={!filters.uf}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cidade">
                          {getSelectedText('cidade')}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Buscar cidade..."
                            value={citySearchTerm}
                            onChange={(e) => setCitySearchTerm(e.target.value)}
                            className="mb-2"
                          />
                        </div>
                        <SelectItem value="all">Todas as cidades</SelectItem>
                        <Suspense fallback={<div>Carregando cidades...</div>}>
                          <CitiesList cities={filteredCitiesMemo} />
                        </Suspense>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cnae">CNAE</Label>
                    <Select
                      value={filters.cnae || "all"}
                      onValueChange={(value) => updateFilter('cnae', value === "all" ? "" : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um CNAE">
                          {getSelectedText('cnae')}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Buscar CNAE..."
                            value={cnaeSearchTerm}
                            onChange={(e) => setCnaeSearchTerm(e.target.value)}
                            className="mb-2"
                          />
                        </div>
                        <SelectItem value="all">Todos os CNAEs</SelectItem>
                        <Suspense fallback={<div>Carregando CNAEs...</div>}>
                          <CNAEsList 
                            cnaes={filteredCnaesMemo} 
                            value={filters.cnae || undefined}
                          />
                        </Suspense>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="porte">Porte da empresa</Label>
                    <Select
                      value={filters.porte || "all"}
                      onValueChange={(value) => updateFilter('porte', value === "all" ? "" : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte">
                          {getSelectedText('porte')}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os portes</SelectItem>
                        <SelectItem value="pequeno">Pequeno</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters} disabled={loading}>
                    <FilterX className="mr-2 h-4 w-4" />
                    Limpar filtros
                  </Button>
                  
                  <Button variant="default" onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Filter className="mr-2 h-4 w-4" />
                    )}
                    Aplicar filtros
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos os Leads</TabsTrigger>
              <TabsTrigger value="new">Novos</TabsTrigger>
              <TabsTrigger value="contacted">Contatados</TabsTrigger>
              <TabsTrigger value="interested">Interessados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="bg-white rounded-md border">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">Carregando leads...</p>
                  </div>
                ) : companies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FolderSearch className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">Nenhuma empresa encontrada</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                          <span className="text-sm text-gray-500">
                            {selectedLeads.length} leads selecionados
                          </span>
                        </div>
                        <Button
                          onClick={() => setShowCampaignDialog(true)}
                          disabled={selectedLeads.length === 0}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar Campanha
                        </Button>
                      </div>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4">
                              <Checkbox
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                              />
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Empresa</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">CNPJ</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Segmento</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Cidade</th>
                            <th 
                              className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('situacao_cadastral')}
                            >
                              <div className="flex items-center gap-1">
                                Situação
                                {orderBy === 'situacao_cadastral' && (
                                  <span className="text-gray-400">
                                    {orderDir === 'asc' ? '↑' : '↓'}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('data_inicio_atividade')}
                            >
                              <div className="flex items-center gap-1">
                                Data Abertura
                                {orderBy === 'data_inicio_atividade' && (
                                  <span className="text-gray-400">
                                    {orderDir === 'asc' ? '↑' : '↓'}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {companies.map((company, index) => (
                            <tr key={`${company.cnpj}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <Checkbox
                                  checked={selectedLeads.includes(company.cnpj)}
                                  onCheckedChange={() => handleSelectLead(company.cnpj)}
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1">
                                  <div className="font-medium text-gray-900">
                                    {company.nome_fantasia || company.razao_social || "Nome não disponível"}
                                  </div>
                                  {(company.telefone_1 || company.telefone_2) && (
                                    <div className="text-sm text-gray-500">
                                      <span className="font-medium">📞</span>{' '}
                                      {formatPhoneNumber(company.telefone_1)}
                                      {company.telefone_1 && company.telefone_2 && ` / ${formatPhoneNumber(company.telefone_2)}`}
                                    </div>
                                  )}
                                  {company.email && (
                                    <div className="text-sm text-gray-500">
                                      <span className="font-medium">✉️</span>{' '}
                                      {company.email}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-500">
                                {company.cnpj ? company.cnpj.padStart(14, '0') : "CNPJ não disponível"}
                              </td>
                              <td className="py-3 px-4 text-gray-500">
                                <div className="flex flex-col gap-0.5">
                                  <span>{company.cnae_fiscal || "Não especificado"}</span>
                                  {company.cnae_descricao && (
                                    <span className="text-xs text-gray-400">{company.cnae_descricao}</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-500">
                                <div className="flex flex-col gap-0.5">
                                  <div className="font-medium">
                                    {company.municipio ? `${company.municipio} - ${company.uf}` : "Não especificado"}
                                  </div>
                                  {(company.logradouro || company.bairro || company.cep) && (
                                    <div className="text-xs text-gray-400">
                                      {[
                                        company.logradouro && `${company.tipo_logradouro || ''} ${company.logradouro}`,
                                        company.numero,
                                        company.complemento,
                                        company.bairro,
                                        company.cep?.replace(/^(\d{5})(\d{3})$/, '$1-$2')
                                      ].filter(Boolean).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-500">
                                <div className="flex flex-col gap-0.5">
                                  <span>{company.situacao_cadastral || "Não especificada"}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-500">
                                {company.data_inicio_atividade ? new Date(company.data_inicio_atividade).toLocaleDateString('pt-BR') : "N/A"}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
                      <div className="text-sm text-muted-foreground">
                        Mostrando {companies.length > 0 ? (currentPage - 1) * (searchParams.limit || 10) + 1 : 0} a {Math.min(currentPage * (searchParams.limit || 10), total)} de {total} resultados
                      </div>
                      
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => navigateToPage(currentPage - 1)}
                              disabled={currentPage <= 1 || loading} 
                            />
                          </PaginationItem>
                          
                          {renderPageNumbers()}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => navigateToPage(currentPage + 1)}
                              disabled={currentPage >= totalPages || loading} 
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                Sem leads novos para exibir
              </div>
            </TabsContent>
            
            <TabsContent value="contacted" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                Sem leads contatados para exibir
              </div>
            </TabsContent>
            
            <TabsContent value="interested" className="mt-0">
              <div className="bg-white rounded-md border p-8 text-center text-gray-500">
                Sem leads interessados para exibir
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
            <DialogDescription>
              Configure sua campanha para os {selectedLeads.length} leads selecionados
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Conexão WhatsApp</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conexão" />
                </SelectTrigger>
                <SelectContent>
                  {/* Suas conexões aqui */}
                </SelectContent>
              </Select>
            </div>

            {isLoadingCategories ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : categories.length === 0 ? (
              // Mostrar campos de novo seguimento diretamente quando não houver nenhum
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Seguimento</Label>
                  <Input 
                    placeholder="Ex: Clientes Varejo"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem Padrão</Label>
                  <Textarea
                    placeholder="Digite a mensagem que será enviada para os leads..."
                    value={newGroupMessage}
                    onChange={(e) => setNewGroupMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Esta mensagem será usada como modelo para envio aos leads selecionados
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Seguimento</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewGroupDialog(true)}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Novo Seguimento
                  </Button>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um seguimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.message_count} mensagens)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={categories.length === 0 ? createGroupAndMessage : undefined}>
              Iniciar Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Novo Seguimento */}
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Seguimento</DialogTitle>
            <DialogDescription>
              Crie um novo seguimento para organizar suas mensagens
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Seguimento</Label>
              <Input 
                placeholder="Ex: Clientes Varejo"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Mensagem Padrão</Label>
              <Textarea
                placeholder="Digite a mensagem que será enviada para os leads..."
                value={newGroupMessage}
                onChange={(e) => setNewGroupMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Esta mensagem será usada como modelo para envio aos leads selecionados
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGroupDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={createGroupAndMessage}>
              Criar Seguimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prospection;
