import {Component, input, ContentChild, TemplateRef, InputSignal, contentChild, Signal} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'repeater',
  templateUrl: './repeater.component.html',
  imports: [NgTemplateOutlet]
})
export class RepeaterComponent {
  option: InputSignal<any[]> = input.required();
  contentTemplate: Signal<TemplateRef<any> | undefined> = contentChild(TemplateRef);
}
