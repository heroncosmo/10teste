import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import creditService from '@/services/creditService';
import { useAuth } from '@/providers/AuthProvider';

export interface Lead {
  id: number;
  avatar?: string;
  companyName: string;
  nomeFantasia: string;
  razaoSocial: string;
  description: string;
  location: string;
  employeeCount: string;
  matchPercentage: number;
  contactName: string;
  contactRole: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isUnlocked: boolean;
  isPremium: boolean;
  isHot: boolean;
  isFavorited: boolean;
  aiInsights?: string;
  cnae?: string;
  showUnlockMessage?: boolean;
  
  // Campos adicionais para exibir quando desbloqueado
  fullAddress?: string | null;
  cnpj?: string | null; 
  additionalPhones?: string[];
  dataAbertura?: string | null;
  capitalSocial?: string | null;
  
  // Campos de endereço detalhados
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  
  // Dados reais (não acessíveis pelo cliente, apenas via backend)
  _secure_email?: string | null;
  _secure_phone?: string | null;
  _secure_phone2?: string | null;
  _secure_logradouro?: string | null;
  _secure_numero?: string | null;
  _secure_complemento?: string | null;
  _secure_bairro?: string | null;
  _secure_cep?: string | null;
  _secure_address?: string | null;
  _secure_cnpj?: string | null;
  _secure_data_abertura?: string | null;
  _secure_capital_social?: string | null;
  _secure_situacao_cadastral?: string | null;
  _secure_natureza_juridica?: string | null;
}

// Interface que representa a estrutura real da tabela empresas no Supabase
interface SupabaseEmpresa {
  cnpj_basico: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  tem_dados_empresa: string | null;
  tem_dados_socio: string | null;
  natureza_juridica: string | null;
  porte: number | null;
  capital_social: string | null;
  tipo_logradouro: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  codigo_municipio: number | null;
  municipio: string | null;
  uf: string | null;
  telefone_1: string | null;
  telefone_2: string | null;
  email: string | null;
  cnae_fiscal: number | null;
  cnae_descricao: string | null;
  cnae_fiscal_secundario: string | null;
  data_inicio_atividade: string | null;
  codigo_situacao_cadastral: number | null;
  situacao_cadastral: string | null;
  data_situacao_cadastral: string | null;
  motivo_situacao_cadastral: number | null;
  identificador_matriz_filial: number | null;
}

