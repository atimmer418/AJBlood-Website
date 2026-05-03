import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

import { routes } from './app.routes';

const BREAKPOINTS = [480, 960, 1600, 2400];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),
    {
      provide: IMAGE_LOADER,
      useValue: ({ src, width }: ImageLoaderConfig) => {
        const w = width
          ? BREAKPOINTS.find((bw: number) => bw >= width) ?? BREAKPOINTS[BREAKPOINTS.length - 1]
          : 1600;
        return `assets/optimized/${src}-${w}.webp`;
      },
    },
    { provide: IMAGE_CONFIG, useValue: { breakpoints: BREAKPOINTS } },
  ]
};
