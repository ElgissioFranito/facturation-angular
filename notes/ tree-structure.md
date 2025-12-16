# Structure du Projet

Ce document décrit la structure du projet en arborescence.

## Arborescence :

    src/app/
    ├── core/
    │   ├── services/
    │   │   ├── auth/
    │   │   │   ├── auth.service.ts (avec login/logout/mock)
    │   │   │   └── auth.interceptor.ts (gestion token mock)
    │   │   ├── api/
    │   │   │   ├── mock-backend.service.ts (données factices)
    │   │   │   └── api.interceptor.ts (intercepteur pour mocks)
    │   │   └── storage.service.ts
    │   ├── guards/
    │   │   └── auth.guard.ts
    │   └── layout/
    │       ├── header/
    │       ├── sidebar/
    │       └── main-layout/
    ├── features/
    │   ├── auth-page/
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── forgot-password/
    │   ├── dashboard-page/
    │   ├── clients-page/
    │   ├── invoices-page/
    │   │   ├── create-invoice/
    │   │   ├── invoice-list/
    │   │   └── invoice-detail/
    │   ├── products-page/
    │   ├── receipts-page/
    │   └── settings-page/
    ├── shared/
    │   ├── components/
    │   │   ├── invoice-preview/
    │   │   ├── pdf-generator/
    │   │   └── confirm-dialog/
    │   ├── models/
    │   │   ├── user.model.ts
    │   │   ├── invoice.model.ts
    │   │   └── client.model.ts
    │   └── utils/