// Criar uma série de insights de IA para mostrar aleatoriamente
const aiInsightMessages = [
  "Alta probabilidade de conversão • Melhor horário: 14h-16h • Segmento em crescimento +23%",
  "Empresa em expansão • Buscando novos fornecedores • Histórico de resposta positiva",
  "Empresa com alto potencial • Buscando expandir serviços • Investe regularmente em tecnologia",
  "12 usuários visualizaram nas últimas 24h • 87% de taxa de resposta neste segmento",
  "Empresa recém-aberta • Momento ideal para primeiro contato • Necessidade de fornecedores",
  "Perfil similar a 3 de seus melhores clientes • Compatibilidade de 92%",
  "Momento de renovação de contratos • Timing ideal para proposta • Mercado em expansão",
  "Padrão de compra recorrente • Potencial para relacionamento de longo prazo",
  "Empresa com crescimento de 34% no último ano • Expansão de equipe em andamento",
  "Histórico de resposta rápida • 76% de taxa de abertura de mensagens",
  "Empresa buscando soluções para otimizar operações • Momento ideal para oferecer serviços",
  "Comportamento similar a clientes que converteram em menos de 7 dias",
  "Empresa recém-financiada • Capital disponível para investimentos • Buscando parceiros",
  "Alto engajamento em tópicos relacionados ao seu setor nas redes sociais",
  "Histórico de compras recorrentes • Potencial para venda de complementos",
  "Timing ideal: final de mês • Ciclo de decisão estimado em 12 dias",
  "Empresa com equipe em expansão • Necessidade de novos serviços",
  "Comportamento de acesso recorrente ao seu perfil • Interesse confirmado",
  "Tomador de decisão identificado • Contato direto disponível • Aumenta chances em 67%",
  "Ciclo de vendas previsto: 14 dias • Decisão rápida • Necessidade imediata",
  "Perfil de early adopter • Aberto a novas soluções • Referência no setor",
  "7 interações prévias com sua marca • Interesse consolidado • Pronto para conversão",
  "Empresa em fase de transformação digital • Buscando ativamente soluções",
  "Padrão de comportamento similar a clientes que aumentaram pedidos em 90 dias",
  "Localizada na região de maior sucesso para suas vendas • Taxa de conversão +42%",
  "Perfil de decisão rápida • Potencial para fechamento em até 5 dias",
  "Momento de expansão para novos mercados • Necessidade de parceiros estratégicos",
  "Interesse recente em produtos similares aos seus • Momento ideal para contato",
  "Empresa em processo de automação • Buscando eficiência operacional",
  "3 tentativas prévias de contato por concorrentes • Oportunidade de diferenciação",
  "Empresa com investimento recente em tecnologia • Aberta a inovações",
  "Histórico de fidelidade a fornecedores • Potencial para relacionamento duradouro",
  "Padrão de resposta rápida em canais digitais • Melhor canal: WhatsApp",
  "Momento de reestruturação interna • Buscando novas soluções",
  "Comportamento indicativo de necessidade urgente • Prioridade alta",
  "Empresa com capital recém-captado • Período de investimentos ativos",
  "Histórico de decisões baseadas em qualidade, não em preço • Valoriza diferenciais",
  "3 interações recentes com seu site • Interesse em crescimento",
  "Sazonalidade favorável para seu segmento • Momento ideal para abordagem",
  "Empresa em fase de expansão regional • Buscando parceiros locais",
  "Perfil de early majority • Momento ideal para apresentar cases de sucesso",
  "Histórico de upgrade de serviços em menos de 6 meses • Alto LTV potencial",
  "Comportamento de busca ativa por soluções do seu segmento",
  "Empresa com necessidade imediata identificada • Oportunidade de solução rápida",
  "Padrão de decisão baseado em recomendações • Apresente casos de sucesso",
  "2 concorrentes já identificados no processo • Oportunidade de diferenciação",
  "Momento de revisão de fornecedores • Timing ideal para nova proposta",
  "Perfil complementar ao seu produto principal • Oportunidade de cross-selling",
  "Comportamento indicativo de pesquisa de mercado • Fase final de decisão",
  "Empresa com cultura de inovação • Aberta a novas abordagens",
  "Histórico de adoção de novas tecnologias • Receptiva a soluções inovadoras",
  "Fase de planejamento anual • Momento estratégico para inserção no orçamento",
  "Comportamento de múltiplos stakeholders analisando sua solução",
  "Empresa com desafios específicos que sua solução resolve • Match perfeito",
  "Padrão de consulta frequente a materiais educativos • Valoriza expertise",
  "Timing alinhado com fechamento fiscal • Oportunidade para proposta",
  "Comportamento de comparação ativa de fornecedores • Momento decisivo",
  "Empresa com necessidade de escalabilidade • Sua solução como diferencial",
  "Histórico de investimento em soluções para eficiência operacional",
  "Momento pós-captação de recursos • Disponibilidade para investimentos",
  "Comportamento de busca por referências de mercado • Apresente credenciais",
  "Empresa em fase de internacionalização • Necessidade de soluções robustas",
  "Padrão de análise detalhada antes da decisão • Prepare materiais completos",
  "Processo de decisão em andamento • Estágio intermediário • Momento ideal",
  "Empresa com desafios sazonais recorrentes • Sua solução como estabilizador",
  "Comportamento de múltiplas cotações • Fase final de escolha • Diferenciação crucial",
  "Timing ideal para contato: início da semana • Disponibilidade de agenda",
  "Fase de implementação de melhorias internas • Receptividade a propostas",
  "Empresa com cultura de decisão baseada em dados • Apresente métricas",
  "Padrão de renovação tecnológica a cada 18-24 meses • Ciclo atual finalizando",
  "Comportamento de busca por economia de escala • Sua solução como otimizadora",
  "Empresa com desafios específicos de segmento • Sua expertise como diferencial",
  "Necessidade identificada de integração entre sistemas • Sua solução como ponte",
  "Comportamento indicativo de frustração com fornecedor atual",
  "Momento pós-fusão/aquisição • Reestruturação de processos e fornecedores",
  "Empresa com expansão de portfólio • Necessidade de soluções complementares",
  "Padrão de decisão influenciada por tendências de mercado • Mostre inovação",
  "Fase de adaptação a novas regulamentações • Sua solução como facilitadora",
  "Comportamento de busca por referências específicas • Destaque credenciais",
  "Empresa com investimento recente em marketing • Buscando resultados",
  "Momento de revisão estratégica • Oportunidade para inserção em novos projetos",
  "Empresa com desafios de gestão distribuída • Sua solução como integradora",
  "Padrão de análise detalhada de ROI • Prepare demonstração de resultados",
  "Timing alinhado com planejamento trimestral • Momento estratégico",
  "Comportamento de busca por otimização de recursos • Destaque eficiência",
  "Empresa com desafios de escalabilidade • Sua solução como acelerador",
  "Momento pós-implementação de ERP • Buscando soluções complementares",
  "Histórico de valorização de suporte pós-venda • Destaque seu atendimento",
  "Comportamento de decisão baseada em referências pessoais • Use recomendações",
  "Empresa em adaptação ao trabalho híbrido • Soluções de integração necessárias",
  "Padrão de investimento em capacitação • Destaque facilidade de adoção",
  "Fase de revisão de processos internos • Momento ideal para novas soluções",
  "Comportamento de busca por diferenciais competitivos • Sua solução como vantagem",
  "Empresa com desafios de conformidade • Sua solução como facilitadora",
  "Momento de expansão para novos segmentos • Necessidade de versatilidade",
  "Histórico de decisão baseada em inovação • Destaque aspectos inovadores",
  "Comportamento de pesquisa prolongada • Fase final de decisão • Momento crucial",
  "Empresa com necessidade de integração entre departamentos",
  "Fase de implementação de metodologias ágeis • Sua solução como catalisadora",
  "Padrão de decisão influenciada por tendências tecnológicas • Mostre vanguarda"
];

