import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { cn } from '../../../utils/cn';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-dialog',
    standalone: true,
    template: `<ng-content></ng-content>`
})
export class DialogComponent {
    @Input() open = false;
    @Output() openChange = new EventEmitter<boolean>();
}

@Component({
    selector: 'app-dialog-content',
    standalone: true,
    imports: [LucideAngularModule],
    template: `
    @if (dialog.open) {
      <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" (click)="close()"></div>
      <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <ng-content></ng-content>
        <button class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" (click)="close()">
          <lucide-icon name="x" class="h-4 w-4"></lucide-icon>
          <span class="sr-only">Close</span>
        </button>
      </div>
    }
  `
})
export class DialogContentComponent {
    constructor(public dialog: DialogComponent) { }

    close() {
        this.dialog.open = false;
        this.dialog.openChange.emit(false);
    }
}

@Component({
    selector: 'app-dialog-header',
    standalone: true,
    template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogHeaderComponent {
    @Input() class = '';
    get classes() { return cn("flex flex-col space-y-1.5 text-center sm:text-left", this.class); }
}

@Component({
    selector: 'app-dialog-footer',
    standalone: true,
    template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogFooterComponent {
    @Input() class = '';
    get classes() { return cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", this.class); }
}

@Component({
    selector: 'app-dialog-title',
    standalone: true,
    template: `
    <h3 [class]="classes">
      <ng-content></ng-content>
    </h3>
  `
})
export class DialogTitleComponent {
    @Input() class = '';
    get classes() { return cn("text-lg font-semibold leading-none tracking-tight", this.class); }
}

@Component({
    selector: 'app-dialog-description',
    standalone: true,
    template: `
    <p [class]="classes">
      <ng-content></ng-content>
    </p>
  `
})
export class DialogDescriptionComponent {
    @Input() class = '';
    get classes() { return cn("text-sm text-muted-foreground", this.class); }
}
