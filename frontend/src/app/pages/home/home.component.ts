import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImagePrefetchService } from '../../services/image-prefetch.service';
import { HeroHomeComponent } from '../../components/hero-home/hero-home.component';
import { JournalLogosComponent } from '../../components/journal-logos/journal-logos.component';
import { StatsBarComponent } from '../../components/stats-bar/stats-bar.component';
import { InsightCardComponent } from '../../components/insight-card/insight-card.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HeroHomeComponent, JournalLogosComponent, StatsBarComponent, InsightCardComponent, CtaSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private imagePrefetch: ImagePrefetchService) {}

  ngOnInit(): void {
    this.imagePrefetch.prefetch([
      'assets/optimized/lobby-1600.webp',
      'assets/optimized/corridor-1600.webp',
      'assets/optimized/exterior-1600.webp',
    ]);
  }

  readonly insights = [
    { tag: 'Ethics',         title: 'Bridging the Gap: Neural Networks in Clinical Decision Support',  date: 'March 10, 2024', dark: false },
    { tag: 'Clinical Crit',  title: 'The Future of Remote Monitoring in Acute Heart Failure',           date: 'Feb 28, 2024',   dark: true  },
    { tag: 'Research',       title: 'Algorithmic Transparency at the Bedside',                         date: 'July 9, 2024',   dark: false },
  ];
}