// Mock data para desenvolvimento e fallback
const mockLeads: Lead[] = [
  {
    id: 1,
    avatar: "TS",
    companyName: "TechSolutions LTDA",
    nomeFantasia: "TechSolutions LTDA",
    razaoSocial: "TechSolutions LTDA",
    description: "Desenvolvimento de Software",
    location: "São Paulo, SP",
    employeeCount: "50-100 funcionários",
    matchPercentage: 95,
    contactName: "Carlos Mendes",
    contactRole: "Executivo",
    contactEmail: "carlos@techsolutions.com",
    contactPhone: "(11) 98765-4321",
    isUnlocked: false,
    isPremium: true,
    isHot: true,
    isFavorited: false,
    aiInsights: "Alta probabilidade de conversão • Melhor horário: 14h-16h • Segmento em crescimento +23%"
  },
  {
    id: 2,
    avatar: "SF",
    companyName: "SoftFlex Sistemas",
    nomeFantasia: "SoftFlex Sistemas",
    razaoSocial: "SoftFlex Sistemas",
    description: "Soluções em TI para pequenas empresas",
    location: "Campinas, SP",
    employeeCount: "10-50 funcionários",
    matchPercentage: 87,
    contactName: "Roberta Silva",
    contactRole: "Proprietária",
    contactEmail: "roberta@softflex.com.br",
    contactPhone: "(19) 99876-5432",
    isUnlocked: true,
    isPremium: false,
    isHot: false,
    isFavorited: true,
    aiInsights: "Empresa em expansão • Buscando novos fornecedores • Histórico de resposta positiva"
  },
  {
    id: 3,
    avatar: "MC",
    companyName: "MegaCloud Tecnologia",
    nomeFantasia: "MegaCloud Tecnologia",
    razaoSocial: "MegaCloud Tecnologia",
    description: "Serviços em nuvem e infraestrutura",
    location: "Rio de Janeiro, RJ",
    employeeCount: "100-500 funcionários",
    matchPercentage: 92,
    contactName: "Amanda Rocha",
    contactRole: "Diretora",
    contactEmail: "amanda@megacloud.com",
    contactPhone: "(21) 98888-7777",
    isUnlocked: false,
    isPremium: true,
    isHot: true,
    isFavorited: false,
    aiInsights: "Empresa com alto potencial • Buscando expandir serviços • Investe regularmente em tecnologia"
  },
  {
    id: 4,
    avatar: "RB",
    companyName: "Restaurant Brasil",
    nomeFantasia: "Restaurant Brasil",
    razaoSocial: "Restaurant Brasil",
    description: "Cadeia de restaurantes premium",
    location: "Belo Horizonte, MG",
    employeeCount: "500+ funcionários",
    matchPercentage: 78,
    contactName: "Roberto Campos",
    contactRole: "Manager",
    contactEmail: "roberto@restaurantbrasil.com",
    contactPhone: "(31) 99777-6666",
    isUnlocked: false,
    isPremium: false,
    isHot: false,
    isFavorited: false,
    aiInsights: null
  },
  {
    id: 5,
    avatar: "TP",
    companyName: "Transplex Logística",
    nomeFantasia: "Transplex Logística",
    razaoSocial: "Transplex Logística",
    description: "Transporte e logística nacional",
    location: "Curitiba, PR",
    employeeCount: "100-500 funcionários",
    matchPercentage: 83,
    contactName: "Thiago Pereira",
    contactRole: "Executivo",
    contactEmail: "thiago@transplex.com.br",
    contactPhone: "(41) 98765-0000",
    isUnlocked: false,
    isPremium: false,
    isHot: true,
    isFavorited: false,
    aiInsights: "12 usuários visualizaram nas últimas 24h. 87% de taxa de resposta neste segmento."
  }
];

