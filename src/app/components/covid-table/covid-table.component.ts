import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, debounceTime, Subject, take, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import { CovidFormDialogComponent } from '../../dialogs/covid-form-dialog/covid-form-dialog.component';
import { CountryReport } from '../../models/country-report.model';
import { AlertService } from '../../services/alert.service';
import { CovidService } from '../../services/covid.service';

export interface DisplayColumn {
  value: string;
  label: string;
  hide: boolean;
}

/**Default name for excel file when download**/
export const fileName = 'ExcelSheet.xlsx';

@Component({
  selector: 'app-covid-table',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './covid-table.component.html',
  styleUrl: './covid-table.component.scss',
  animations: [
    trigger('animation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('500ms', style({ transform: 'translateX(0)', opacity: 1 })),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            style({ transform: 'translateX(0)', opacity: 1 }),
            animate(
              '500ms',
              style({ transform: 'translateX(100%)', opacity: 0 })
            ),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
  providers: [CovidService],
})
export class CovidTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<CountryReport>([]);
  selection = new SelectionModel<CountryReport>(true, []);
  countries: string[] = [];
  selectedCountry = 'all';

  add: string = 'Add';
  edit: string = 'Edit';
  delete: string = 'Delete';
  value: string = '';
  isLoading: boolean = true;

  filterSubject$: Subject<string> = new Subject();
  destroySubscriptions$ = new Subject<void>();

  filteredDisplayColumns!: string[];

  checkBoxList: DisplayColumn[] = [];

  originalDisplayColumns: DisplayColumn[] = [
    { value: 'select', label: 'Select', hide: false },
    { value: 'flag', label: 'Flag', hide: false },
    { value: 'country', label: 'Country', hide: false },
    { value: 'cases', label: 'Cases', hide: false },
    { value: 'todayCases', label: 'TodayCases', hide: false },
    { value: 'deaths', label: 'Deaths', hide: false },
    { value: 'todayDeaths', label: 'TodayDeaths', hide: false },
    { value: 'recovered', label: 'Recovered', hide: false },
    { value: 'critical', label: 'Critical', hide: false },
    { value: 'active', label: 'Active', hide: false },
    { value: 'action', label: 'Action', hide: false },
  ];

  private dialog = inject(MatDialog);
  private service = inject(CovidService);
  private alertService = inject(AlertService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    this.filteredDisplayColumns = this.originalDisplayColumns.map(
      (c) => c.value
    );

    this.getAllReports();

    this.observeFilter$();
  }

  ngOnDestroy() {
    this.destroySubscriptions$.next();
    this.destroySubscriptions$.complete();
  }

  onFilterInput(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject$.next(filterValue);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  observeFilter$() {
    this.filterSubject$
      .pipe(debounceTime(300), takeUntil(this.destroySubscriptions$))
      .subscribe((value) => {
        this.applyFilter(value);
      });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  openAddEditDialog(action: 'Add' | 'Edit', countryReport: any) {
    const dialogRef = this.dialog.open(CovidFormDialogComponent, {
      data: {
        action,
        countryReport
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: { action: 'Add' | 'Edit', data: any }) => {
        if (result) {
          if (action == this.add) {
            this.addRowData(result.data);
          } else if (action == this.edit) {
            this.updateRowData(result.data);
          }
        }
      });
  }

  addRowData(countryReport: CountryReport) {
    const data = [...this.dataSource.data, countryReport];
    this.dataSource.data = data;
    this.showSnackBar('Row added successfuly!');
  }

  updateRowData(countryReport: CountryReport) {
    const index = this.dataSource.data.findIndex(item => {
      if (item.countryInfo._id === countryReport.countryInfo._id) {
        return item;
      }
      return null;
    });

    if (index === -1) return;

    const updatedData = [...this.dataSource.data];
    updatedData[index] = countryReport;
    this.dataSource.data = updatedData;
    this.showSnackBar('Row edited successfuly!');
  }

  showSnackBar(title: string) {
    this.snackBar.open(title, 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  openDeleteDialog(len: number, obj: any) {
    const options = {
      title: 'Delete?',
      message: `Are you sure want to remove ${len} ${
        len === 1 ? 'row?' : 'rows?'
      }`,
      cancelText: 'NO',
      confirmText: 'YES',
      panelClass: 'alert-dialog',
    };

    this.alertService.open(options);
    this.alertService
      .confirmed()
      .pipe(take(1))
      .subscribe((confirmed: any) => {
        if (confirmed) {
          this.deleteRow(obj);
        }
      });
  }

  deleteRow(countryReport: CountryReport) {
    const index = this.dataSource.data.findIndex(item => item.countryInfo._id === countryReport.countryInfo._id);

    if (index === -1) return;

    const updatedData = [...this.dataSource.data];
    updatedData.splice(index, 1);
    this.dataSource.data = updatedData;

    this.showSnackBar('Row deleted successfully!');
  }

  public getAllReports() {
    this.service
      .getAll()
      .pipe(
        take(1),
        catchError((error) => {
          console.error(error)
          return [];
        })
      )
      .subscribe((reports: CountryReport[]) => {
        this.isLoading = false;
        this.dataSource.data = reports as CountryReport[];
      });
  }

  public onSelectCountry() {
    this.selection.clear();
    if (this.selectedCountry === 'all') {
      this.getAllReports();
    } else {
      this.service
        .getOneByCountry(this.selectedCountry)
        .pipe(take(1))
        .subscribe((report: any) => {
          this.dataSource.data = [report] as CountryReport[];
        });
    }
  }

  showCheckBoxes() {
    this.checkBoxList = this.originalDisplayColumns;
  }

  hideCheckBoxes() {
    this.checkBoxList = [];
  }

  toggleForm() {
    this.checkBoxList.length ? this.hideCheckBoxes() : this.showCheckBoxes();
  }

  hideColumn(event: any, item: string) {
    this.originalDisplayColumns.forEach((element) => {
      if (element['value'] == item) {
        element['hide'] = event.checked;
        return;
      }
    });
    this.filteredDisplayColumns = this.originalDisplayColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.value);
  }

  exportExcel() {
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, fileName);
  }
}
