import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidTableComponent } from './covid-table.component';

describe('CovidTableComponent', () => {
  let component: CovidTableComponent;
  let fixture: ComponentFixture<CovidTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovidTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovidTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