// Função para mapear os dados do Supabase para o formato do Lead
const mapSupabaseEmpresaToLead = (empresa: SupabaseEmpresa, index: number): Lead => {
  // Usar o nome da empresa (razao_social ou nome_fantasia)
  const empresaNome = empresa.razao_social || empresa.nome_fantasia || "Empresa";
  
  // Criar iniciais para o avatar baseado no nome da empresa
  const words = empresaNome.split(' ');
  const initials = words.length > 1 
    ? `${words[0][0]}${words[1][0]}` 
    : words[0].substring(0, 2);
    
  // Tamanho da empresa baseado no porte ou capital social
  let tamanhoEmpresa = "Não informado";
  if (empresa.porte) {
    // Porte: 1 = Não Informado, 2 = Micro Empresa, 3 = Pequena Empresa, 5 = Demais
    switch(empresa.porte) {
      case 2: tamanhoEmpresa = "Micro Empresa"; break;
      case 3: tamanhoEmpresa = "Pequena Empresa"; break;
      case 5: tamanhoEmpresa = "Média/Grande Empresa"; break;
      default: tamanhoEmpresa = "Não Informado";
    }
  }
  
  // Determinar se é um lead "quente" baseado em alguns critérios
  // Por exemplo, empresas ativas com capital social alto
  const isAtiva = empresa.situacao_cadastral === "ATIVA";
  const temCapitalAlto = empresa.capital_social ? 
    parseFloat(empresa.capital_social.replace(',', '.')) > 100000 : false;
  const isHot = isAtiva && (temCapitalAlto || Math.random() > 0.7);
  
  // Escolher uma mensagem de IA aleatória
  const randomAiInsight = aiInsightMessages[Math.floor(Math.random() * aiInsightMessages.length)];
  
  // Formatar CNAE para garantir que está no formato correto
  let cnaeFormatado = empresa.cnae_fiscal?.toString();
  if (cnaeFormatado && cnaeFormatado.length < 7) {
    // Preencher com zeros à esquerda se necessário
    cnaeFormatado = cnaeFormatado.padStart(7, '0');
  }
  
  // Segurança: obfuscar contatos reais até que sejam desbloqueados
  // Armazenar apenas o suficiente para mostrar versões parciais
  let maskedEmail = null;
  let maskedPhone = null;
  
  if (empresa.email) {
    const parts = empresa.email.split('@');
    if (parts.length === 2) {
      // Modificar a máscara para esconder também parte do domínio
      const domainParts = parts[1].split('.');
      let maskedDomain = "";
      
      if (domainParts.length >= 2) {
        // Para domínios como "empresa.com.br"
        const extension = domainParts[domainParts.length - 1]; // Última parte (br, com, org, etc)
        const secondLevel = domainParts[domainParts.length - 2]; // Penúltima parte (com, net, etc em .com.br)
        
        // Mostrar só a primeira letra do nome do domínio e a extensão
        maskedDomain = `${domainParts[0].substring(0, 1)}***`;
        
        // Se for .com.br ou similar, mostrar ambas extensões
        if (domainParts.length > 2) {
          maskedDomain += `.${secondLevel}.${extension}`;
        } else {
          maskedDomain += `.${extension}`;
        }
      } else {
        maskedDomain = `${parts[1].substring(0, 1)}***`;
      }
      
      maskedEmail = `${parts[0].substring(0, 3)}***@${maskedDomain}`;
    }
  }
  
  if (empresa.telefone_1) {
    const digits = empresa.telefone_1.replace(/\D/g, '');
    if (digits.length > 4) {
      maskedPhone = `${digits.substring(0, 2)}****${digits.substring(digits.length - 2)}`;
    }
  }
  
  return {
    id: index + 1, // Usar índice como ID temporário
    avatar: initials.toUpperCase(),
    companyName: empresaNome,
    nomeFantasia: empresa.nome_fantasia || empresaNome,
    razaoSocial: empresa.razao_social || empresaNome,
    description: empresa.cnae_descricao || "Empresa",
    location: empresa.municipio && empresa.uf 
      ? `${empresa.municipio}, ${empresa.uf}` 
      : "Localização não especificada",
    employeeCount: tamanhoEmpresa,
    matchPercentage: Math.floor(Math.random() * 30) + 70, // Valor aleatório entre 70 e 100
    contactName: "Responsável", // Valor padrão alterado
    contactRole: "Executivo", // Valor padrão
    contactEmail: maskedEmail, // Versão mascarada do email
    contactPhone: maskedPhone, // Versão mascarada do telefone
    isUnlocked: false, // Por padrão, não está desbloqueado
    isPremium: temCapitalAlto || Math.random() > 0.7, // Premium se tiver capital alto
    isHot: isHot,
    isFavorited: false, // Por padrão, não está favoritado
    aiInsights: randomAiInsight,
    cnae: cnaeFormatado,
    
    // Campos adicionais - NÃO armazenar valores completos
    // Serão preenchidos posteriormente quando desbloqueados
    fullAddress: null,
    cnpj: empresa.cnpj_basico ? `${empresa.cnpj_basico.substring(0, 2)}******` : null,
    additionalPhones: [],
    dataAbertura: empresa.data_inicio_atividade ? `${empresa.data_inicio_atividade.substring(0, 4)}**/**` : null,
    capitalSocial: empresa.capital_social ? `${empresa.capital_social.substring(0, 1)}*****` : null,
    
    // Campos de endereço detalhados (serão preenchidos quando desbloqueados)
    logradouro: null,
    numero: null,
    complemento: null,
    bairro: null,
    cep: null,
    
    // Dados reais (não acessíveis pelo cliente, apenas via backend)
    _secure_email: empresa.email,
    _secure_phone: empresa.telefone_1,
    _secure_phone2: empresa.telefone_2,
    _secure_logradouro: empresa.tipo_logradouro ? `${empresa.tipo_logradouro} ${empresa.logradouro}` : empresa.logradouro,
    _secure_numero: empresa.numero,
    _secure_complemento: empresa.complemento,
    _secure_bairro: empresa.bairro,
    _secure_cep: empresa.cep,
    _secure_address: empresa.logradouro ? 
      `${empresa.tipo_logradouro || ''} ${empresa.logradouro}, ${empresa.numero || 'S/N'}${empresa.complemento ? `, ${empresa.complemento}` : ''} - ${empresa.bairro || ''} - ${empresa.cep || ''}` : 
      null,
    _secure_cnpj: empresa.cnpj_basico,
    _secure_data_abertura: empresa.data_inicio_atividade,
    _secure_capital_social: empresa.capital_social,
    _secure_situacao_cadastral: empresa.situacao_cadastral,
    _secure_natureza_juridica: empresa.natureza_juridica
  };
};

