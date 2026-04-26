import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  readonly navLinks = [
    { label: 'Home',             path: '/' },
    { label: 'About',            path: '/about' },
    { label: 'Expertise',        path: '/expertise' },
    { label: 'Publications',     path: '/publications' },
    { label: 'Insights & Media', path: '/insights' },
    { label: 'Podcast',          path: '/podcast' },
  ];
}
