import React from 'react';
import { ChevronRight, Music, Folder } from 'lucide-react';

interface SongMetadataProps {
  title: string;
}

export const SongMetadata: React.FC<SongMetadataProps> = ({ title }) => {
  return (
    <>
      {/* More Options */}
      <button className="w-full flex items-center gap-2 bg-[#18181b] rounded-xl p-4 font-medium cursor-default text-[15px]">
        <ChevronRight className="w-4 h-4 text-zinc-100" />
        More Options
      </button>

      {/* Song Title */}
      <div className="flex items-center gap-3 bg-[#18181b] rounded-xl p-4">
        <Music className="w-4 h-4 text-zinc-100" />
        <input 
          type="text" 
          value={title}
          readOnly // Disabled
          placeholder="Song Title (Optional)" 
          className="bg-transparent outline-none text-[15px] placeholder:text-zinc-500 w-full cursor-default"
        />
      </div>

      {/* Save to */}
      <div className="flex items-center justify-between bg-[#18181b] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Folder className="w-4 h-4 text-zinc-100 fill-zinc-100" />
          <span className="text-[15px] font-medium">Save to...</span>
        </div>
        <button className="bg-zinc-800/80 px-4 py-1.5 rounded-full text-sm font-medium cursor-default text-zinc-200">
          My Workspace
        </button>
      </div>
    </>
  );
};
