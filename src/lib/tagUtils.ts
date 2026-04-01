
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
  if (!tag.startsWith('[') || !tag.endsWith(']')) return false;
  const content = tag.replace(/[\[\]]/g, '').trim().toLowerCase();
  if (!content) return false;
  return STRUCTURE_TAGS.some(t => content.includes(t.toLowerCase()));
};

export const isInstrumentTag = (tag: string) => {
  const content = tag.replace(/[\[\]]/g, '').trim().toLowerCase();
  return INSTRUMENT_TAGS.some(t => t.toLowerCase() === content);
};

export const getNextTag = (currentTag: string, direction: 'next' | 'prev'): string => {
  const content = currentTag.replace(/[\[\]]/g, '').trim().toLowerCase();
  const isClosed = currentTag.endsWith(']');
  
  // Find exact match first
  let currentIndex = STRUCTURE_TAGS.findIndex(t => t.toLowerCase() === content);
  
  // If no exact match, look for a base tag within the custom tag (e.g., "slow chorus" -> "Chorus")
  if (currentIndex === -1) {
    currentIndex = STRUCTURE_TAGS.findIndex(t => content.includes(t.toLowerCase()));
  }
  
  // If still no match, don't change it
  if (currentIndex === -1) return currentTag;

  const nextIndex = direction === 'next' 
    ? (currentIndex + 1) % STRUCTURE_TAGS.length
    : (currentIndex - 1 + STRUCTURE_TAGS.length) % STRUCTURE_TAGS.length;
  
  return `[${STRUCTURE_TAGS[nextIndex]}${isClosed ? ']' : ''}`;
};

export const getSuggestedNextTag = (allTags: string[]): string => {
  if (allTags.length === 0) return 'Verse';
  
  const lastTag = allTags[allTags.length - 1].toLowerCase();
  
  // Count occurrences of main structure tags to identify the pattern
  const verseCount = allTags.filter(t => t.toLowerCase().includes('verse')).length;
  const chorusCount = allTags.filter(t => t.toLowerCase().includes('chorus')).length;
  
  // Logic based on the requested progression:
  // Verse -> Chorus -> Verse -> Chorus -> Bridge -> Outro
  
  if (lastTag.includes('outro')) return 'Outro';
  if (lastTag.includes('bridge')) return 'Outro';
  if (lastTag.includes('solo')) return 'Chorus';
  
  if (lastTag.includes('chorus')) {
    // If we've already had 2 verses and 2 choruses, suggest Bridge
    if (verseCount >= 2 && chorusCount >= 2) {
      return 'Bridge';
    }
    return 'Verse';
  }
  
  if (lastTag.includes('verse')) {
    return 'Chorus';
  }
  
  // Fallback for other tags
  if (lastTag.includes('intro')) return 'Verse';
  if (lastTag.includes('pre-chorus')) return 'Chorus';
  if (lastTag.includes('post-chorus')) return 'Verse';
  if (lastTag.includes('hook')) return 'Chorus';
  
  return 'Verse';
};
