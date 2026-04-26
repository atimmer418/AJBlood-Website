import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expertise-card',
  standalone: true,
  templateUrl: './expertise-card.component.html',
  styleUrl: './expertise-card.component.scss'
})
export class ExpertiseCardComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() desc = '';
  @Input() tags: string[] = [];
  @Input() dark = false;
  @Input() image: string | null = null;
}
