import React from 'react';
import { Building, Info } from 'lucide-react';
import { useSelection } from '@/hooks/useSelection';
import { Lead } from '@/hooks/useLeads';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CompanySelectorProps {
  leads: Lead[];
  selectedCount: number;
  onSendBulkMessage: () => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  leads,
  selectedCount,
  onSendBulkMessage
}) => {
  const { toggleSelection, isSelected, selectAll, clearSelection } = useSelection();

  const handleSelectAll = () => {
    selectAll(leads.map(lead => lead.id));
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Seleção de Empresas</h2>
        <p className="text-xs text-gray-500 mt-1">
          Selecione empresas para envio em massa
        </p>
      </div>
      
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <button 
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Selecionar todas
        </button>
        <button 
          onClick={clearSelection}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          Limpar seleção
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {leads.map(lead => (
          <div 
            key={lead.id}
            className={`p-2 border-b border-gray-100 flex items-center ${isSelected(lead.id) ? 'bg-green-50' : 'hover:bg-gray-50'}`}
          >
            <input 
              type="checkbox" 
              className="h-4 w-4 mr-2 text-blue-600 rounded" 
              checked={isSelected(lead.id)}
              onChange={() => toggleSelection(lead.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-gray-800">
                {lead.companyName}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Building className="h-3 w-3 mr-1" />
                {lead.description}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <Info className="h-3 w-3 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {lead.location} • {lead.employeeCount}
                        {lead.cnae && <><br/>CNAE: {lead.cnae}</>}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 mb-2">
          {selectedCount} empresas selecionadas
        </div>
        <button
          onClick={onSendBulkMessage}
          disabled={selectedCount === 0}
          className={`w-full py-2 px-3 rounded text-sm font-medium ${
            selectedCount > 0
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Enviar mensagem em massa
        </button>
      </div>
    </div>
  );
};

export default CompanySelector; 