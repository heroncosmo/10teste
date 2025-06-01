import { useRef } from "react";
import { SelectItem } from "@/components/ui/select";
import { useVirtualizer } from "@tanstack/react-virtual";

interface CitiesListProps {
  cities: string[];
}

const ITEM_HEIGHT = 35; // Altura estimada de cada item em pixels

const CitiesList = ({ cities }: CitiesListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: cities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5, // Número de itens para pré-carregar acima/abaixo da área visível
  });

  return (
    <div ref={parentRef} className="h-[200px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const city = cities[virtualItem.index];
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
              <SelectItem value={city || "no-city"}>
                {city || "Cidade não especificada"}
              </SelectItem>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitiesList; 