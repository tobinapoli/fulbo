import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaComponent } from './fecha.component';

describe('FechaComponent', () => {
  let component: FechaComponent;
  let fixture: ComponentFixture<FechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
