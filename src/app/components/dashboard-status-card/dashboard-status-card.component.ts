import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-status-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './dashboard-status-card.component.html',
  styleUrl: './dashboard-status-card.component.scss'
})
export class DashboardStatusCardComponent {
  @Input() icon!: string;
  @Input() count!: number;
  @Input() label!: string;
}
