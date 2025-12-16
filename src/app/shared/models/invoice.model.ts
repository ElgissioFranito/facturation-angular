import { Client } from './client.model';
import { Product } from './product.model';

export interface InvoiceItem {
    id: number;
    productId?: number;
    productName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    taxRate: number;
    total: number;
}

export interface Invoice {
    id: string; // INV-YYYY-XXX
    clientId: number;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    date: Date;
    dueDate: Date;
    status: 'draft' | 'pending' | 'paid' | 'overdue';
    items: InvoiceItem[];
    subtotal: number;
    taxTotal: number;
    total: number;
    notes?: string;
}
