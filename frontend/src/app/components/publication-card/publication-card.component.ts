import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-publication-card',
  standalone: true,
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.scss'
})
export class PublicationCardComponent {
  @Input() tag = '';
  @Input() year = 0;
  @Input() title = '';
  @Input() authors = '';
  @Input() journal = '';
  @Input() doi = '';
  @Input() url = '';

  get articleUrl(): string {
    if (this.url) return this.url;
    const identifier = this.doi.replace(/^DOI:\s*/i, '');
    return `https://doi.org/${identifier}`;
  }
}
