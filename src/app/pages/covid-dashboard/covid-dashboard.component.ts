import { Component } from '@angular/core';
import { DashboardComponent } from "../../components/dashboard/dashboard.component";

@Component({
  selector: 'app-covid-dashboard',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './covid-dashboard.component.html',
  styleUrl: './covid-dashboard.component.scss'
})
export class CovidDashboardComponent {

}
