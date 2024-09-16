import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { CovidFormDialogComponent } from '../../dialogs/covid-form-dialog/covid-form-dialog.component';
import { AlertService } from '../../services/alert.service';
import { CovidService } from '../../services/covid.service';

export interface CountryReports {
  country: string;
  cases: number;
  todayCases: number;
  deaths: string;
  todayDeaths: string;
  recovered: number;
  active: number;
  critical: string;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: string;
  testsPerOneMillion: string;
  countryInfo: {
    flag: string;
  };
}

export interface DisplayColumn {
value: string
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
export class CovidTableComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  ELEMENT_DATA!: CountryReports[];
  dataSource = new MatTableDataSource<CountryReports>(this.ELEMENT_DATA);
  selection!: SelectionModel<CountryReports>;
  countries: string[] = [];
  selectedCountry: string = 'all';
  add: string = 'Add';
  edit: string = 'Edit';
  delete: string = 'Delete';
  value: string = '';
  isLoading: boolean = true;

  // Keep as main 'column mapper'
  displayedColumns: DisplayColumn[] = [
    { value: 'select', label: 'Select', hide: false },
    { value: 'flag', label: 'Flag', hide: false },
    { value: 'country', label: 'Country', hide: false },
    { value: 'cases', label: 'Cases', hide: false },
    { value: 'todayCases', label: 'TodayCases', hide: false },
    { value: 'deaths', label: 'Deaths', hide: false },
    { value: 'todayDeaths', label: 'TodayDeaths', hide: false },
    { value: 'recovered', label: 'Recovered', hide: false },
    { value: 'active', label: 'Active', hide: false },
    { value: 'action', label: 'Action', hide: false },
  ];

  // Used in the template
  disColumns!: string[];

  // Use for creating check box views dynamically in the template
  checkBoxList: DisplayColumn[] = [];

  constructor(
    public dialog: MatDialog,
    private service: CovidService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Apply paginator
    this.dataSource.paginator = this.paginator;

    // Apply sort option
    this.dataSource.sort = this.sort;

    // Create instance of checkbox SelectionModel
    this.selection = new SelectionModel<CountryReports>(true, []);

    // Update with columns to be displayed
    this.disColumns = this.displayedColumns.map((cd) => cd.value);

    // Get covid19 data from external rest api endpoint
    this.getAllReports();
  }

  // This function filter data by input in the search box
  applyFilter(event: any): void {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  // This function will be called when user click on select all check-box
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  // Add, Edit, Delete rows in data table
  openAddEditDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(CovidFormDialogComponent, {
      data: obj,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { data: { [x: string]: any } } | null) => {
        if (result != null) {
          const action = result.data['action'];
          delete result.data['action'];
          if (action == this.add) {
            this.addRowData(result.data);
          } else if (action == this.edit) {
            this.updateRowData(result.data);
          } else {
            console.log(action);
          }
        }
      });
  }

  // Add a row into to data table
  addRowData(row_obj: any): void {
    const data = this.dataSource.data;
    data.push(row_obj);
    this.dataSource.data = data;
  }

  // Update a row in data table
  updateRowData(row_obj: any): void {
    if (row_obj === null) {
      return;
    }
    const data = this.dataSource.data;
    const index = data.findIndex(
      (item: { [x: string]: any }) =>
        item['country'] === row_obj.data['country']
    );
    if (index > -1) {
      data[index].country = row_obj.data['country'];
      data[index].cases = row_obj.data['cases'];
      data[index].todayCases = row_obj.data['todayCases'];
      data[index].deaths = row_obj.data['deaths'];
      data[index].todayDeaths = row_obj.data['todayDeaths'];
      data[index].recovered = row_obj.data['recovered'];
      data[index].active = row_obj.data['active'];
    }
    this.dataSource.data = data;
  }

  // Open confirmation dialog
  openDeleteDialog(len: number, obj: any): void {
    const options = {
      title: 'Delete?',
      message: `Are you sure want to remove ${len} ${len === 1 ? 'row?' : 'rows?'}`,
      cancelText: 'NO',
      confirmText: 'YES',
      panelClass: 'alert-dialog'
    };

    // If user confirms, remove selected row from data table
    this.alertService.open(options);
    this.alertService.confirmed().subscribe((confirmed: any) => {
      if (confirmed) {
        this.deleteRow(obj);
      }
    });
  }

  // Delete a row by 'row' delete button
  deleteRow(row_obj: any): void {
    const data = this.dataSource.data;
    const index = data.findIndex(
      (item: any) => item['country'] === row_obj['country']
    );
    if (index > -1) {
      data.splice(index, 1);
    }
    this.dataSource.data = data;
  }

  // Fill data table
  public getAllReports(): void {
    let resp = this.service.getAll();
    resp.subscribe((report: any) => {
      this.isLoading = false;
      this.dataSource.data = report as CountryReports[];
    });
  }

  // Fill on selected option
  public onSelectCountry(): void {
    this.selection.clear();
    if (this.selectedCountry === 'all') {
      this.getAllReports();
    } else {
      let resp = this.service.getOneByCountry(this.selectedCountry);
      resp.subscribe((report: any) => {
        this.dataSource.data = [report] as CountryReports[];
      });
    }
  }

  // Show/Hide check boxes
  showCheckBoxes(): void {
    this.checkBoxList = this.displayedColumns;
  }

  hideCheckBoxes(): void {
    this.checkBoxList = [];
  }

  toggleForm(): void {
    this.checkBoxList.length ? this.hideCheckBoxes() : this.showCheckBoxes();
  }

  // Show/Hide columns
  hideColumn(event: any, item: string) {
    this.displayedColumns.forEach((element) => {
      if (element['value'] == item) {
        element['hide'] = event.checked;
        return;
      }
    });
    this.disColumns = this.displayedColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.value);
  }

  exportexcel() {
    /**passing table id**/
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    /**Generate workbook and add the worksheet**/
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /*save to file*/
    XLSX.writeFile(wb, fileName);
  }
}
