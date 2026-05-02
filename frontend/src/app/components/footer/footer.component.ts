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
        { label: 'Harvard Medical School',      href: 'https://hms.harvard.edu/' },
        { label: "Brigham and Women's Hospital", href: 'https://www.brighamandwomens.org/' },
        { label: 'AIwithCare',                   href: 'https://aiwithcare.com/' }
      ]
    },
    {
      head: 'Navigation',
      links: [
        { label: 'Home',         route: '/' },
        { label: 'About',        route: '/about' },
        { label: 'Expertise',    route: '/expertise' },
        { label: 'Publications',    route: '/publications' },
        { label: 'Insights & Media', route: '/insights' },
        { label: 'Podcast',         route: '/podcast' }
      ]
    },
    {
      head: 'Connect',
      links: [
        { label: 'LinkedIn',       href: 'https://www.linkedin.com/in/alexander-blood-md-msc-facc-abom-a8654a23' },
        { label: 'X (Twitter)',    href: 'https://x.com/ajbloodmd' },
        { label: 'Privacy Policy', route: '/privacy' }
      ]
    }
  ];

  readonly pulseOpacities = [1, 0.4, 0.1];
}
