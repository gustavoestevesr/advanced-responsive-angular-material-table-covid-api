import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidListComponent } from './covid-list.component';

describe('CovidListComponent', () => {
  let component: CovidListComponent;
  let fixture: ComponentFixture<CovidListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovidListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
