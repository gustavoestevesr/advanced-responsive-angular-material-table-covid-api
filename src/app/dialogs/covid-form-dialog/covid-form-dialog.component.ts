import { Component, Inject, Optional, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CountryReport } from '../../models/country-report.model';

export const regExps: { [key: string]: RegExp } = {
  str: /^[a-zA-Z]/, // Validates only strings
  num: /^\d+$/, // Validates only numbers
};

export const errorMessages: { [key: string]: string } = {
  flag: 'Required and only strings',
  country: 'Required and only strings',
  cases: 'Required and only numbers',
  todayCases: 'Required and only numbers',
  deaths: 'Required and only numbers',
  todayDeaths: 'Required and only numbers',
  recovered: 'Required and only numbers',
  active: 'Required and only numbers',
};

@Component({
  selector: 'app-covid-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './covid-form-dialog.component.html',
  styleUrl: './covid-form-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CovidFormDialogComponent {
  action: string;
  countries!: string[];
  cancel: string = 'Cancel';

  covidForm!: FormGroup;
  errors = errorMessages;

  constructor(
    public dialogRef: MatDialogRef<CovidFormDialogComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'Add' | 'Edit'; countryReport: CountryReport },
    private formBuilder: FormBuilder
  ) {
    this.action = this.data.action;
    this.createForm();
    this.covidForm.patchValue(this.data.countryReport);
  }

  createForm(): void {
    this.covidForm = this.formBuilder.group({
      countryInfo: this.formBuilder.group({
        flag: ['', [Validators.required, Validators.pattern(regExps['str'])]],
        _id: [''],
      }),
      country: ['', [Validators.required, Validators.pattern(regExps['str'])]],
      cases: ['', [Validators.required, Validators.pattern(regExps['num'])]],
      todayCases: [
        '',
        [Validators.required, Validators.pattern(regExps['num'])],
      ],
      deaths: ['', [Validators.required, Validators.pattern(regExps['num'])]],
      todayDeaths: [
        '',
        [Validators.required, Validators.pattern(regExps['num'])],
      ],
      recovered: [
        '',
        [Validators.required, Validators.pattern(regExps['num'])],
      ],
      active: ['', [Validators.required, Validators.pattern(regExps['num'])]],
    });
  }

  closeDialog() {
    this.dialogRef.close({ action: 'Cancel' });
  }

  onSubmit(): void {
    if (this.action === 'Add') {
      // Generate a random ID using Math.random and Date.now
      const randomId = Date.now().toString(36) + Math.random().toString(36);
      // Set the random ID to the form field
      this.covidForm.get('countryInfo._id')?.setValue(randomId);
    }
    this.dialogRef.close({ action: this.action, data: this.covidForm.value });
  }
}
