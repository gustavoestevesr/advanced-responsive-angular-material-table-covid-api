import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CovidService } from '../../services/covid.service';
import { DashboardStatusCardComponent } from '../dashboard-status-card/dashboard-status-card.component';

import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { CountryReport } from '../../models/country-report.model';

interface Card {
  icon: string;
  name: string;
  description: CountryReport[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DashboardStatusCardComponent,
    MatListModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  cards: Array<Card> = [];
  todayDeaths = 0;
  todayCases = 0;
  todayRecovereds = 0;
  countriesMap = new Map<string, CountryReport>();
  isLoading = true;

  private covidService = inject(CovidService);

  ngOnInit() {
    this.setHeaderStatus();
  }

  setHeaderStatus() {
    this.covidService.getAll().subscribe((data: CountryReport[]) => {
      if (data) {
        data.forEach((report) => {
          if (report.todayCases) {
            this.todayCases++;
          } else if (report.todayDeaths) {
            this.todayDeaths++;
          } else if (report.todayRecovered) {
            this.todayRecovereds;
          }
          this.countriesMap.set(report.country, report);
        });
        this.setMainStatus()
        this.isLoading = false;
      }
    });
  }

  setMainStatus() {
    this.cards = [
      {
        icon: 'trending_up',
        name: 'The Most Affected Countries',
        description: this.orderBy(Array.from(this.countriesMap.values()), 'cases', 'desc', 5),
      },
      {
        icon: 'trending_down',
        name: 'The Less Affected Countries',
        description: this.orderBy(Array.from(this.countriesMap.values()), 'cases', 'asc', 5),
      },
    ];
  }

  orderBy(array: CountryReport[], field: string, direction: 'asc' | 'desc', limit: number) {
    const newArray = [...array].sort((a: any, b: any) => {
      const fieldA = Number(a[field]);
      const fieldB = Number(b[field]);
      if (fieldA < fieldB) {
        return direction === 'asc' ? -1 : 1;
      } else if (fieldA > fieldB) {
        return direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    return newArray.slice(0, limit);
  }
}
