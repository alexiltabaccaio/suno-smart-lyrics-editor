import { RefObject, useCallback } from 'react';
import { getSuggestedNextTag, isStructureTag } from '../lib/tagUtils';
import { FormattedTextareaRef } from '../components/FormattedTextarea';

export function useSmartInsert(
  value: string,
  onChange: (val: string) => void,
  textareaRef: RefObject<FormattedTextareaRef | null>
) {
  return useCallback((lineIdx?: number) => {
    const textarea = textareaRef.current;
    
    // Determine the insertion point
    let insertPos: number;
    if (lineIdx !== undefined) {
      const lines = value.split('\n');
      
      // Special case: if we are on the first line and there are no structure tags in the document yet,
      // we should insert at the very beginning (pos 0) to "tag" the existing text.
      const hasAnyTags = value.match(/\[([^\]]+)\]/g)?.some(t => isStructureTag(t));
      if (lineIdx === 0 && !hasAnyTags) {
        insertPos = 0;
      } else {
        // Find the end of the current section (until the next structure tag starts or EOF)
        let endLineIdx = lineIdx + 1;
        while (endLineIdx < lines.length) {
          const line = lines[endLineIdx].trim();
          if (line.startsWith('[') && isStructureTag(line)) {
            break;
          }
          endLineIdx++;
        }
        // Calculate character position at the end of the section
        insertPos = lines.slice(0, endLineIdx).join('\n').length;
      }
    } else {
      insertPos = textarea?.selectionStart ?? value.length;
    }

    const textBeforeInsert = value.substring(0, insertPos);

    const insertStructure = (tag: string) => {
      // Clean up the 'before' part to remove trailing newlines
      let before = value.substring(0, insertPos).trimEnd();
      const after = value.substring(insertPos).trimStart();

      // Add exactly one blank line before the tag if there is content
      const prefix = before.length > 0 ? '\n\n' : '';
      
      // Add exactly one blank line after the tag (two newlines)
      // This ensures:
      // [Tag]
      // (Cursor line)
      // (Next content)
      // If the user wants an empty line below the cursor, they can press enter or we can add one more \n
      // The user diagram showed:
      // [Verse]
      // | <- Cursor
      // | <- Empty line
      // [Chorus]
      // This requires 3 newlines total after the tag.
      const tagText = `${prefix}[${tag}]\n\n\n`;
      const newText = before + tagText + after;
      
      // Cursor should be placed on the line immediately after the tag
      // +3 accounts for: [ (1), ] (1), and the first \n (1)
      const newCursorPos = before.length + prefix.length + tag.length + 3; 
      
      if (textarea) {
        textarea.updateAndSelect(newText, newCursorPos);
      }
      
      onChange(newText);
    };

    if (!textBeforeInsert.trim()) {
      insertStructure('Verse');
      return;
    }

    const tagsBefore = textBeforeInsert.match(/\[([^\]]+)\]/g);
    if (!tagsBefore || tagsBefore.length === 0) {
      insertStructure('Verse');
      return;
    }

    insertStructure(getSuggestedNextTag(tagsBefore));
  }, [value, onChange, textareaRef]);
}
