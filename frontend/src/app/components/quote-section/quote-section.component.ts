import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-quote-section',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './quote-section.component.html',
  styleUrl: './quote-section.component.scss'
})
export class QuoteSectionComponent {}
