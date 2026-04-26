import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-home.component.html',
  styleUrl: './hero-home.component.scss'
})
export class HeroHomeComponent {
  readonly roles = ['Harvard Medical School', "Brigham & Women's Hospital", 'AIwithCare CEO'];
  readonly tags = [
    'Healthcare AI CEO',
    'Practicing Cardiac Intensivist',
    'BWH Director of the Accelerator for Clinical Transformation',
  ];
}
