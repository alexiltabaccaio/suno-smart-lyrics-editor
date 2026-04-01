import { useCallback, RefObject } from 'react';
import { getNextTag } from '../lib/tagUtils';

export function useTagCycling(
  value: string,
  onChange: (value: string) => void,
  setCursorPos: (pos: number) => void,
  internalRef: RefObject<HTMLTextAreaElement>
) {
  return useCallback((partIndex: number, direction: 'next' | 'prev') => {
    const textarea = internalRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    const parts = value.split(/(\[[^\]\[\n]*\]?|\([^)\n]*\)?)/g);
    const oldTag = parts[partIndex];
    
    let tagStartIndex = 0;
    for (let i = 0; i < partIndex; i++) {
      tagStartIndex += parts[i].length;
    }

    const newTag = getNextTag(oldTag, direction);
    if (newTag === oldTag) return;

    const lengthDiff = newTag.length - oldTag.length;
    parts[partIndex] = newTag;
    const newValue = parts.join('');

    let newStart = startPos;
    let newEnd = endPos;

    // If the cursor is currently at the end of the document (which happens when value changes externally)
    // OR if the cursor is at 0 (which happens when we reset it after generating a song)
    // we should try to keep it near the tag we just edited
    if (startPos === value.length || startPos === 0) {
      newStart = tagStartIndex + newTag.length;
      newEnd = tagStartIndex + newTag.length;
    } else if (startPos >= tagStartIndex + oldTag.length) {
      newStart += lengthDiff;
      newEnd += lengthDiff;
    } else if (startPos > tagStartIndex) {
      newStart = Math.min(newStart, tagStartIndex + newTag.length);
      newEnd = Math.min(newEnd, tagStartIndex + newTag.length);
    }
    
    setCursorPos(newStart);
    onChange(newValue);

    // Update DOM immediately to prevent flicker
    textarea.value = newValue;
    textarea.setSelectionRange(newStart, newEnd);
    textarea.focus({ preventScroll: true });
    
    // Use setTimeout to ensure selection is set after React re-renders
    setTimeout(() => {
      if (internalRef.current) {
        internalRef.current.setSelectionRange(newStart, newEnd);
      }
    }, 0);
  }, [value, onChange, setCursorPos, internalRef]);
}
