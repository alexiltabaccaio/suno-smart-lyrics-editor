import React from 'react';
import { ChevronDown, Info, Trash2, Wand2, Library, Maximize2, Type, Highlighter, Palette } from 'lucide-react';
import { FormattedTextarea, FormattedTextareaRef } from '../FormattedTextarea';
import { EditorGuide } from '../EditorGuide';

interface LyricsEditorProps {
  lyrics: string;
  setLyrics: (val: string) => void;
  lyricsRef: React.RefObject<FormattedTextareaRef>;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  formattingMode: 'none' | 'simple' | 'colored';
  setFormattingMode: (val: 'none' | 'simple' | 'colored') => void;
  showInfo: boolean;
  setShowInfo: (val: boolean) => void;
  onGenerateSong: () => void;
  onSmartInsert: (lineIdx?: number) => void;
}

export const LyricsEditor: React.FC<LyricsEditorProps> = ({
  lyrics,
  setLyrics,
  lyricsRef,
  isExpanded,
  setIsExpanded,
  formattingMode,
  setFormattingMode,
  showInfo,
  setShowInfo,
  onGenerateSong,
  onSmartInsert
}) => {
  return (
    <div className="bg-[#18181b] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-medium text-[15px] text-zinc-100 cursor-default">
            <ChevronDown className="w-4 h-4" />
            Lyrics
          </div>
          <div className="relative flex items-center gap-1">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`p-1 rounded-md ${showInfo ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Legend"
            >
              <Info className="w-4 h-4" />
            </button>
            
            <div className="flex items-center ml-1 bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800/50">
              <button
                onClick={() => setFormattingMode('none')}
                className={`p-1 rounded-md ${formattingMode === 'none' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="Plain text"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFormattingMode('simple')}
                className={`p-1 rounded-md ${formattingMode === 'simple' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="B&W Formatting"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFormattingMode('colored')}
                className={`p-1 rounded-md ${formattingMode === 'colored' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="Color formatting"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            </div>

            {showInfo && (
              <EditorGuide 
                formattingMode={formattingMode}
                onClose={() => setShowInfo(false)}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLyrics('')}
            disabled={lyrics.length === 0}
            className={`p-2 rounded-full ${
              lyrics.length > 0 
                ? 'bg-zinc-800/80 text-zinc-400 hover:bg-red-500/20 hover:text-red-400' 
                : 'bg-zinc-800/40 text-zinc-600 cursor-default'
            }`}
            title="Clear lyrics"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onGenerateSong}
            className="p-2 bg-zinc-800/80 rounded-full hover:bg-zinc-700 cursor-pointer"
            title="Generate random song"
          >
            <Wand2 className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
      
      <div className="relative flex flex-col" style={{ minHeight: isExpanded ? '400px' : '140px' }}>
        <FormattedTextarea 
          ref={lyricsRef}
          value={lyrics}
          onChange={setLyrics}
          onSmartInsert={onSmartInsert}
          formattingMode={formattingMode}
          placeholder="Write some lyrics or a prompt — or leave blank for instrumental"
          minHeight={isExpanded ? "400px" : "140px"}
        />
        <div className="flex items-center justify-between mt-auto pt-2">
          <button className="text-zinc-500 cursor-default shrink-0">
            <Library className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-full hover:bg-zinc-700 ${isExpanded ? 'bg-zinc-700' : 'bg-zinc-800/80'}`}
          >
            <Maximize2 className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
