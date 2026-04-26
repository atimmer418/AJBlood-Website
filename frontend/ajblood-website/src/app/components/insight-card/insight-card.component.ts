import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-insight-card',
  standalone: true,
  templateUrl: './insight-card.component.html',
  styleUrl: './insight-card.component.scss'
})
export class InsightCardComponent {
  @Input() tag = '';
  @Input() title = '';
  @Input() date = '';
  @Input() dark = false;
}
