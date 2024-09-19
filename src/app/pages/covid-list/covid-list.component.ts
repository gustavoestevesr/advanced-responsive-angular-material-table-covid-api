import { Component } from '@angular/core';
import { CovidTableComponent } from '../../components/covid-table/covid-table.component';

@Component({
  selector: 'app-covid-list',
  standalone: true,
  imports: [CovidTableComponent],
  templateUrl: './covid-list.component.html',
  styleUrl: './covid-list.component.scss'
})
export class CovidListComponent {

}