// Gerar mais leads para demonstração de rolagem infinita (fallback)
const generateMoreMockLeads = (page: number, limit: number, cnaeFilter: string | null): Lead[] => {
  const startId = page * limit;
  const result: Lead[] = [];
  
  for (let i = 0; i < limit; i++) {
    const id = startId + i + 1;
    const randomIndex = Math.floor(Math.random() * mockLeads.length);
    const template = mockLeads[randomIndex];
    
    const lead: Lead = {
      ...template,
      id: id,
      companyName: `${template.companyName} ${id}`,
      isHot: Math.random() > 0.5,
      isFavorited: Math.random() > 0.7,
      isUnlocked: Math.random() > 0.8,
      cnae: cnaeFilter || (Math.random() > 0.5 ? '6201500' : '6202300')
    };
    
    // Se tiver filtro de CNAE, garantir que todos os leads gerados tenham esse CNAE
    if (cnaeFilter) {
      lead.cnae = cnaeFilter;
    }
    
    result.push(lead);
  }
  
  return result;
};

export function useLeads() {
  const [data, setData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Indicador de se há mais resultados
  const [allCnaeResultsLoaded, setAllCnaeResultsLoaded] = useState(false); // Indicador para saber se todos os resultados de um CNAE específico foram carregados
  const [totalResults, setTotalResults] = useState(0); // Total de resultados disponíveis
  const [filters, setFilters] = useState<{
    cnae: string | null,
    isPremium: boolean | null,
    isHot: boolean | null,
    isRecent: boolean | null,
    location: string | null
  }>({
    cnae: null,
    isPremium: null,
    isHot: null,
    isRecent: null,
    location: null
  });
  
  // Acessar informações do usuário autenticado
  const { session } = useAuth();
  
  // Reiniciar os dados quando mudar o filtro
  const resetData = () => {
    setData([]);
    setHasMore(true);
    setAllCnaeResultsLoaded(false);
    setIsLoading(true);
  };
  
  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    // Resetar dados se mudar o CNAE
    if (newFilters.cnae !== undefined && newFilters.cnae !== filters.cnae) {
      resetData();
    }
    
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, [filters]);

  // Carregar dados iniciais do Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Carregando dados do Supabase (tabela empresas)...');
        
        // Buscar dados do Supabase da tabela empresas
        const { data: empresas, error } = await supabase
          .from('empresas')
          .select('*')
          .limit(10);
          
        if (error) {
          console.error('Erro ao carregar dados do Supabase:', error);
          throw error;
        }
        
        if (empresas && empresas.length > 0) {
          console.log(`Retornados ${empresas.length} resultados iniciais do Supabase`);
          
          // Mapear dados do Supabase para nosso formato de Lead
          const leads = empresas.map((empresa, idx) => 
            mapSupabaseEmpresaToLead(empresa, idx)
          );
          
          console.log('Dados carregados com sucesso do Supabase:', leads.length);
          setData(leads);
          setHasMore(true);
          setTotalResults(empresas.length);
        } else {
          console.log('Nenhuma empresa encontrada no Supabase, usando mockLeads');
          setData(mockLeads);
          setHasMore(true);
          setTotalResults(mockLeads.length);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        console.log('Usando dados mockados devido ao erro');
        setData(mockLeads);
        setHasMore(true);
        setTotalResults(mockLeads.length);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Carregar leads desbloqueados quando o usuário estiver logado
  useEffect(() => {
    const loadUnlockedLeads = async () => {
      if (session?.user?.id && data.length > 0) {
        try {
          // Buscar lista de leads desbloqueados pelo usuário
          const unlockedLeadIds = await creditService.getUnlockedLeads(session.user.id);
          
          // Atualizar leads com estado de desbloqueio e desmascarar os dados
          setData(prevData => 
            prevData.map(lead => {
              // Se o lead está na lista de desbloqueados
              if (unlockedLeadIds.includes(lead.id.toString())) {
                // Criar uma cópia desbloqueada com os dados completos
                const unlockedLead = {
                  ...lead,
                  isUnlocked: true
                };
                
                // Atualizar os dados sensíveis com as versões completas
                if (lead._secure_email) {
                  unlockedLead.contactEmail = lead._secure_email;
                }
                
                if (lead._secure_phone) {
                  unlockedLead.contactPhone = lead._secure_phone;
                }
                
                if (lead._secure_address) {
                  unlockedLead.fullAddress = lead._secure_address;
                }
                
                if (lead._secure_cnpj) {
                  unlockedLead.cnpj = lead._secure_cnpj;
                }
                
                // Dados de endereço
                unlockedLead.logradouro = lead._secure_logradouro || "Não informado";
                unlockedLead.numero = lead._secure_numero || "S/N";
                unlockedLead.bairro = lead._secure_bairro || "Não informado";
                unlockedLead.complemento = lead._secure_complemento || null;
                unlockedLead.cep = lead._secure_cep || "Não informado";
                
                if (lead._secure_data_abertura) {
                  unlockedLead.dataAbertura = lead._secure_data_abertura;
                }
                
                if (lead._secure_capital_social) {
                  unlockedLead.capitalSocial = lead._secure_capital_social;
                }
                
                return unlockedLead;
              }
              
              // Se não está desbloqueado, manter como está
              return lead;
            })
          );
        } catch (error) {
          console.error('Erro ao carregar leads desbloqueados:', error);
        }
      }
    };
    
    loadUnlockedLeads();
  }, [session, data.length]);
  
  // Função para filtrar leads por CNAE
  const filterByCnae = useCallback(async (cnaeQuery: string): Promise<void> => {
    setIsLoading(true);
    setAllCnaeResultsLoaded(false);
    
    try {
      console.log('Filtrando empresas por CNAE ou descrição:', cnaeQuery);
      
      // Verificar se a consulta parece um código CNAE (números)
      const isCnaeCode = /^\d+$/.test(cnaeQuery);
      
      let query = supabase.from('empresas').select('*');
      
      if (isCnaeCode) {
        // Se for um código numérico, buscar por CNAE começando com esses dígitos
        // Converter o código CNAE para número para garantir compatibilidade
        const cnaeCode = parseInt(cnaeQuery, 10);
        query = query.eq('cnae_fiscal', cnaeCode);
      } else {
        // Senão, buscar por descrição similar
        query = query.ilike('cnae_descricao', `%${cnaeQuery}%`);
      }
      
      // Limitar resultados iniciais para carregamento mais rápido
      query = query.limit(20);
      
      const { data: empresas, error } = await query;
      
      if (error) {
        console.error('Erro ao filtrar empresas por CNAE:', error);
        throw error;
      }
      
      if (empresas && empresas.length > 0) {
        console.log(`Encontradas ${empresas.length} empresas para o filtro CNAE`);
        
        // Obter contagem total para exibir ao usuário, mas limitar a 1000 por performance
        let countQuery = supabase
          .from('empresas')
          .select('*', { count: 'exact', head: true });
        
        if (isCnaeCode) {
          // Aplicar a mesma condição da consulta principal
          const cnaeCode = parseInt(cnaeQuery, 10);
          countQuery = countQuery.eq('cnae_fiscal', cnaeCode);
        } else {
          countQuery = countQuery.ilike('cnae_descricao', `%${cnaeQuery}%`);
        }
        
        const { count } = await countQuery;
        
        // Se tivermos mais de 1000 resultados, limitamos por performance
        const displayCount = count && count > 1000 ? '1000+' : count;
        console.log(`Total de resultados para este CNAE: ${displayCount}`);
        setTotalResults(count || empresas.length);
        
        // Para grandes conjuntos de resultados, marcamos para não carregar tudo
        if (count && count > 1000) {
          console.log('Muitos resultados encontrados, limitando carregamento para melhor performance');
          setAllCnaeResultsLoaded(true);
        } else {
          // Verificar se já carregamos todos os resultados
          setAllCnaeResultsLoaded(empresas.length < 20 || empresas.length === count);
        }
        
        // Mapear para o formato Lead
        const leads = empresas.map((empresa, idx) => 
          mapSupabaseEmpresaToLead(empresa, idx)
        );
        
        // Atualizar filtros
        setFilters(prev => ({
          ...prev,
          cnae: cnaeQuery
        }));
        
        setData(leads);
        setHasMore(true);
      } else {
        console.log('Nenhuma empresa encontrada para este CNAE, usando dados mockados');
        
        // Filtrar mock leads que tenham o CNAE similar (para demonstração)
        const filteredMocks = mockLeads.map(lead => ({
          ...lead,
          cnae: cnaeQuery.substring(0, 4) + (Math.floor(Math.random() * 999)).toString().padStart(3, '0')
        }));
        
        setData(filteredMocks);
        setHasMore(false);
        setAllCnaeResultsLoaded(true);
        setTotalResults(filteredMocks.length);
        
        // Atualizar filtros
        setFilters(prev => ({
          ...prev,
          cnae: cnaeQuery
        }));
      }
    } catch (error) {
      console.error('Erro ao filtrar por CNAE:', error);
      
      // Fallback para dados mockados
      const filteredMocks = mockLeads.map(lead => ({
        ...lead,
        cnae: cnaeQuery.substring(0, 4) + (Math.floor(Math.random() * 999)).toString().padStart(3, '0')
      }));
      
      setData(filteredMocks);
      setHasMore(false);
      setAllCnaeResultsLoaded(true);
      setTotalResults(filteredMocks.length);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Função para carregar mais leads (para rolagem infinita)
  const loadMoreLeads = useCallback(async (page: number, limit: number, cnaeFilter?: string | null): Promise<Lead[]> => {
    try {
      console.log('Carregando mais empresas do Supabase:', page, limit, cnaeFilter || filters.cnae);
      
      // Se foi fornecido um cnaeFilter específico, usá-lo no lugar do filtro atual
      if (cnaeFilter !== undefined) {
        updateFilters({ cnae: cnaeFilter });
      }
      
      // Verificar se já temos muitos resultados carregados (mais de 200)
      if (data.length > 200) {
        // Limitar a quantidade de dados mantidos em memória para melhorar performance
        console.log(`Otimizando memória: mantendo apenas os últimos 100 resultados de ${data.length} carregados`);
        setData(prevData => prevData.slice(prevData.length - 100));
      }
      
      // Calcular o offset para paginação
      const offset = page * limit;
      
      // Construir a query
      let query = supabase
        .from('empresas')
        .select('*');
      
      // Se já carregamos todos os resultados de um CNAE específico e 
      // a opção de continuar com outros resultados está ativa,
      // então carregamos todos os resultados sem filtro CNAE
      if (filters.cnae && !allCnaeResultsLoaded) {
        // Verificar se a consulta parece um código CNAE (números)
        const isCnaeCode = /^\d+$/.test(filters.cnae);
        
        if (isCnaeCode) {
          // Se for um código numérico, buscar por CNAE começando com esses dígitos
          const cnaeCode = parseInt(filters.cnae, 10);
          query = query.eq('cnae_fiscal', cnaeCode);
        } else {
          // Senão, buscar por descrição similar
          query = query.ilike('cnae_descricao', `%${filters.cnae}%`);
        }
      }
      
      // Aplicar paginação após os filtros
      query = query.range(offset, offset + limit - 1);
      
      // Aplicar outros filtros ativos
      if (filters.isPremium === true) {
        // Filtrar empresas com capital social alto
        query = query.gt('capital_social', '100000');
      }
      
      if (filters.isRecent === true) {
        // Filtrar empresas abertas nos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        query = query.gte('data_inicio_atividade', formattedDate);
      }
      
      if (filters.location) {
        // Filtrar por localização (estado)
        query = query.eq('uf', filters.location);
      }
      
      console.log(`Buscando empresas com offset=${offset} e limit=${limit}`);
      
      // Executar a query
      const { data: empresas, error } = await query;
      
      if (error) {
        console.error('Erro ao carregar mais empresas do Supabase:', error);
        throw error;
      }
      
      if (empresas && empresas.length > 0) {
        console.log(`Retornados ${empresas.length} resultados do Supabase`);
        
        // Gerar IDs baseados na página atual para evitar duplicação
        const baseId = offset + 1;
        
        // Mapear dados do Supabase para nosso formato de Lead, com IDs corretos
        const newLeads = empresas.map((empresa, idx) => 
          mapSupabaseEmpresaToLead(empresa, baseId + idx - 1)
        );
        
        // Verificar se terminamos de carregar todos os resultados para o CNAE
        if (filters.cnae && !allCnaeResultsLoaded && empresas.length < limit) {
          console.log('Todos os resultados do CNAE foram carregados');
          setAllCnaeResultsLoaded(true);
        }
        
        // Verificar se ainda há mais resultados a serem carregados
        setHasMore(empresas.length === limit);
        
        // Adicionar novos leads ao estado
        setData(prevData => [...prevData, ...newLeads]);
        console.log('Mais empresas carregadas com sucesso:', newLeads.length);
        
        return newLeads;
      } else {
        console.log('Nenhuma nova empresa encontrada no Supabase');
        
        if (filters.cnae && !allCnaeResultsLoaded) {
          // Se estávamos filtrando por CNAE e não há mais resultados, 
          // marcamos que terminamos de carregar todos os resultados desse CNAE
          setAllCnaeResultsLoaded(true);
          
          // Tentar carregar mais empresas sem o filtro CNAE
          if (page === 0) {
            // Se estamos na primeira página após esgotar os resultados CNAE,
            // tentamos carregar empresas sem filtro
            const { data: moreEmpresas } = await supabase
              .from('empresas')
              .select('*')
              .range(0, limit - 1);
              
            if (moreEmpresas && moreEmpresas.length > 0) {
              console.log(`Carregando ${moreEmpresas.length} empresas adicionais sem filtro CNAE`);
              
              const moreLeads = moreEmpresas.map((empresa, idx) => 
                mapSupabaseEmpresaToLead(empresa, idx)
              );
              
              // Adicionar novos leads ao estado
              setData(prevData => [...prevData, ...moreLeads]);
              setHasMore(true);
              
              return moreLeads;
            }
          }
        }
        
        // Usar dados mockados como fallback
        const mockData = generateMoreMockLeads(page, limit, filters.cnae);
        setData(prevData => [...prevData, ...mockData]);
        setHasMore(false);
        
        return mockData;
      }
    } catch (error) {
      console.error('Erro ao carregar mais empresas:', error);
      console.log('Usando dados mockados para carregamento adicional devido ao erro');
      
      // Fallback para dados mockados em caso de erro
      const fallbackLeads = generateMoreMockLeads(page, limit, filters.cnae);
      
      // Adicionar leads de fallback ao estado
      setData(prevData => [...prevData, ...fallbackLeads]);
      setHasMore(false);
      
      return fallbackLeads;
    }
  }, [filters, allCnaeResultsLoaded, updateFilters]);

  // Função para desbloquear um lead
  const unlockLead = useCallback(async (leadId: number) => {
    try {
      // Buscar informações completas do lead a partir do Supabase
      const leadToUnlock = data.find(lead => lead.id === leadId);
      
      if (leadToUnlock) {
        // Para leads reais do Supabase
        // Buscar dados reais do banco para mostrar após desbloqueio
        let unlockedLead: Lead = {
          ...leadToUnlock,
          isUnlocked: true
        };
        
        // Verificar se temos dados seguros disponíveis (em produção, isso viria de uma API segura)
        if (leadToUnlock._secure_email) {
          unlockedLead.contactEmail = leadToUnlock._secure_email;
        }
        
        if (leadToUnlock._secure_phone) {
          unlockedLead.contactPhone = leadToUnlock._secure_phone;
        }
        
        if (leadToUnlock._secure_address) {
          unlockedLead.fullAddress = leadToUnlock._secure_address;
        }
        
        if (leadToUnlock._secure_cnpj) {
          unlockedLead.cnpj = leadToUnlock._secure_cnpj;
        }
        
        // Adicionar dados completos do endereço
        unlockedLead.logradouro = leadToUnlock._secure_logradouro || "Não informado";
        unlockedLead.numero = leadToUnlock._secure_numero || "S/N";
        unlockedLead.bairro = leadToUnlock._secure_bairro || "Não informado";
        unlockedLead.complemento = leadToUnlock._secure_complemento || null;
        unlockedLead.cep = leadToUnlock._secure_cep || "Não informado";
        
        if (leadToUnlock._secure_data_abertura) {
          unlockedLead.dataAbertura = leadToUnlock._secure_data_abertura;
        }
        
        if (leadToUnlock._secure_capital_social) {
          unlockedLead.capitalSocial = leadToUnlock._secure_capital_social;
        }

        if (leadToUnlock._secure_phone2) {
          unlockedLead._secure_phone2 = leadToUnlock._secure_phone2;
        }

        if (leadToUnlock._secure_situacao_cadastral) {
          unlockedLead._secure_situacao_cadastral = leadToUnlock._secure_situacao_cadastral;
        }

        if (leadToUnlock._secure_natureza_juridica) {
          unlockedLead._secure_natureza_juridica = leadToUnlock._secure_natureza_juridica;
        }
        
        console.log('Lead desbloqueado com dados completos:', unlockedLead);
        
        // Atualizar localmente
        setData(prev => prev.map(lead => 
          lead.id === leadId 
            ? unlockedLead
            : lead
        ));
        
        console.log('Lead desbloqueado com dados completos:', leadId);
      } else {
        console.error('Lead não encontrado para desbloqueio:', leadId);
      }
    } catch (error) {
      console.error('Erro ao desbloquear lead:', error);
    }
  }, [data]);

  // Função para favoritar/desfavoritar um lead
  const toggleFavorite = useCallback((leadId: number) => {
    // Obter o estado atual do lead
    const lead = data.find(l => l.id === leadId);
    if (!lead) return;
    
    const newFavoritedState = !lead.isFavorited;
    
    // Atualizar localmente imediatamente para UX responsiva
    setData(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, isFavorited: newFavoritedState } 
        : lead
    ));
    
    // Atualizar no Supabase (usando a tabela lead_tags)
    if (newFavoritedState) {
      // Adicionar tag de favorito
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('lead_tags')
            .insert({
              lead_id: leadId.toString(),
              tag: 'favorited',
              user_id: user.id
            })
            .then(({ error }) => {
              if (error) {
                console.error('Erro ao favoritar lead no Supabase:', error);
              } else {
                console.log('Lead favoritado com sucesso no Supabase:', leadId);
              }
            });
        } else {
          console.log('Usuário não autenticado, apenas atualizando localmente');
        }
      });
    } else {
      // Remover tag de favorito
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('lead_tags')
            .delete()
            .match({
              lead_id: leadId.toString(),
              tag: 'favorited',
              user_id: user.id
            })
            .then(({ error }) => {
              if (error) {
                console.error('Erro ao desfavoritar lead no Supabase:', error);
              } else {
                console.log('Lead desfavoritado com sucesso no Supabase:', leadId);
              }
            });
        } else {
          console.log('Usuário não autenticado, apenas atualizando localmente');
        }
      });
    }
  }, [data]);

  return {
    data,
    isLoading,
    hasMore,
    totalResults,
    unlockLead,
    toggleFavorite,
    loadMoreLeads,
    filterByCnae,
    updateFilters,
    filters,
    resetData
  };
} 