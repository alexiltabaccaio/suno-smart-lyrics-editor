
import React from 'react';
import { isStructureTag, isInstrumentTag } from '../../lib/tagUtils';

interface TagBackdropProps {
  value: string;
  placeholder?: string;
  isFocused: boolean;
  formattingMode?: 'none' | 'simple' | 'colored';
}

export const TagBackdrop: React.FC<TagBackdropProps> = ({ value, placeholder, isFocused, formattingMode = 'colored' }) => {
  if (!value) {
    return <span className="text-zinc-500 leading-[24px]">{placeholder}</span>;
  }

  if (formattingMode === 'none') {
    return <span className="leading-[24px]">{value}</span>;
  }
  
  const parts = value.split(/(\[[^\]\[\n]*\]?|\([^)\n]*\)?)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[')) {
          const isStructure = isStructureTag(part);
          const shouldBeBold = isStructure;
          
          let textColor = 'text-zinc-100';
          if (formattingMode === 'colored') {
            if (isStructure) textColor = 'text-cyan-400';
            else textColor = 'text-pink-400'; // All prompt tags (instruments and style)
          }

          return (
            <span 
              key={i} 
              className={`
                ${textColor}
                ${shouldBeBold ? '[text-shadow:0_0_1px_currentColor,0_0_1px_currentColor]' : ''}
                bg-zinc-800/80 rounded-sm leading-[24px]
              `}
            >
              {part}
            </span>
          );
        }
        if (part.startsWith('(')) {
          return (
            <span key={i} className="text-zinc-400 leading-[24px]">
              {part}
            </span>
          );
        }
        return <span key={i} className="leading-[24px]">{part}</span>;
      })}
    </>
  );
};
