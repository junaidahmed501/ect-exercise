import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ExampleUsageComponent} from './components/example-usage.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ExampleUsageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ect-exercise');
}
