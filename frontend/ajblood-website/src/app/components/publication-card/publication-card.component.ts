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
}
