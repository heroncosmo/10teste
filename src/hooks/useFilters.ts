import { useState, useCallback } from 'react';
import { states } from '@/data/states';

export interface Filters {
  uf: string;
  cidade: string;
  cnae: string;
  porte: string;
}

export interface UseFiltersReturn {
  filters: Filters;
  updateFilter: (name: keyof Filters, value: string) => void;
  clearFilters: () => void;
  states: typeof states;
}

const initialFilters: Filters = {
  uf: '',
  cidade: '',
  cnae: '',
  porte: ''
};

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilter = useCallback((name: keyof Filters, value: string) => {
    setFilters(prev => {
      // Se mudar o UF, limpa a cidade
      if (name === 'uf') {
        return {
          ...prev,
          [name]: value,
          cidade: ''
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    updateFilter,
    clearFilters,
    states
  };
} 