
/**
 * Calculate the SHA-256 hash of a file
 */
export async function calculateSHA256(file: File): Promise<string> {
  // Read the file as an ArrayBuffer
  const buffer = await file.arrayBuffer();
  
  // Use the Web Crypto API to calculate the hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  
  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get a file's extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Determine if a file is potentially executable
 */
export function isExecutableFile(filename: string): boolean {
  const execExtensions = ['exe', 'dll', 'bat', 'cmd', 'msi', 'ps1', 'vbs', 'js', 'sh', 'bin', 'app'];
  const extension = getFileExtension(filename).toLowerCase();
  return execExtensions.includes(extension);
}

/**
 * Get a generic file type based on extension
 */
export function getFileType(filename: string): string {
  const extension = getFileExtension(filename).toLowerCase();
  
  // Document types
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'].includes(extension)) {
    return 'document';
  }
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return 'image';
  }
  
  // Executable types
  if (isExecutableFile(filename)) {
    return 'executable';
  }
  
  // Archive types
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
    return 'archive';
  }
  
  // Code/script types
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'php', 'py', 'java', 'c', 'cpp'].includes(extension)) {
    return 'code';
  }
  
  return 'other';
}

/**
 * Get icon for file type (using data from getFileType)
 */
export function getFileIcon(fileType: string): string {
  switch (fileType) {
    case 'document':
      return 'file-text';
    case 'image':
      return 'image';
    case 'executable':
      return 'terminal';
    case 'archive':
      return 'archive';
    case 'code':
      return 'code';
    default:
      return 'file';
  }
}
