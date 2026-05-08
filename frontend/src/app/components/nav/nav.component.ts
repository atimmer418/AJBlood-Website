import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  readonly isDarkNav = computed(() =>
    ['/', '/publications'].includes(this.currentUrl() ?? '')
  );

  readonly navLinks = [
    { label: 'Home',             path: '/' },
    { label: 'About',            path: '/about' },
    { label: 'Expertise',        path: '/expertise' },
    { label: 'Publications',     path: '/publications' },
    { label: 'Insights & Media', path: '/insights' },
    { label: 'Podcast',          path: '/podcast', comingSoon: true },
  ];

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
