import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidFormDialogComponent } from './covid-form-dialog.component';

describe('CovidFormDialogComponent', () => {
  let component: CovidFormDialogComponent;
  let fixture: ComponentFixture<CovidFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovidFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovidFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
