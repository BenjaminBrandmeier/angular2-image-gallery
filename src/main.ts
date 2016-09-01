import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Router, ROUTER_DIRECTIVES} from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { environment, ViewerComponent, GalleryComponent } from './app/';
import { APP_BASE_HREF } from '@angular/common';

if (environment.production) {
  enableProdMode();
}

bootstrap(GalleryComponent, [HTTP_PROVIDERS]);
// bootstrap(GalleryAppComponent, [provide(APP_BASE_HREF, {useValue : '/' })]);
