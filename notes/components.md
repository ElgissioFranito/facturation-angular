# Features et Pages Spécifiques :

## Authentification page :
- Pages : login, register, forgot-password
- Mock : 
  * Utilisateur test : email="demo@freelance.com", password="demo123"
  * Simuler JWT token dans localStorage
  * Intercepteur qui retourne des réponses mockées


## Dashboard page :
- Component principal avec :
  * Cards : Total facturé (mois: €3,840 | année: €42,560)
  * Statistiques : Factures payées (12), en attente (3), en retard (2)
  * Dernières activités (table avec 5 dernières factures)
  * Boutons d'action rapide


## Clients page :
- Liste clients avec datatable (Zard UI)
- Données mockées : 5-6 clients récurrents
- Actions : Ajouter/Éditer/Supprimer (dialogs modaux)
- Stockage dans localStorage pour persistance


## Factures page :
- CreateInvoiceComponent :
  * Formulaire en plusieurs étapes (stepper)
  * Sélection client (autocomplete)
  * Ajout lignes avec catalogue produits
  * Calcul automatique TVA/total
  * Prévisualisation en temps réel
  * Génération PDF (mock avec pdfmake)
  * ajout signature / cachet
  
- InvoiceListComponent :
  * Table avec filtres (statut, date, client)
  * Actions : Voir, Dupliquer, Télécharger PDF, Marquer payée, Imprimer
  * Status badges : Payé/En attente/En retard


## Products page :
- Catalogue simple (CRUD)
- Stockage dans localStorage
- Réutilisable dans les factures


## Receipts page :
- Liste reçus avec datatable 
- Données mockées : 5-6 reçus récurrents
- Actions : Ajouter/Supprimer/Imprimer/Télécharger PDF
- Stockage dans localStorage pour persistance
- Actions : edition + ajout signature + cachet


## Settings page :
- Formulaire d'édition profil
- Upload logo (simulé)
- Gestion devise, taux TVA
- changement de theme (dark/light)


# Mocks exemples :

// Dans mock-backend.service.ts
const MOCK_INVOICES = [
  {
    id: 'FAC-2024-001',
    clientId: 1,
    clientName: 'Startup XYZ',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    total: 1200,
    status: 'paid', // 'paid', 'pending', 'overdue'
    items: [
      { name: 'Développement Frontend', quantity: 10, price: 80, tax: 20 },
      { name: 'Consultance UX', quantity: 5, price: 40, tax: 10 }
    ]
  },
  // ... 10-15 factures mockées
];

const MOCK_CLIENTS = [
  {
    id: 1,
    name: 'Startup XYZ',
    email: 'contact@startupxyz.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de Paris, 75001 Paris',
    totalInvoiced: 8500
  },
  // ... 5-6 clients
];


# UI/UX Spécifications :
Thème : Professionnel, moderne, palette bleu/vert (inspiration : Stripe, Freshbooks)
Responsive : Mobile-first, adapté tablette/desktop
Loader/Squelette : Pour tous les chargements simulés
Notifications : Snackbar pour feedback utilisateur
PDF Preview : Modal avec prévisualisation avant téléchargement