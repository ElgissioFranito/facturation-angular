import { Component, Input } from '@angular/core';
import { cn } from '../../../utils/cn';

@Component({
    selector: 'button[app-button]',
    standalone: true,
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'classes'
    }
})
export class ButtonComponent {
    @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
    @Input() size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
    @Input() class = '';

    get classes() {
        return cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            {
                'bg-primary text-primary-foreground hover:bg-primary/90': this.variant === 'default',
                'bg-destructive text-destructive-foreground hover:bg-destructive/90': this.variant === 'destructive',
                'border border-input bg-background hover:bg-accent hover:text-accent-foreground': this.variant === 'outline',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80': this.variant === 'secondary',
                'hover:bg-accent hover:text-accent-foreground': this.variant === 'ghost',
                'text-primary underline-offset-4 hover:underline': this.variant === 'link',
                'h-10 px-4 py-2': this.size === 'default',
                'h-9 rounded-md px-3': this.size === 'sm',
                'h-11 rounded-md px-8': this.size === 'lg',
                'h-10 w-10': this.size === 'icon',
            },
            this.class
        );
    }
}
