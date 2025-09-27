import {Component} from '@angular/core';
import {DatePipe} from '@angular/common';
import {CustomSortPipe} from '../pipes/custom-sort.pipe';
import {RepeaterComponent} from './repeater/repeater.component';

interface RepeaterData {
  name: string;
}

@Component({
  selector: 'app-example',
  imports: [
    DatePipe,
    CustomSortPipe,
    RepeaterComponent,
  ],
  template: `
<!--    inline template for the sake of this exercise -->
    <h3>Simple sort by name (descending)</h3>
    @for (item of users | customSort: '-name'; track item.name) {
      <div>{{ item.name }} - {{ item.age }}</div>
    }

    <h3>Sort by name, then by price (descending)</h3>
    @for (item of products | customSort: ['name', '-price']; track $index) {
      <div>{{ item.name }} - {{item.price}}</div>
    }

    <h3>Sort by date</h3>
    @for (item of events | customSort: '-date'; track item.title) {
      <div>{{ item.title }} - {{ item.date | date }}</div>
    }

    <h3>Sort by department</h3>
    @for (item of employees | customSort: 'department'; track item.name) {
      <div>{{ item.name }} - {{ item.department }}</div>
    }

    <h3>Repeater Component Example</h3>
    <repeater [option]="data">
      <ng-template let-item>
        <div>{{item.name}}</div>
      </ng-template>
    </repeater>
  `
})
export class ExampleUsageComponent {
  users = [
    {name: 'John', age: 30},
    {name: 'Alice', age: 25},
    {name: 'Bob', age: 35}
  ];

  products = [
    {name: 'Laptop', price: 999},
    {name: 'Mouse', price: 25},
    {name: 'Laptop', price: 1299},
    {name: 'Keyboard', price: 75}
  ];

  events = [
    {title: 'Meeting', date: new Date('2024-01-15')},
    {title: 'Conference', date: new Date('2024-01-10')},
    {title: 'Workshop', date: new Date('2024-01-20')}
  ];

  employees = [
    {name: 'John', department: 'Engineering'},
    {name: 'Alice', department: 'Marketing'},
    {name: 'Bob', department: 'Engineering'}
  ];

  data: RepeaterData[] = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
}
