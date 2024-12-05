export async function generateNextSCCId(db) {
    try {
        // First try to get the max ID from SCC format IDs
        const [sccResult] = await db.query('SELECT MAX(CAST(SUBSTRING(id, 7) AS UNSIGNED)) as maxNum FROM accounts WHERE id LIKE "SCC-0-%"');
        
        // Then get the max ID from numeric IDs
        const [numericResult] = await db.query('SELECT MAX(CAST(id AS UNSIGNED)) as maxNum FROM accounts WHERE id NOT LIKE "SCC-0-%"');
        
        const sccMax = sccResult[0].maxNum || 0;
        const numericMax = numericResult[0].maxNum || 0;
        
        // Use the larger of the two numbers
        const nextNumber = Math.max(sccMax, numericMax) + 1;
        const numericPart = String(nextNumber).padStart(6, '0');
        return `SCC-0-${numericPart}`;
    } catch (error) {
        console.error('Error generating next SCC ID:', error);
        throw error;
    }
}

export function formatSCCId(id) {
    // If it's already in SCC format, return as is
    if (id.startsWith('SCC-0-')) {
        return id;
    }
    // Convert numeric ID to SCC format
    const numericPart = String(parseInt(id)).padStart(6, '0');
    return `SCC-0-${numericPart}`;
}