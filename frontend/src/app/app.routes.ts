import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Dr. Alexander J. Blood'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About — Dr. Alexander J. Blood'
  },
  {
    path: 'expertise',
    loadComponent: () => import('./pages/expertise/expertise.component').then(m => m.ExpertiseComponent),
    title: 'Expertise — Dr. Alexander J. Blood'
  },
  {
    path: 'publications',
    loadComponent: () => import('./pages/publications/publications.component').then(m => m.PublicationsComponent),
    title: 'Publications — Dr. Alexander J. Blood'
  },
  {
    path: 'insights',
    loadComponent: () => import('./pages/insights/insights.component').then(m => m.InsightsComponent),
    title: 'Insights & Media — Dr. Alexander J. Blood'
  },
  {
    path: 'podcast',
    loadComponent: () => import('./pages/podcast/podcast.component').then(m => m.PodcastComponent),
    title: 'Podcast — Dr. Alexander J. Blood'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact — Dr. Alexander J. Blood'
  },
  {
    path: 'insights/the-broken-middle',
    loadComponent: () =>
      import('./pages/insights/article-broken-middle/article-broken-middle.component')
        .then(m => m.ArticleBrokenMiddleComponent),
    title: 'The Broken Middle — Dr. Alexander J. Blood'
  },
  { path: '**', redirectTo: '' }
];
