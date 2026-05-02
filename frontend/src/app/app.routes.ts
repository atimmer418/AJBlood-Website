import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Dr. AJ Blood'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About — Dr. AJ Blood'
  },
  {
    path: 'expertise',
    loadComponent: () => import('./pages/expertise/expertise.component').then(m => m.ExpertiseComponent),
    title: 'Expertise — Dr. AJ Blood'
  },
  {
    path: 'publications',
    loadComponent: () => import('./pages/publications/publications.component').then(m => m.PublicationsComponent),
    title: 'Publications — Dr. AJ Blood'
  },
  {
    path: 'insights',
    loadComponent: () => import('./pages/insights/insights.component').then(m => m.InsightsComponent),
    title: 'Insights & Media — Dr. AJ Blood'
  },
  {
    path: 'podcast',
    loadComponent: () => import('./pages/podcast/podcast.component').then(m => m.PodcastComponent),
    title: 'Podcast — Dr. AJ Blood'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact — Dr. AJ Blood'
  },
  {
    path: 'insights/the-broken-middle',
    loadComponent: () =>
      import('./pages/insights/article-broken-middle/article-broken-middle.component')
        .then(m => m.ArticleBrokenMiddleComponent),
    title: 'The Broken Middle — Dr. AJ Blood'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Privacy Policy — Dr. AJ Blood'
  },
  { path: '**', redirectTo: '' }
];
