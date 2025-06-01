import { useState } from 'react';

export function useSelection() {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  const toggleSelection = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId) 
        : [...prev, leadId]
    );
  };

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  const isSelected = (leadId: number) => {
    return selectedLeads.includes(leadId);
  };

  const selectAll = (leadIds: number[]) => {
    setSelectedLeads(leadIds);
  };

  const selectedCount = selectedLeads.length;

  return {
    selectedLeads,
    toggleSelection,
    clearSelection,
    isSelected,
    selectAll,
    selectedCount
  };
} 