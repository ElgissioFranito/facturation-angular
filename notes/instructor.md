You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project

- Use pnpm as package manager

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
- `NgOptimizedImage` does not work for inline base64 images.

## Components

- Use typescript and html separated files
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Dialogs

### Centralized Dialog System

Use the centralized `DialogService` for all modal dialogs in the application. The service provides dynamic component injection through a `dialog-outlet` component placed in the root `app.html`.

**Key components:**
- `DialogService`: Service singleton that manages dialog lifecycle
- `DialogOutletComponent`: Centralized rendering outlet in the root application

### Dialog Organization

Organize dialog components based on their usage scope:

**Shared dialogs** (`src/app/cores/dialogs/{dialog-name}-dialog/`):
- Used by **at least 2 different pages or components**
- Examples: confirmation dialogs, global settings dialogs
- Convention: `cores/dialogs/customize-modal-dialog/`

**Feature-specific dialogs** (`src/app/features/{page-name}/dialogs/{dialog-name}-dialog/`):
- Used **only by a specific page**
- Examples: page-specific forms, contextual dialogs
- Convention: `features/student-page/dialogs/add-student-dialog/`

### Dialog Component Conventions

**Naming:**
- Always suffix directory and file names with `-dialog`
- Use kebab-case for file names
- Use PascalCase with `Dialog` suffix for class names
- Example: `customize-modal-dialog.ts` → `CustomizeModalDialog`

**Component signature:**
```typescript
export class XxxDialog {
  // Injected automatically by DialogService
  close!: (result?: boolean | any) => void;
  
  // Optional data passed to dialog
  data?: any;
  
  // Dialog methods and properties...
}
```

### Using DialogService

**Opening a dialog:**
```typescript
export class MyComponent {
  dialogService = inject(DialogService);
  
  openDialog() {
    this.dialogService.open(MyDialog, optionalData)
      .afterClosed.subscribe(result => {
        // Handle dialog result
        if (result === true) {
          console.log('Dialog confirmed');
        }
      });
  }
}
```

**Closing a dialog from within:**
```typescript
export class MyDialog {
  close!: (result?: boolean | any) => void;
  
  closeDialog(result: boolean) {
    if (typeof this.close === 'function') {
      this.close(result);
    }
  }
}
```