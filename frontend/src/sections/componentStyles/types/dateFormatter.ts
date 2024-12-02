export function formatTimestamp(timestamp: string | number): string {
  if (!timestamp) {
    return 'No attendance taken yet';
  }

  try {
    // Handle Excel numeric timestamps (days since 1900-01-01)
    let date: Date;
    
    if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
      // Convert Excel timestamp to JavaScript Date
      const excelEpoch = new Date(1900, 0, 1);
      const days = typeof timestamp === 'number' ? timestamp : Number(timestamp);
      date = new Date(excelEpoch.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
    } else {
      // Try parsing as regular date string
      date = new Date(timestamp);
    }

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      return 'Please check Excel timestamp format';
    }
    
    // Format the date to match the Excel format
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Please check Excel timestamp format';
  }
}

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