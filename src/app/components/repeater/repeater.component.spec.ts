import { ComponentFixture, TestBed } from '@angular/core/testing';
import {RepeaterComponent} from './repeater.component';

describe('RepeaterComponent', () => {
  let fixture: ComponentFixture<RepeaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();
    fixture = TestBed.createComponent(RepeaterComponent);
    fixture.componentRef.setInput('option', ['A', 'B', 'C']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

