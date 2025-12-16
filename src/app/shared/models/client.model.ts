export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    totalInvoiced: number;
    status: 'active' | 'inactive';
}
