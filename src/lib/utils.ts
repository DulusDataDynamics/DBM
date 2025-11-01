import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrencySymbol(currencyCode: string) {
    switch (currencyCode.toLowerCase()) {
        case 'usd':
            return '$';
        case 'eur':
            return '€';
        case 'gbp':
            return '£';
        case 'zar':
            return 'R';
        default:
            return '';
    }
}

export function exportToCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]): void {
    const escapeCsvField = (field: any): string => {
        if (field === null || field === undefined) {
            return '""';
        }
        const stringField = String(field);
        // Escape double quotes by doubling them and wrap the field in double quotes.
        const escapedField = stringField.replace(/"/g, '""');
        return `"${escapedField}"`;
    };

    const csvHeader = headers.map(escapeCsvField).join(',');
    const csvRows = rows.map(row => row.map(escapeCsvField).join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + csvHeader + "\n" 
        + csvRows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
