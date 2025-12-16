import { Component, Input, ViewEncapsulation } from '@angular/core';
import { cn } from '../../../utils/cn';

@Component({
    selector: 'app-table',
    standalone: true,
    template: `
    <div class="relative w-full overflow-auto">
      <table [class]="classes">
        <ng-content></ng-content>
      </table>
    </div>
  `
})
export class TableComponent {
    @Input() class = '';
    get classes() { return cn("w-full caption-bottom text-sm", this.class); }
}

@Component({
    selector: 'app-table-header',
    standalone: true,
    template: `
    <thead [class]="classes">
      <ng-content></ng-content>
    </thead>
  `
})
export class TableHeaderComponent {
    @Input() class = '';
    get classes() { return cn("[&_tr]:border-b", this.class); }
}

@Component({
    selector: 'app-table-body',
    standalone: true,
    template: `
    <tbody [class]="classes">
      <ng-content></ng-content>
    </tbody>
  `
})
export class TableBodyComponent {
    @Input() class = '';
    get classes() { return cn("[&_tr:last-child]:border-0", this.class); }
}

@Component({
    selector: 'app-table-row',
    standalone: true,
    template: `
    <tr [class]="classes">
      <ng-content></ng-content>
    </tr>
  `
})
export class TableRowComponent {
    @Input() class = '';
    get classes() { return cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", this.class); }
}

@Component({
    selector: 'app-table-head',
    standalone: true,
    template: `
    <th [class]="classes">
      <ng-content></ng-content>
    </th>
  `
})
export class TableHeadComponent {
    @Input() class = '';
    get classes() { return cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", this.class); }
}

@Component({
    selector: 'app-table-cell',
    standalone: true,
    template: `
    <td [class]="classes">
      <ng-content></ng-content>
    </td>
  `
})
export class TableCellComponent {
    @Input() class = '';
    get classes() { return cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", this.class); }
}
