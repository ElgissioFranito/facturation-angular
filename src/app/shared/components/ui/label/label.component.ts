import { Component, Input } from '@angular/core';
import { cn } from '../../../utils/cn';

@Component({
    selector: 'label[app-label]',
    standalone: true,
    template: `<ng-content></ng-content>`,
    host: {
        '[class]': 'classes'
    }
})
export class LabelComponent {
    @Input() class = '';
    get classes() { return cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", this.class); }
}
