import { useState, useCallback, RefObject, MouseEvent } from 'react';

export function useTextareaLineTracker(
  readOnly: boolean, 
  value: string,
  interactiveLayerRef: RefObject<HTMLDivElement>
) {
  const [hoverLineIdx, setHoverLineIdx] = useState(-1);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top + e.currentTarget.scrollTop;
    
    if (interactiveLayerRef.current) {
      const children = interactiveLayerRef.current.children;
      let currentY = 0;
      let foundLineIdx = -1;
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const height = child.offsetHeight;
        if (y >= currentY && y < currentY + height) {
          foundLineIdx = i;
          break;
        }
        currentY += height;
      }
      
      // If y is beyond the last child, it might be hovering below the text
      if (foundLineIdx === -1 && children.length > 0 && y >= currentY) {
        foundLineIdx = children.length - 1;
      }
      
      if (foundLineIdx !== -1 && foundLineIdx !== hoverLineIdx) {
        setHoverLineIdx(foundLineIdx);
      }
    } else {
      // Fallback to simple math if ref is not available
      const linesCount = value.split('\n').length;
      const targetLineIdx = Math.floor(y / 24);
      const finalLineIdx = Math.min(Math.max(0, targetLineIdx), linesCount - 1);
      
      if (finalLineIdx !== hoverLineIdx) {
        setHoverLineIdx(finalLineIdx);
      }
    }
  }, [hoverLineIdx, readOnly, value, interactiveLayerRef]);

  const handleMouseLeave = useCallback(() => {
    setHoverLineIdx(-1);
  }, []);

  return { hoverLineIdx, handleMouseMove, handleMouseLeave };
}
