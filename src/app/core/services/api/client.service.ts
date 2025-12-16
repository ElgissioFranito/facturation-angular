import { Injectable, signal } from '@angular/core';
import { Client } from '../../../shared/models/client.model';
import { of, delay } from 'rxjs';

const MOCK_CLIENTS: Client[] = [
    {
        id: 1,
        name: 'Startup XYZ',
        email: 'contact@startupxyz.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de Paris, 75001 Paris',
        totalInvoiced: 8500,
        status: 'active'
    },
    {
        id: 2,
        name: 'Tech Solutions',
        email: 'info@techsolutions.io',
        phone: '+33 4 56 78 90 12',
        address: '45 Avenue du Code, 69000 Lyon',
        totalInvoiced: 12400,
        status: 'active'
    },
    {
        id: 3,
        name: 'Marketing Pro',
        email: 'hello@marketingpro.fr',
        phone: '+33 5 67 89 01 23',
        address: '8 Boulevard du Design, 33000 Bordeaux',
        totalInvoiced: 3200,
        status: 'inactive'
    },
    {
        id: 4,
        name: 'Consulting Corp',
        email: 'contact@ccorp.com',
        phone: '+33 9 87 65 43 21',
        address: '10 Place de la Stratégie, 44000 Nantes',
        totalInvoiced: 15600,
        status: 'active'
    },
    {
        id: 5,
        name: 'Fresh Food Co',
        email: 'orders@freshfood.com',
        phone: '+33 6 12 34 56 78',
        address: '22 Rue des Saveurs, 13000 Marseille',
        totalInvoiced: 5800,
        status: 'active'
    }
];

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private clients = signal<Client[]>([]);

    constructor() {
        // Simulate loading data
        this.loadClients();
    }

    getClients() {
        return this.clients.asReadonly();
    }

    private loadClients() {
        const saved = localStorage.getItem('clients');
        if (saved) {
            this.clients.set(JSON.parse(saved));
        } else {
            this.clients.set(MOCK_CLIENTS);
            this.saveToStorage();
        }
    }

    addClient(client: Omit<Client, 'id'>) {
        const newClient = { ...client, id: Date.now() };
        this.clients.update(existing => [...existing, newClient]);
        this.saveToStorage();
        return of(newClient).pipe(delay(500));
    }

    updateClient(updatedClient: Client) {
        this.clients.update(existing =>
            existing.map(c => c.id === updatedClient.id ? updatedClient : c)
        );
        this.saveToStorage();
        return of(updatedClient).pipe(delay(500));
    }

    deleteClient(id: number) {
        this.clients.update(existing => existing.filter(c => c.id !== id));
        this.saveToStorage();
        return of(true).pipe(delay(500));
    }

    private saveToStorage() {
        localStorage.setItem('clients', JSON.stringify(this.clients()));
    }
}
