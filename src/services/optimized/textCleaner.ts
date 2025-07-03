
export class OptimizedTextCleaner {
  private static readonly MARKDOWN_PATTERNS = [
    [/\*\*(.*?)\*\*/g, '$1'],           // **bold**
    [/\*(.*?)\*/g, '$1'],               // *italic*
    [/#{1,6}\s*/g, ''],                 // headers
    [/`([^`]*)`/g, '$1'],               // inline code
    [/\[([^\]]*)\]\([^)]*\)/g, '$1'],   // links
    [/•\s*/g, ''],                      // bullet points
    [/\-\s*/g, ''],                     // dashes
    [/\d+\.\s*/g, '']                   // numbered lists
  ] as const;

  static fastClean(text: string): string {
    if (!text || text.length < 10) return text;
    
    let cleaned = text;
    
    // Apply patterns in batch for speed
    for (const patternData of this.MARKDOWN_PATTERNS) {
      const [pattern, replacement] = patternData;
      cleaned = cleaned.replace(pattern, replacement);
    }
    
    // Quick whitespace cleanup
    return cleaned
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  static minimalClean(text: string): string {
    // Ultra-fast cleaning for real-time use
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/•\s*/g, '')
      .replace(/#{1,6}\s*/g, '')
      .trim();
  }

  static technicalFormat(text: string): string {
    // Convert to technical specification format
    return this.fastClean(text)
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s*[\-•]\s*/gm, '')
      .trim();
  }
}
