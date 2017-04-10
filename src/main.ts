import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {Angular2ImageGalleryModule} from "./app/angular2imagegallery.module";
import {environment} from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(Angular2ImageGalleryModule);
