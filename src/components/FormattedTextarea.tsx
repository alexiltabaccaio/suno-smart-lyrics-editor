import React, { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { isStructureTag } from '../lib/tagUtils';
import { TagBackdrop } from './textarea/TagBackdrop';
import { InteractiveToolbar } from './textarea/InteractiveToolbar';
import { useTextareaLineTracker } from '../hooks/useTextareaLineTracker';
import { useTagCycling } from '../hooks/useTagCycling';

export interface FormattedTextareaRef {
  setCursorPos: (pos: number) => void;
  focus: () => void;
  setSelectionRange: (start: number, end: number) => void;
  updateAndSelect: (newValue: string, pos: number) => void;
  selectionStart: number;
  selectionEnd: number;
  value: string;
}

export interface FormattedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSmartInsert?: (lineIdx?: number) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
  formattingMode?: 'none' | 'simple' | 'colored';
}

export const FormattedTextarea = forwardRef<FormattedTextareaRef, FormattedTextareaProps>(
  ({ value, onChange, onSmartInsert, placeholder, minHeight = "140px", readOnly = false, formattingMode = 'colored' }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const interactiveLayerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isInserting, setIsInserting] = useState(false);

  const { hoverLineIdx, handleMouseMove, handleMouseLeave } = useTextareaLineTracker(readOnly, value, interactiveLayerRef);
  const handleCycle = useTagCycling(value, onChange, setCursorPos, internalRef);

  useImperativeHandle(ref, () => ({
    setCursorPos: (pos: number) => setCursorPos(pos),
    focus: () => internalRef.current?.focus({ preventScroll: true }),
    setSelectionRange: (start: number, end: number) => internalRef.current?.setSelectionRange(start, end),
    updateAndSelect: (newValue: string, pos: number) => {
      if (internalRef.current) {
        internalRef.current.value = newValue;
        internalRef.current.focus({ preventScroll: true });
        internalRef.current.setSelectionRange(pos, pos);
      }
      setCursorPos(pos);
    },
    get selectionStart() { return internalRef.current?.selectionStart ?? 0; },
    get selectionEnd() { return internalRef.current?.selectionEnd ?? 0; },
    get value() { return internalRef.current?.value ?? ""; }
  }));

  const updateCursorPos = () => {
    if (internalRef.current && document.activeElement === internalRef.current) {
      setCursorPos(internalRef.current.selectionStart);
    }
  };

  useEffect(() => {
    if (isInserting) {
      const timer = setTimeout(() => setIsInserting(false), 50);
      return () => clearTimeout(timer);
    }
  }, [isInserting]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateCursorPos);
    return () => document.removeEventListener('selectionchange', updateCursorPos);
  }, []);

  const interactiveElements = useMemo(() => {
    const parts = value ? value.split(/(\[[^\]\[\n]*\]?|\([^)\n]*\)?)/g) : [];
    const lines: { part: string; index: number; isTag: boolean }[][] = [[]];
    
    parts.forEach((part, index) => {
      if (part.startsWith('[') || part.startsWith('(')) {
        lines[lines.length - 1].push({ part, index, isTag: part.startsWith('[') });
      } else {
        const subParts = part.split('\n');
        subParts.forEach((sub, i) => {
          if (i > 0) lines.push([]);
          lines[lines.length - 1].push({ part: sub, index, isTag: false });
        });
      }
    });

    const textBeforeCursor = value.substring(0, cursorPos);
    const activeLineIndex = textBeforeCursor.split('\n').length - 1;
    
    const displayLineIdx = hoverLineIdx !== -1 
      ? Math.min(hoverLineIdx, lines.length - 1) 
      : activeLineIndex;

    let activeTagLineIdx = -1;
    if (displayLineIdx !== -1) {
      for (let i = displayLineIdx; i >= 0; i--) {
        const hasTag = lines[i]?.some(p => p.isTag && isStructureTag(p.part));
        if (hasTag) {
          activeTagLineIdx = i;
          break;
        }
      }
    }

    return lines.map((lineParts, lineIdx) => {
      const isHoveredLine = displayLineIdx !== -1 && lineIdx === displayLineIdx;
      const isTagLine = displayLineIdx !== -1 && lineIdx === activeTagLineIdx;
      
      const showArrows = !readOnly && isTagLine;
      
      const isLineEmpty = lineParts.every(p => p.part.trim() === "");
      const isDocEmpty = value.trim() === "";

      // Show plus on the tag line, OR on the hovered line if no tags exist yet AND it's not a "ghost" empty line
      // (We allow it on the first line, or if the line has content, or if it's the current cursor line)
      // Special case: if the document is empty, always show on the first line
      const showPlus = !readOnly && (
        isTagLine || 
        (isDocEmpty && lineIdx === 0) ||
        (activeTagLineIdx === -1 && isHoveredLine && (lineIdx === 0 || !isLineEmpty || lineIdx === activeLineIndex))
      );

      return (
        <div key={lineIdx} className="relative group/line">
          <InteractiveToolbar
            lineIdx={lineIdx}
            lineParts={lineParts}
            showArrows={showArrows}
            showPlus={showPlus}
            isFocused={isFocused}
            isInserting={isInserting}
            onCycle={handleCycle}
            onSmartInsert={() => {
              internalRef.current?.focus({ preventScroll: true });
              onSmartInsert?.(lineIdx);
            }}
            setIsInserting={setIsInserting}
            isStructureTag={isStructureTag}
          />
        </div>
      );
    });
  }, [value, cursorPos, isFocused, isInserting, onSmartInsert, hoverLineIdx, readOnly, handleCycle]);

  return (
    <div 
      className="relative w-full flex-grow flex flex-col cursor-text" 
      style={{ minHeight }}
    >
      <div 
        className="relative flex-grow overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative min-h-full" style={{ minHeight }}>
          
          {/* Backdrop for highlighting */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none whitespace-pre-wrap break-words text-[15px] leading-[24px] p-0 overflow-hidden text-zinc-100 select-none font-sans z-0"
            aria-hidden="true"
          >
            <TagBackdrop 
              value={value} 
              placeholder={placeholder} 
              isFocused={isFocused} 
              formattingMode={formattingMode}
            />
          </div>
          
          {/* Actual Textarea */}
          <textarea
            ref={internalRef}
            value={value}
            readOnly={readOnly}
            onChange={(e) => {
              if (readOnly) return;
              onChange(e.target.value);
              updateCursorPos();
            }}
            onFocus={() => !readOnly && setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSelect={updateCursorPos}
            onKeyUp={updateCursorPos}
            onClick={updateCursorPos}
            spellCheck={false}
            className={`absolute inset-0 w-full h-full bg-transparent resize-none outline-none border-0 m-0 text-[15px] leading-[24px] p-0 text-transparent ${readOnly ? 'caret-transparent' : 'caret-zinc-100'} placeholder:text-transparent whitespace-pre-wrap break-words font-sans overflow-hidden z-10`}
            placeholder={placeholder}
          />

          {/* Interactive Layer for Arrows (Defines height) */}
          <div
            ref={interactiveLayerRef}
            className="w-full whitespace-pre-wrap break-words text-[15px] leading-[24px] p-0 select-none font-sans pointer-events-none relative z-20"
          >
            {interactiveElements}
          </div>

        </div>
      </div>
    </div>
  );
});

FormattedTextarea.displayName = 'FormattedTextarea';
