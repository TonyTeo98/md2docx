/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - The text to copy
 * @returns Promise<boolean> - Whether the copy was successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Clipboard API failed, using fallback:', err);
    }
    // Fallback for older browsers / denied permissions
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const success = document.execCommand('copy');
      return success;
    } catch (fallbackErr) {
      if (import.meta.env.DEV) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
