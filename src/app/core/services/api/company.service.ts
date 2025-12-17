import { Injectable, signal, computed } from '@angular/core';

export interface CompanySettings {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
    stamp: string | null;     // Cachet Entreprise
    signature: string | null; // Signature
    currency: string;
    taxRate: number;
    // Mentions Légales
    rcs: string;
    nif: string;
    stat: string;
    // Bancaires
    bankName: string;
    iban: string;
    bic: string;
    accountHolder: string;
    website: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
    name: 'Mon Entreprise (Freelance)',
    email: 'contact@freelance.com',
    phone: '+33 6 00 00 00 00',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    logo: null,
    stamp: null,
    signature: null,
    currency: 'MGA',
    taxRate: 20,
    rcs: '',
    nif: '',
    stat: '',
    bankName: '',
    iban: '',
    bic: '',
    accountHolder: '',
    website: ''
};

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private settings = signal<CompanySettings>(DEFAULT_SETTINGS);

    readonly currentSettings = this.settings.asReadonly();

    constructor() {
        this.loadSettings();
    }

    updateSettings(newSettings: Partial<CompanySettings>) {
        this.settings.update(current => ({ ...current, ...newSettings }));
        this.saveSettings();
    }

    private loadSettings() {
        const saved = localStorage.getItem('company_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with default to ensure no missing keys if schema changes
                this.settings.set({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error('Failed to parse company settings', e);
            }
        }
    }

    private saveSettings() {
        localStorage.setItem('company_settings', JSON.stringify(this.settings()));
    }

    getCurrencySymbol(code: string): string {
        switch (code) {
            case 'EUR': return '€';
            case 'USD': return '$';
            case 'GBP': return '£';
            case 'MGA': return 'Ar';
            default: return code;
        }
    }
}
