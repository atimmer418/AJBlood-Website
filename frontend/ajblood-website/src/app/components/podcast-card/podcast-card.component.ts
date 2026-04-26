import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-podcast-card',
  standalone: true,
  templateUrl: './podcast-card.component.html',
  styleUrl: './podcast-card.component.scss'
})
export class PodcastCardComponent {
  @Input() episode = 0;
  @Input() title = '';
  @Input() desc = '';
  @Input() guests = '';
}
