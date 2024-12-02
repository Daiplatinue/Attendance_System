export function isValidTimestamp(timestamp: string | number): boolean {
    if (!timestamp) return false;
    
    try {
      if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
        const excelEpoch = new Date(1900, 0, 1);
        const days = typeof timestamp === 'number' ? timestamp : Number(timestamp);
        const date = new Date(excelEpoch.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
        return !isNaN(date.getTime());
      }
      
      const date = new Date(timestamp);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }