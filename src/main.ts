import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { GalleryAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

// bootstrap(GalleryAppComponent);

bootstrap(GalleryAppComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS]);
// bootstrap(GalleryAppComponent, [provide(APP_BASE_HREF, {useValue : '/' })]);
