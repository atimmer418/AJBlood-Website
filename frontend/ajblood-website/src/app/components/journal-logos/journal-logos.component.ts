import { Component } from '@angular/core';

@Component({
  selector: 'app-journal-logos',
  standalone: true,
  templateUrl: './journal-logos.component.html',
  styleUrl: './journal-logos.component.scss'
})
export class JournalLogosComponent {
  readonly journals = [
    { name: 'JAMA',                         slug: 'jama' },
    { name: 'NEJM AI',                      slug: 'nejm-ai' },
    { name: 'NEJM Catalyst',                slug: 'nejm-catalyst' },
    { name: 'JAMA Cardiology',              slug: 'jama-card' },
    { name: 'Circulation',                  slug: 'circulation' },
    { name: 'Applied Clinical Informatics', slug: 'aci' },
    { name: 'BMJ Open',                     slug: 'bmj-open' },
    { name: 'JACC: Advances',               slug: 'jacc-adv' },
  ];
}
