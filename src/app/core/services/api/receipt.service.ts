import { Injectable, signal } from '@angular/core';
import { of, delay } from 'rxjs';
import { Receipt } from '../../../shared/models/receipt.model';

const MOCK_RECEIPTS: Receipt[] = [
    {
        id: 'REC-001',
        date: new Date('2024-03-10'),
        merchant: 'Amazon',
        category: 'Équipement',
        amount: 89.99,
        description: 'Clavier ergonomique',
        status: 'reimbursed'
    },
    {
        id: 'REC-002',
        date: new Date('2024-03-12'),
        merchant: 'Uber',
        category: 'Transport',
        amount: 24.50,
        description: 'Déplacement client',
        status: 'pending'
    },
    {
        id: 'REC-003',
        date: new Date('2024-03-15'),
        merchant: 'Restaurant Le Chef',
        category: 'Repas',
        amount: 45.00,
        description: 'Déjeuner client',
        status: 'pending'
    }
];

@Injectable({
    providedIn: 'root'
})
export class ReceiptService {
    private receipts = signal<Receipt[]>([]);

    constructor() {
        this.loadReceipts();
    }

    getReceipts() {
        return this.receipts.asReadonly();
    }

    private loadReceipts() {
        const saved = localStorage.getItem('receipts');
        if (saved) {
            this.receipts.set(JSON.parse(saved));
        } else {
            this.receipts.set(MOCK_RECEIPTS);
            this.saveToStorage();
        }
    }

    addReceipt(receipt: Receipt) {
        this.receipts.update(existing => [...existing, receipt]);
        this.saveToStorage();
        return of(receipt).pipe(delay(500));
    }

    updateReceipt(updatedReceipt: Receipt) {
        this.receipts.update(existing =>
            existing.map(r => r.id === updatedReceipt.id ? updatedReceipt : r)
        );
        this.saveToStorage();
        return of(updatedReceipt).pipe(delay(500));
    }

    deleteReceipt(id: string) {
        this.receipts.update(existing => existing.filter(r => r.id !== id));
        this.saveToStorage();
        return of(true).pipe(delay(500));
    }

    private saveToStorage() {
        localStorage.setItem('receipts', JSON.stringify(this.receipts()));
    }
}
