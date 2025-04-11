import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {provideNgxMask} from 'ngx-mask'
import { authInterceptor } from './interceptors/auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    //provideHttpClient(withInterceptors([myInterceptor])) # que tipo de interceptor eu deveria criar?
    provideHttpClient(
      withFetch(), // habilita uso do fetch
      withInterceptors([authInterceptor])
    ),
    provideNgxMask({})
  ]
};

