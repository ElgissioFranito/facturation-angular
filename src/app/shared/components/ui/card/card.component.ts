import { Component, Input, Directive } from '@angular/core';
import { cn } from '../../../utils/cn';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() class = '';

  get classes() {
    return cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow",
      this.class
    );
  }
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() class = '';
  get classes() { return cn("flex flex-col space-y-1.5 p-6", this.class); }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `
    <h3 [class]="classes">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {
  @Input() class = '';
  get classes() { return cn("font-semibold leading-none tracking-tight", this.class); }
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: `
    <p [class]="classes">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() class = '';
  get classes() { return cn("text-sm text-muted-foreground", this.class); }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() class = '';
  get classes() { return cn("p-6 pt-0", this.class); }
}
