import React from 'react';
import { Palette, X } from 'lucide-react';

interface EditorGuideProps {
  formattingMode: 'none' | 'simple' | 'colored';
  onClose: () => void;
}

export const EditorGuide: React.FC<EditorGuideProps> = ({
  formattingMode,
  onClose
}) => {
  const isColored = formattingMode === 'colored';
  const isNone = formattingMode === 'none';

  return (
    <div 
      className="absolute left-0 top-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
      style={{
        paddingLeft: '14px',
        width: '222px',
        paddingTop: '7px',
        paddingRight: '16px',
        marginLeft: '30px',
        marginTop: '-27px',
        paddingBottom: '16px',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Legend</span>
        <button 
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3 text-[13px]">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isColored ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : !isNone ? 'bg-zinc-100' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 font-medium">Structure</span>
          <span className={`ml-auto font-mono text-[11px] px-2 py-0.5 rounded ${!isNone ? '[text-shadow:0_0_1px_currentColor,0_0_1px_currentColor]' : ''} ${
            isColored 
              ? 'text-cyan-400 bg-cyan-400/10' 
              : !isNone ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400'
          }`}>[Verse]</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isColored ? 'bg-pink-500 shadow-[0_0_8_px_rgba(236,72,153,0.4)]' : !isNone ? 'bg-zinc-100' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 font-medium">Prompts</span>
          <span className={`ml-auto font-mono text-[11px] px-2 py-0.5 rounded ${
            isColored 
              ? 'text-pink-400 bg-pink-400/10' 
              : !isNone ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400'
          }`}>[Guitar]</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-zinc-300 font-medium">Vocal Cues</span>
          <span className="ml-auto font-mono text-[11px] px-2 py-0.5 text-zinc-400">(Chorus)</span>
        </div>
      </div>
    </div>
  );
};
