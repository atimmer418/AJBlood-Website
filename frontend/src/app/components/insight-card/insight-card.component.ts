import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-insight-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './insight-card.component.html',
  styleUrl: './insight-card.component.scss'
})
export class InsightCardComponent {
  @Input() tag = '';
  @Input() title = '';
  @Input() date = '';
  @Input() dark = false;
  @Input() route = '';
}
