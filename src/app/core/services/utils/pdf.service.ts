import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '../../../shared/models/invoice.model';
import { Receipt } from '../../../shared/models/receipt.model';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CompanyService } from '../api/company.service';

@Injectable({
    providedIn: 'root'
})
export class PdfService {
    companyService = inject(CompanyService);

    constructor() { }

    generateInvoicePdf(invoice: Invoice, action: 'download' | 'print' = 'download') {
        const doc = new jsPDF();
        const settings = this.companyService.currentSettings();
        const currencyCode = settings.currency;
        const currencySymbol = this.companyService.getCurrencySymbol(currencyCode);

        const datePipe = new DatePipe('fr');

        // Logo
        if (settings.logo) {
            try {
                doc.addImage(settings.logo, 'PNG', 14, 10, 40, 20, undefined, 'FAST');
            } catch (e) {
                console.error('Error adding logo', e);
            } // Fallback if invalid image
        }

        // Company Info (Top Left under logo or at top)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(settings.name, 14, 35);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(settings.email, 14, 40);
        if (settings.phone) doc.text(settings.phone, 14, 44);
        const addrLines = doc.splitTextToSize(settings.address, 80);
        doc.text(addrLines, 14, 48);


        // Header Title (Right aligned)
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('FACTURE', 200, 22, { align: 'right' });

        // Invoice Details (Right aligned)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`N°: ${invoice.id}`, 200, 30, { align: 'right' });
        doc.text(`Date: ${datePipe.transform(invoice.date, 'd MMMM yyyy')}`, 200, 35, { align: 'right' });
        doc.text(`Échéance: ${datePipe.transform(invoice.dueDate, 'd MMMM yyyy')}`, 200, 40, { align: 'right' });

        // Client Info (Right Side box)
        doc.setFontSize(10);
        doc.text('FACTURÉ À :', 120, 55);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.clientName, 120, 61);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        if (invoice.clientEmail) doc.text(invoice.clientEmail, 120, 66);
        if (invoice.clientAddress) {
            const lines = doc.splitTextToSize(invoice.clientAddress, 80);
            doc.text(lines, 120, 71);
        }



        // Items Table
        const tableBody = invoice.items.map(item => [
            item.description || item.productName,
            `${item.quantity}`,
            this.formatCurrency(item.unitPrice, currencyCode),
            `${item.taxRate}%`,
            this.formatCurrency(item.unitPrice * item.quantity, currencyCode)
        ]);

        autoTable(doc, {
            head: [['Description', 'Qté', 'Prix Unit.', 'TVA', 'Total']],
            body: tableBody,
            startY: 90,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 'auto' }, // Description
                4: { halign: 'right' }   // Total
            }
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        doc.text(`Sous-total:`, 140, finalY);
        doc.text(this.formatCurrency(invoice.subtotal, currencyCode), 200, finalY, { align: 'right' });

