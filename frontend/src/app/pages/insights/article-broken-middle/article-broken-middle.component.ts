import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-article-broken-middle',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './article-broken-middle.component.html',
  styleUrl: './article-broken-middle.component.scss'
})
export class ArticleBrokenMiddleComponent {}
