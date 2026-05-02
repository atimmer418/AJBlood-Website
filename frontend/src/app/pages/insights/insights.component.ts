import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InsightCardComponent } from '../../components/insight-card/insight-card.component';
import { Article, articlesByRecency } from '../../data/articles';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, InsightCardComponent],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss'
})
export class InsightsComponent {
  readonly featured: Article | undefined = articlesByRecency()[0];
  readonly more: Article[] = articlesByRecency().slice(1);
}
