import cnaesData from '@/data/cnaes.json';

interface CNAE {
  code: string;
  description: string;
}

class CNAEService {
  private cnaes: CNAE[] = [];

  constructor() {
    // Converter os dados do JSON para o formato que precisamos
    this.cnaes = cnaesData.cnaes.map(cnae => ({
      code: cnae.codigo,
      description: cnae.descricao
    }));
  }

  searchCNAEs(term: string): CNAE[] {
    if (!term) return this.cnaes;
    
    const searchTerm = term.toLowerCase();
    return this.cnaes.filter(cnae => 
      cnae.code.includes(searchTerm) || 
      cnae.description.toLowerCase().includes(searchTerm)
    );
  }

  getAllCNAEs(): CNAE[] {
    return this.cnaes;
  }
}

export const cnaeService = new CNAEService();
export type { CNAE }; 