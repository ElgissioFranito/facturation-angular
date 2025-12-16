import { Injectable, signal } from '@angular/core';
import { Invoice, InvoiceItem } from '../../../shared/models/invoice.model';
import { of, delay } from 'rxjs';

const MOCK_INVOICES: Invoice[] = [
    {
        id: 'INV-2024-001',
        clientId: 1,
        clientName: 'Startup XYZ',
        clientEmail: 'contact@startupxyz.com',
        clientAddress: '123 Rue de Paris, 75001 Paris',
        date: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        status: 'paid',
        items: [
            { id: 1, productName: 'Développement Web', description: 'Sprint 1', quantity: 5, unitPrice: 450, unit: 'day', taxRate: 20, total: 2250 }
        ],
        subtotal: 2250,
        taxTotal: 450,
        total: 2700
    },
    {
        id: 'INV-2024-002',
        clientId: 2,
        clientName: 'Tech Solutions',
        clientEmail: 'info@techsolutions.io',
        clientAddress: '45 Avenue du Code, 69000 Lyon',
        date: new Date('2024-02-01'),
        dueDate: new Date('2024-03-01'),
        status: 'pending',
        items: [
            { id: 1, productName: 'Design UI/UX', description: 'Maquettes', quantity: 3, unitPrice: 400, unit: 'day', taxRate: 20, total: 1200 },
            { id: 2, productName: 'Intégration', description: 'Page d\'accueil', quantity: 2, unitPrice: 450, unit: 'day', taxRate: 20, total: 900 }
        ],
        subtotal: 2100,
        taxTotal: 420,
        total: 2520
    }
];

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    private invoices = signal<Invoice[]>([]);

    constructor() {
        this.loadInvoices();
    }

    getInvoices() {
        return this.invoices.asReadonly();
    }

    getInvoice(id: string) {
        return of(this.invoices().find(i => i.id === id)).pipe(delay(500));
    }

    private loadInvoices() {
        const saved = localStorage.getItem('invoices');
        if (saved) {
            // Need to revive dates
            const parsed = JSON.parse(saved, (key, value) => {
                if (key === 'date' || key === 'dueDate') return new Date(value);
                return value;
            });
            this.invoices.set(parsed);
        } else {
            this.invoices.set(MOCK_INVOICES);
            this.saveToStorage();
        }
    }

    addInvoice(invoice: Invoice) {
        this.invoices.update(existing => [invoice, ...existing]);
        this.saveToStorage();
        return of(invoice).pipe(delay(500));
    }

    updateInvoice(updatedInvoice: Invoice) {
        this.invoices.update(existing =>
            existing.map(i => i.id === updatedInvoice.id ? updatedInvoice : i)
        );
        this.saveToStorage();
        return of(updatedInvoice).pipe(delay(500));
    }

    deleteInvoice(id: string) {
        this.invoices.update(existing => existing.filter(i => i.id !== id));
        this.saveToStorage();
        return of(true).pipe(delay(500));
    }

    private saveToStorage() {
        localStorage.setItem('invoices', JSON.stringify(this.invoices()));
    }
}
