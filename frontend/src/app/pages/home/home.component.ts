import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImagePrefetchService } from '../../services/image-prefetch.service';
import { HeroHomeComponent } from '../../components/hero-home/hero-home.component';
import { JournalLogosComponent } from '../../components/journal-logos/journal-logos.component';
import { StatsBarComponent } from '../../components/stats-bar/stats-bar.component';
import { InsightCardComponent } from '../../components/insight-card/insight-card.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { articlesByRecency } from '../../data/articles';

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

  readonly latest = articlesByRecency().slice(0, 3);
}
