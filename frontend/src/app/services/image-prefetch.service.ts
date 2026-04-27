import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImagePrefetchService {
  private done = new Set<string>();

  prefetch(urls: string[]): void {
    if (typeof window === 'undefined') return;
    const run = () => {
      for (const url of urls) {
        if (this.done.has(url)) continue;
        this.done.add(url);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      }
    };
    'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(run, { timeout: 3000 })
      : setTimeout(run, 1000);
  }
}
