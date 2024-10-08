import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidDashboardComponent } from './covid-dashboard.component';

describe('CovidDashboardComponent', () => {
  let component: CovidDashboardComponent;
  let fixture: ComponentFixture<CovidDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovidDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovidDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
