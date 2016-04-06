import {bootstrap} from 'angular2/platform/browser';
import {GalleryApp} from './app/gallery';
import {provide} from 'angular2/core';
import {APP_BASE_HREF} from 'angular2/router';

bootstrap(GalleryApp, [provide(APP_BASE_HREF, {useValue : '/' })]);
