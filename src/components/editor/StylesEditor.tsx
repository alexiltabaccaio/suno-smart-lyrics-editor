import React from 'react';
import { ChevronDown, Library, RefreshCw } from 'lucide-react';
import { FormattedTextarea } from '../FormattedTextarea';

interface StylesEditorProps {
  styles: string;
}

export const StylesEditor: React.FC<StylesEditorProps> = ({ styles }) => {
  return (
    <div className="bg-[#18181b] rounded-xl p-4 flex flex-col gap-3">
      <button className="flex items-center gap-2 font-medium text-[15px] cursor-default">
        <ChevronDown className="w-4 h-4 text-zinc-100" />
        Styles
      </button>
      
      <div className="relative flex flex-col min-h-[120px]">
        <FormattedTextarea 
          value={styles}
          onChange={() => {}} // Disabled
          readOnly={true}
          placeholder="hard rock, slowed, clear male vocal, 90-100 bpm, heavy guitar riffs"
          minHeight="120px"
        />
        <div className="flex items-center gap-2 mt-auto pt-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button className="text-zinc-500 cursor-default shrink-0 mr-2">
            <Library className="w-4 h-4" />
          </button>
          <button className="p-2 bg-zinc-800/80 rounded-full cursor-default shrink-0 mr-1">
            <RefreshCw className="w-4 h-4 text-zinc-300" />
          </button>
          <span className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 cursor-default">
            hard rock
          </span>
          <span className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 cursor-default">
            slowed
          </span>
          <span className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 cursor-default">
            clear male vocal
          </span>
        </div>
      </div>
    </div>
  );
};
