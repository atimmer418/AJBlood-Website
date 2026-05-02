import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-home',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './hero-home.component.html',
  styleUrl: './hero-home.component.scss'
})
export class HeroHomeComponent {
  readonly roles = ['AIwithCare Co-Founder and CEO', "Brigham & Women's Hospital", 'Harvard Medical School'];
  readonly tags = [
    'Healthcare AI CEO',
    'Practicing Cardiac Intensivist',
    'BWH Director of the Accelerator for Clinical Transformation',
  ];
}
