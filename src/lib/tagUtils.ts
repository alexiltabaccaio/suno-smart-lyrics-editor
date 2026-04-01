
export const STRUCTURE_TAGS = [
  'Intro', 
  'Verse', 
  'Pre-Chorus', 
  'Chorus', 
  'Post-Chorus', 
  'Hook', 
  'Bridge', 
  'Solo',
  'Instrumental', 
  'Outro'
];

export const INSTRUMENT_TAGS = [
  'Guitar', 'Piano', 'Synthesizer', 
  'Drum', 'Bass', 'String', 'Horn', 'Sax', 'Trumpet'
];

export const isStructureTag = (tag: string) => {
  if (!tag.startsWith('[')) return false;
  const content = tag.replace(/[\[\]]/g, '').trim().toLowerCase();
  if (!content) return false;
  
  // Use word boundaries to avoid matching things like "universe" for "verse"
  return STRUCTURE_TAGS.some(t => {
    const term = t.toLowerCase();
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    return regex.test(content);
  });
};

export const isInstrumentTag = (tag: string) => {
  if (!tag.startsWith('[')) return false;
  const content = tag.replace(/[\[\]]/g, '').trim().toLowerCase();
  if (!content) return false;
  
  return INSTRUMENT_TAGS.some(t => {
    const term = t.toLowerCase();
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    return regex.test(content);
  });
};

export const getNextTag = (currentTag: string, direction: 'next' | 'prev'): string => {
  const content = currentTag.replace(/[\[\]]/g, '').trim().toLowerCase();
  
  // Find exact match first
  let currentIndex = STRUCTURE_TAGS.findIndex(t => t.toLowerCase() === content);
  
  // If no exact match, look for a base tag within the custom tag (e.g., "slow chorus" -> "Chorus")
  if (currentIndex === -1) {
    currentIndex = STRUCTURE_TAGS.findIndex(t => {
      const term = t.toLowerCase();
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      return regex.test(content);
    });
  }
  
  // If still no match, don't change it
  if (currentIndex === -1) return currentTag;

  const nextIndex = direction === 'next' 
    ? (currentIndex + 1) % STRUCTURE_TAGS.length
    : (currentIndex - 1 + STRUCTURE_TAGS.length) % STRUCTURE_TAGS.length;
  
  // Always return a properly closed tag
  return `[${STRUCTURE_TAGS[nextIndex]}]`;
};

export const getSuggestedNextTag = (allTags: string[]): string => {
  if (allTags.length === 0) return 'Verse';
  
  const lastTag = allTags[allTags.length - 1].toLowerCase();
  
  // Count occurrences of main structure tags to identify the pattern
  const verseCount = allTags.filter(t => /\bverse\b/i.test(t)).length;
  const chorusCount = allTags.filter(t => /\bchorus\b/i.test(t)).length;
  
  // Logic based on the requested progression:
  // Verse -> Chorus -> Verse -> Chorus -> Bridge -> Outro
  
  const hasTag = (tag: string, term: string) => new RegExp(`\\b${term}\\b`, 'i').test(tag);

  if (hasTag(lastTag, 'outro')) return 'Outro';
  if (hasTag(lastTag, 'bridge')) return 'Outro';
  if (hasTag(lastTag, 'solo')) return 'Chorus';
  
  if (hasTag(lastTag, 'chorus')) {
    // If we've already had 2 verses and 2 choruses, suggest Bridge
    if (verseCount >= 2 && chorusCount >= 2) {
      return 'Bridge';
    }
    return 'Verse';
  }
  
  if (hasTag(lastTag, 'verse')) {
    return 'Chorus';
  }
  
  // Fallback for other tags
  if (hasTag(lastTag, 'intro')) return 'Verse';
  if (hasTag(lastTag, 'pre-chorus')) return 'Chorus';
  if (hasTag(lastTag, 'post-chorus')) return 'Verse';
  if (hasTag(lastTag, 'hook')) return 'Chorus';
  
  return 'Verse';
};
