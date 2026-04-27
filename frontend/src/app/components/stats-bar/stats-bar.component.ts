import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  templateUrl: './stats-bar.component.html',
  styleUrl: './stats-bar.component.scss'
})
export class StatsBarComponent {
  readonly stats = [
    { num: '25+', label: 'Peer-Reviewed Papers' },
    { num: '880+', label: 'Citations Globally' },
    { num: '10',  label: 'Active AI Trials' },
    { num: '12yrs', label: 'Clinical Experience' },
  ];
}
