/**
 * Advanced ANSI and terminal control sequence cleaner
 */

export class AnsiCleaner {
  /**
   * Remove all ANSI escape sequences and terminal control characters
   */
  static cleanOutput(input: string): string {
    if (!input) return '';
    
    let cleaned = input;
    
    // Remove ANSI escape sequences - comprehensive patterns
    const ansiPatterns = [
      // Standard ANSI escape sequences
      /\x1b\[[0-9;]*[A-Za-z]/g,
      // Color sequences with 38;2; (truecolor)  
      /\x1b\[38;2;[\d;]+m/g,
      // Color sequences with 48;2; (background truecolor)
      /\x1b\[48;2;[\d;]+m/g,
      // OSC sequences (Operating System Command)
      /\x1b\][^\x07]*\x07/g,
      // CSI sequences (Control Sequence Introducer)
      /\x1b\[[\x30-\x3F]*[\x20-\x2F]*[\x40-\x7E]/g,
      // DCS sequences (Device Control String)
      /\x1bP[^\x1b]*\x1b\\/g,
      // SOS sequences (Start of String)
      /\x1bX[^\x1b]*\x1b\\/g,
      // PM sequences (Privacy Message)
      /\x1b\^[^\x1b]*\x1b\\/g,
      // APC sequences (Application Program Command)
      /\x1b_[^\x1b]*\x1b\\/g,
      // Simple color codes
      /\x1b\[\d+(;\d+)*m/g,
      // Cursor movement
      /\x1b\[\d*[ABCDHJ]/g,
      // Clear sequences
      /\x1b\[[\dK]*/g,
      // Other escape sequences
      /\x1b[\[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-ntqry=><]/g,
      // Remaining color fragments like ";2;252;207;8m"
      /;2;\d+;\d+;\d+m/g,
      // Numeric color fragments
      /\d+;\d+;\d+m/g,
      /\d+m/g,
    ];
    
    // Apply all patterns
    for (const pattern of ansiPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }
    
    // Remove control characters except useful ones
    cleaned = cleaned.replace(/[\x00-\x1f\x7f]/g, (char) => {
      return char === '\n' || char === '\t' ? char : '';
    });
    
    // Clean up box drawing and special characters for UI prompts
    cleaned = cleaned
      .replace(/[╭╮╯╰─│]/g, '') // Remove box drawing characters
      .replace(/●/g, '') // Remove bullet points
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/\s*\n\s*\n\s*/g, '\n') // Normalize multiple newlines
      .replace(/^\s+|\s+$/g, '') // Trim
      .replace(/^\n+|\n+$/g, ''); // Remove leading/trailing newlines
    
    return cleaned;
  }
  
  /**
   * Extract meaningful content from CLI output
   */
  static extractContent(input: string): string {
    const cleaned = this.cleanOutput(input);
    
    // Skip empty or very short content
    if (cleaned.length < 3) return '';
    
    // Skip UI prompts and system messages
    const skipPatterns = [
      /do you want to connect/i,
      /vs code/i,
      /\[y\/n\]/i,
      /loading/i,
      /tips for getting started/i,
      /ask questions/i,
      /no sandbox/i,
      /qwen3-coder/i,
      /context left/i,
      /main\*/i,
    ];
    
    for (const pattern of skipPatterns) {
      if (pattern.test(cleaned)) return '';
    }
    
    return cleaned;
  }
}
