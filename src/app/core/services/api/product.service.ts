import { Injectable, signal } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { of, delay } from 'rxjs';

const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Développement Web',
        description: 'Développement frontend et backend (TJM)',
        rate: 450,
        unit: 'day',
        taxRate: 20
    },
    {
        id: 2,
        name: 'Design UI/UX',
        description: 'Conception d\'interfaces et expérience utilisateur',
        rate: 400,
        unit: 'day',
        taxRate: 20
    },
    {
        id: 3,
        name: 'Maintenance',
        description: 'Maintenance mensuelle et mises à jour',
        rate: 150,
        unit: 'month',
        taxRate: 20
    },
    {
        id: 4,
        name: 'Consulting',
        description: 'Audit technique et conseils stratégiques',
        rate: 100,
        unit: 'hour',
        taxRate: 20
    },
    {
        id: 5,
        name: 'Hébergement',
        description: 'Serveur dédié et configuration',
        rate: 50,
        unit: 'month',
        taxRate: 20
    }
];

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products = signal<Product[]>([]);

    constructor() {
        this.loadProducts();
    }

    getProducts() {
        return this.products.asReadonly();
    }

    private loadProducts() {
        const saved = localStorage.getItem('products');
        if (saved) {
            this.products.set(JSON.parse(saved));
        } else {
            this.products.set(MOCK_PRODUCTS);
            this.saveToStorage();
        }
    }

    addProduct(product: Omit<Product, 'id'>) {
        const newProduct = { ...product, id: Date.now() };
        this.products.update(existing => [...existing, newProduct]);
        this.saveToStorage();
        return of(newProduct).pipe(delay(500));
    }

    updateProduct(updatedProduct: Product) {
        this.products.update(existing =>
            existing.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        this.saveToStorage();
        return of(updatedProduct).pipe(delay(500));
    }

    deleteProduct(id: number) {
        this.products.update(existing => existing.filter(p => p.id !== id));
        this.saveToStorage();
        return of(true).pipe(delay(500));
    }

    private saveToStorage() {
        localStorage.setItem('products', JSON.stringify(this.products()));
    }
}
