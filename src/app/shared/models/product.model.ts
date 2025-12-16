export interface Product {
    id: number;
    name: string;
    description: string;
    rate: number;
    unit: string; // 'hour', 'day', 'project', 'item'
    taxRate: number; // percentage
}
