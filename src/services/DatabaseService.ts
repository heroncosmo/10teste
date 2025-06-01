import { supabase } from '@/integrations/supabase/client';

export interface Company {
  cnpj: string;
  razao_social: string | null;
  nome_fantasia: string | null;
  cnae_fiscal: string | null;
  cnae_descricao: string | null;
  municipio: string | null;
  uf: string | null;
  data_inicio_atividade: string | null;
  logradouro: string | null;
  tipo_logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  telefone_1: string | null;
  telefone_2: string | null;
  email: string | null;
  situacao_cadastral: string | null;
}

// Interface para parâmetros de busca
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  uf?: string;
  cidade?: string;
  cnae?: string;
  porte?: string;
  cursor?: string;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
}

interface CompaniesResponse {
  companies: Company[];
  total: number;
  totalPages: number;
  currentPage: number;
  has_more?: boolean;
  execution_time?: number;
  mockData?: boolean;
  fromCache?: boolean;
}

class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async getCompanies(params: SearchParams = {}): Promise<CompaniesResponse> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Iniciar consulta Supabase
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' });
      
      // Adicionar filtros de busca
      if (params.search) {
        query = query.or(
          `razao_social.ilike.%${params.search}%,nome_fantasia.ilike.%${params.search}%,cnpj_basico.ilike.%${params.search}%,municipio.ilike.%${params.search}%`
        );
      }
      
      // Filtros específicos
      if (params.uf) {
        query = query.eq('uf', params.uf);
      }
      
      if (params.cidade) {
        query = query.eq('municipio', params.cidade);
      }
      
      if (params.cnae) {
        // Verifique se o cnae precisa ser convertido para número ou mantido como string
        // dependendo de como está armazenado no banco de dados
        const cnaeValue = params.cnae;
        query = query.ilike('cnae_fiscal', `%${cnaeValue}%`);
      }
      
      // Ordenação
      if (params.order_by) {
        query = query.order(params.order_by, { 
          ascending: params.order_dir === 'asc'
        });
      } else {
        query = query.order('razao_social', { ascending: true });
      }
      
      // Aplicar paginação
      query = query.range(from, to);
      
      // Executar consulta
      const { data, error, count } = await query;
      
      if (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }
      
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Mapear dados para o formato Company
      const companies = data.map(item => ({
        cnpj: item.cnpj_basico ? String(item.cnpj_basico) : '',
        razao_social: item.razao_social,
        nome_fantasia: item.nome_fantasia,
        cnae_fiscal: item.cnae_fiscal ? String(item.cnae_fiscal) : null,
        cnae_descricao: item.cnae_descricao,
        municipio: item.municipio,
        uf: item.uf,
        data_inicio_atividade: item.data_inicio_atividade,
        logradouro: item.logradouro,
        tipo_logradouro: item.tipo_logradouro,
        numero: item.numero,
        complemento: item.complemento,
        bairro: item.bairro,
        cep: item.cep,
        telefone_1: item.telefone_1,
        telefone_2: item.telefone_2,
        email: item.email,
        situacao_cadastral: item.situacao_cadastral
      }));
      
      return {
        companies,
        total: totalCount,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error(`Failed to get companies:`, error);
      throw error;
    }
  }
}

export const databaseService = DatabaseService.getInstance(); 