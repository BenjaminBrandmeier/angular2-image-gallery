import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {Angular2ImageGalleryModule} from './app/angular2imagegallery.module';

export {Angular2ImageGalleryModule} from './app/angular2imagegallery.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(Angular2ImageGalleryModule);
