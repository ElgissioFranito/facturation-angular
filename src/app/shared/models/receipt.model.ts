export interface Receipt {
    id: string;
    date: Date;
    merchant: string;
    category: string;
    amount: number;
    description?: string;
    status: 'pending' | 'reimbursed' | 'rejected';
    attachmentUrl?: string;
}
