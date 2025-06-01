import { useRef, useState } from "react";
import { SelectItem } from "@/components/ui/select";
import type { CNAE } from "@/services/CNAEService";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CNAEsListProps {
  cnaes: CNAE[];
  value?: string;
  currentSelection?: string | null;
  onSelect?: (code: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const formatCNAECode = (code: string) => {
  // Formata o código CNAE para o padrão XX.XX-X
  if (code.length === 7) {
    return `${code.slice(0, 2)}.${code.slice(2, 4)}-${code.slice(4)}`;
  }
  return code;
};

const ITEM_HEIGHT = 50; // Aumentado para acomodar 2 linhas

const CNAEsList = ({ 
  cnaes, 
  value, 
  currentSelection,
  onSelect,
  searchTerm = "",
  onSearchChange
}: CNAEsListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

  // Use currentSelection se estiver disponível, caso contrário use value
  const selectedCnaeCode = currentSelection || value;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setInternalSearchTerm(newTerm);
    
    if (onSearchChange) {
      onSearchChange(newTerm);
    }
  };

  const handleSelectCNAE = (code: string) => {
    if (onSelect) {
      onSelect(code);
    }
  };

  const virtualizer = useVirtualizer({
    count: cnaes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  // Encontrar o CNAE selecionado
  const selectedCNAE = cnaes.find(cnae => cnae.code === selectedCnaeCode);

  return (
    <div className="space-y-2">
      {/* Barra de pesquisa */}
      <div className="p-2 border-b">
        <Input
          type="text"
          placeholder="Buscar CNAE..."
          value={onSearchChange ? searchTerm : internalSearchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      {/* Mostrar detalhes do CNAE selecionado */}
      {selectedCNAE && (
        <div className="p-3 bg-blue-50 rounded-md text-sm space-y-1 border border-blue-100 mx-2">
          <div className="font-medium text-blue-800 flex items-center justify-between">
            <span>{formatCNAECode(selectedCNAE.code)}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-700">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    O código CNAE (Classificação Nacional de Atividades Econômicas) identifica a atividade econômica principal da empresa.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm text-blue-700">{selectedCNAE.description}</div>
        </div>
      )}

      {/* Lista virtualizada */}
      <div ref={parentRef} className="h-[300px] overflow-auto rounded-md border">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const cnae = cnaes[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${virtualItem.start}px)`,
                  width: '100%',
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`h-[50px] py-2 px-3 cursor-pointer hover:bg-gray-100 ${selectedCnaeCode === cnae.code ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                        onClick={() => handleSelectCNAE(cnae.code)}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="font-medium text-sm">
                            {formatCNAECode(cnae.code)}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-1">
                            {cnae.description}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{cnae.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mostrar quantidade de resultados */}
      <div className="text-xs text-gray-500 text-right px-2 pb-2">
        {cnaes.length} resultados encontrados
      </div>
    </div>
  );
};

export default CNAEsList; 