        doc.text(`TVA (${settings.taxRate}%):`, 140, finalY + 6);
        doc.text(this.formatCurrency(invoice.taxTotal, currencyCode), 200, finalY + 6, { align: 'right' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total TTC:`, 140, finalY + 14);
        doc.text(this.formatCurrency(invoice.total, currencyCode), 200, finalY + 14, { align: 'right' });

        // Signature & Cachet Zone
        const signatureY = finalY + 30;

        // Col 1: Signature Entreprise
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Signature Entreprise', 14, signatureY);

        if (settings.signature) {
            try {
                doc.addImage(settings.signature, 'PNG', 14, signatureY + 5, 40, 20);
            } catch (e) { }
        }

        // Col 2: Cachet Entreprise
        doc.text('Cachet', 100, signatureY);
        if (settings.stamp) {
            try {
                doc.addImage(settings.stamp, 'PNG', 100, signatureY + 5, 30, 30);
            } catch (e) { }
        }

        // "PAYÉ" Stamp REMOVED per user request
        /*
        if (invoice.status === 'paid') {
            doc.setTextColor(0, 150, 0);
            doc.setDrawColor(0, 150, 0);
            doc.setLineWidth(1);
            doc.setFontSize(30);
            doc.text('PAYÉ', 160, signatureY + 15, { angle: -15 });
            doc.rect(155, signatureY, 50, 20); // Border around PAYÉ (approx)
        }
        */

        // Footer
        const pageHeight = doc.internal.pageSize.height || 297;
        doc.setTextColor(150);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${settings.name} - ${settings.address}`, 105, pageHeight - 10, { align: 'center' });

        if (action === 'download') {
            doc.save(`facture-${invoice.id}.pdf`);
        } else if (action === 'print') {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    async generateReceiptPdf(receipt: Receipt, action: 'download' | 'print' = 'download') {
        const doc = new jsPDF();
        const settings = this.companyService.currentSettings();
        const currencyCode = settings.currency;

        const datePipe = new DatePipe('fr');

        // Logo
        if (settings.logo) {
            try {
                doc.addImage(settings.logo, 'PNG', 14, 10, 40, 20, undefined, 'FAST');
            } catch (e) { }
        }

        // Company Info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(settings.name, 14, 35);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(settings.email, 14, 40);
        if (settings.phone) doc.text(settings.phone, 14, 44);
        const addrLines = doc.splitTextToSize(settings.address, 80);
        doc.text(addrLines, 14, 48);

        // Header Title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('REÇU DE PAIEMENT', 200, 22, { align: 'right' });

        // Receipt Details
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${datePipe.transform(receipt.date, 'd MMMM yyyy')}`, 200, 30, { align: 'right' });
        doc.text(`Marchand: ${receipt.merchant}`, 200, 35, { align: 'right' });

        // Content as Table to match Invoice look
        autoTable(doc, {
            head: [['Catégorie', 'Description', 'Montant']],
            body: [[
                receipt.category,
                receipt.description || '-',
                this.formatCurrency(receipt.amount, currencyCode)
            ]],
            startY: 70,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
            styles: { fontSize: 10, cellPadding: 3 }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Total
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL PAIEMENT : `, 120, finalY);
        doc.text(this.formatCurrency(receipt.amount, currencyCode), 190, finalY, { align: 'right' });

        // Signature & Stamp Zone
        const signatureY = finalY + 30;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Signature Entreprise', 14, signatureY);
        if (settings.signature) {
            try {
                doc.addImage(settings.signature, 'PNG', 17, signatureY + 8, 20, 10);
            } catch (e) { }
        }

        doc.text('Cachet', 100, signatureY);
        if (settings.stamp) {
            try {
                doc.addImage(settings.stamp, 'PNG', 90, signatureY + 5, 30, 30);
            } catch (e) { }
        }

        // PAYÉ Stamp (Always valid for a receipt)
        try {
            const img = await this.loadImage('/paye.png');
            doc.setGState(new (doc as any).GState({ opacity: 0.50 }));
            doc.addImage(img, 'PNG', 128, signatureY + 8, 70, 25, undefined, undefined, 15);
            doc.setGState(new (doc as any).GState({ opacity: 1 }));
        } catch (e) {
            console.error('Failed to load paid stamp', e);
        }

        // Footer
        const pageHeight = doc.internal.pageSize.height || 297;
        doc.setTextColor(150);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${settings.name} - ${settings.address}`, 105, pageHeight - 10, { align: 'center' });

        if (action === 'download') {
            doc.save(`recu-${datePipe.transform(receipt.date, 'yyyyMMdd')}.pdf`);
        } else {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    private loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = reject;
            console.log(img);
            
        });
    }

    private formatCurrency(amount: number, currencyCode: string): string {
        const currencyPipe = new CurrencyPipe('fr');
        const formatted = currencyPipe.transform(amount, currencyCode, 'symbol', '1.2-2', 'fr');
        return formatted ? formatted.replace(/\u202F/g, ' ').replace(/\u00A0/g, ' ') : '';
    }
}
