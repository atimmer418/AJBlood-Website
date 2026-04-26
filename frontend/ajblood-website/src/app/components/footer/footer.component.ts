import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  route?: string;
  href?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly cols: { head: string; links: FooterLink[] }[] = [
    {
      head: 'Affiliations',
      links: [
        { label: 'Harvard Medical School' },
        { label: "Brigham and Women's Hospital" },
        { label: 'AIwithCare' }
      ]
    },
    {
      head: 'Navigation',
      links: [
        { label: 'Home',         route: '/' },
        { label: 'About',        route: '/about' },
        { label: 'Expertise',    route: '/expertise' },
        { label: 'Publications', route: '/publications' },
        { label: 'Podcast',      route: '/podcast' }
      ]
    },
    {
      head: 'Connect',
      links: [
        { label: 'LinkedIn',       href: '#' },
        { label: 'X (Twitter)',    href: '#' },
        { label: 'Privacy Policy', href: '#' }
      ]
    }
  ];

  readonly pulseOpacities = [1, 0.4, 0.1];
}
