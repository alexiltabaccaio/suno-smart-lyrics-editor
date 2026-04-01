
import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface InteractiveToolbarProps {
  lineIdx: number;
  lineParts: { part: string; index: number; isTag: boolean }[];
  showArrows: boolean;
  showPlus: boolean;
  isFocused: boolean;
  isInserting: boolean;
  onCycle: (partIndex: number, direction: 'next' | 'prev') => void;
  onSmartInsert?: () => void;
  setIsInserting: (val: boolean) => void;
  isStructureTag: (tag: string) => boolean;
}

export const InteractiveToolbar: React.FC<InteractiveToolbarProps> = ({
  lineIdx,
  lineParts,
  showArrows,
  showPlus,
  isFocused,
  isInserting,
  onCycle,
  onSmartInsert,
  setIsInserting,
  isStructureTag,
}) => {
  const structureTag = lineParts.find(p => p.isTag && isStructureTag(p.part));

  return (
    <div key={lineIdx} className="relative w-full min-h-[24px] box-border">
      {/* Invisible text layer for layout alignment */}
      <div className="whitespace-pre-wrap break-words pointer-events-none">
        {lineParts.length === 0 && <span className="text-transparent">&#8203;</span>}
        {lineParts.map(({ part, index }) => (
          <span key={`${lineIdx}-${index}`} className="text-transparent">{part}</span>
        ))}
      </div>
      
      {/* Toolbar */}
      <div className="absolute right-0 top-0 h-[24px] flex items-center gap-1 pointer-events-none pr-1">
        {structureTag && (
          <div className={`flex items-center gap-0.5 mr-1 border-r border-zinc-800 pr-1 ${showArrows ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button 
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onCycle(structureTag.index, 'prev'); }}
              className="hover:text-white text-zinc-500 p-1 rounded-sm"
              title="Previous section"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onCycle(structureTag.index, 'next'); }}
              className="hover:text-white text-zinc-500 p-1 rounded-sm"
              title="Next section"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {onSmartInsert && (
          <button
            onMouseDown={(e) => {
              if (isInserting) return;
              e.preventDefault();
              e.stopPropagation();
              setIsInserting(true);
              onSmartInsert();
            }}
            disabled={isInserting}
            className={`w-5 h-5 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 shadow-sm ${showPlus ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} ${isInserting ? 'cursor-wait' : ''}`}
            title="Smart Insert Section"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
