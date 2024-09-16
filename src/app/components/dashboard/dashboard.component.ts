import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardStatusCardComponent } from '../dashboard-status-card/dashboard-status-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Card {
  src: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, DashboardStatusCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  cards: Array<Card> = [];
  orders_count = 10;
  reviews_count = 150;
  clicks_count = 430;
  shares_count = 43;

  ngOnInit() {
    this.cards = [
      {
        src: 'https://pixabay.com/get/gff9a506e8b90bcb8552d7ae83410f1ac1cccf4f7bb09585d8eb4a264de12b10ce9bee4a68681fa9c7d33bc8be8a62baa635ea281a7b2b12592fd77e817f765e9425c9ff897e76d7efd0cca0f9cb1dbf6_1920.jpg',
        name: 'Understanding',
        description: `In-depth knowledge and experience make it possible to solve problems. Thanks TheDigitalArtist for the image(pixabay.com thedigitalartist-202249)`
      },
      {
        src: 'https://pixabay.com/get/gd1606a498a12e850d5dd3e5f70d79eafee461b711d719fb25755c9c4dfcf1c7116c303ad01737ea724a8878266d552a946bfd8da869b30c2766687b17cadc2dfdcea5babd5c3d9e586716846a97ff9bc_1920.jpg',
        name: 'Planing',
        description: `Plan before doing anything. That will help to make a quality product. Thanks lukasbieri for the image(pixabay.com lukasbieri-4664461)`
      },
      {
        src: 'https://pixabay.com/get/ge5a1df40a7aae0fea706f1b3c78ae970804b399a8da933b9996daf2bbaed5482e4bbe96deb632ba7214e1e6ad806bcee350001c4c65b3207df57b722bf4e8d22927b686f034e33d883a0590ba2201e8f_1920.jpg',
        name: 'Implementing',
        description: `Implement quickly what we have planed. Do revisions until you satisfy. Thanks geralt for the image(pixabay.com geralt-9301)`
      }
    ];
  }
}
