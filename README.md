# FacturationApp

A modern, responsive invoicing and business management application for freelancers and small businesses, built with Angular 19 and TailwindCSS.

## Features

### 🔐 Authentication
- **Secure Login**: User authentication with simulated JWT handling.
- **Registration**: New user sign-up flow with password validation.
- **Forgot Password**: Password recovery workflow.

### 📊 Dashboard
- **Key Metrics**: Real-time overview of monthly revenue, pending payments, and overdue invoices.
- **Visual Analytics**: Interactive revenue charts (using mock data).
- **Recent Activity**: Live feed of recent invoices and payments.

### 🧾 Receipts & Expenses
- **Expense Tracking**: Manage business expenses and supplier invoices.
- **Receipt Management**: Add, edit, and categorize receipts.
- **Status Tracking**: Monitor reimbursement status (Pending, Reimbursed, Rejected).

### ⚙️ Settings
- **Profile Management**: Update user details and avatar.
- **Business Configuration**: Configure currency, tax rates, and billing address.

### 🎨 UI/UX
- **Modern Design**: Built with TailwindCSS and Shadcn-inspired components.
- **Responsive**: Fully optimized for desktop and mobile devices.
- **Icons**: Integrated with Lucide Icons for a consistent visual language.

## Getting Started

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Tech Stack

- **Framework**: Angular 21
- **Styling**: TailwindCSS, SCSS
- **State Management**: Angular Signals
- **Icons**: Lucide Angular

## Running Tests

- **Unit Tests**: `ng test` (using Vitest)
- **E2E Tests**: `ng e2e`
