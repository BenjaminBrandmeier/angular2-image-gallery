# Angular 2 Image Gallery
[![Build Status](https://travis-ci.org/BenjaminBrandmeier/angular2-image-gallery.svg?branch=master)](https://travis-ci.org/BenjaminBrandmeier/angular2-image-gallery)
![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=RGhGVlA1TFRTM3NybzNLUktwZjdpNmI2NEo3Qkp4S2pqaVc3a3BqM1MyOD0tLVRUVml3MnI4bUhGWWxuY25hUmREV3c9PQ==--8e070941683e3c345b75213325bedb26be4c93c4)
[![npm version](https://badge.fury.io/js/angular2-image-gallery.svg)](https://badge.fury.io/js/angular2-image-gallery)
[![npm downloads](https://img.shields.io/npm/dt/angular2-image-gallery.svg)](https://www.npmjs.com/package/angular2-image-gallery)

Responsive image gallery designed for high resolution images.

The project consists of a gallery, a viewer and a script for image preparation.

Before using the gallery, you have to process all of your images that will be part of your gallery with the node.js script. The processed images will be stored to your applications assets or, if you'd like to, at a remote location. During runtime everything runs client-side and there is no separate server-side communication involved. The viewer takes care that an optimal image quality is served based on the device resolution.

## Demo

http://oidamo.de/angular2-image-gallery/

## How to use the gallery in your project
### Pre-requirements
Install **node (>= 4.2.2)** and **graphicsmagick**: http://www.graphicsmagick.org/README.html#installation

### Embed in your project

#### 1. Install angular2-image-gallery

```bash
npm install angular2-image-gallery --save
```

#### 2. Import angular2-image-gallery in your Angular 2 module

```javascript
imports: [
  BrowserModule,
  FormsModule,
  HttpModule,
  Angular2ImageGalleryModule <-----
],
```

#### 3. Import scripts (when using angular-cli uncomment these lines in polyfills.ts)

```javascript
import 'web-animations-js/web-animations.min';
import 'hammerjs/hammer';

import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';

import 'web-animations-js';
```

#### 4. Run convert script

```bash
node node_modules/angular2-image-gallery/convert.js <path/to/your/images>
```
Add a flag to define the order of the images inside the gallery

`-n` sort by file name (default)

`-d` sort chronologically by the original creation time (e.g. for coverages of a wedding)

`-c` sort by primary image color

Additional optional parameter to support multiple galleries. Add it if you want to put your images into a separate gallery.

`--gName=yourGalleryName` 

#### 5. Embed gallery in your template

```javascript
<gallery 
    [flexBorderSize]="3" 
    [flexImageSize]="7"
    [galleryName]="'yourGalleryName'" 
    (viewerChange)="yourNotificationFunction($event)">
</gallery>
```

All parameters are optional. You may play around on the demo site to find out what parameters suit your needs.

The viewerChange event notifies you when the viewer component gets opened or closed.

That's it, start your application and have a look!

## Fetching images from an external data source

If you'd like to know how you could fetch your images from an external data source [CLICK HERE](https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md)

## I don't want to use the convert script and provide my own metadata JSON

This is possible, but not the intent of this project. Please [CLICK HERE](https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/ownJSON.md)


## Currently used tools

- Angular 4.0.0
- NodeJS 7.3.0
- Angular-CLI 1.0.0
- graphicsmagick

## Troubleshooting

If the conversion process fails, make sure you have enough swap space provided.

If you experience any other issues, please raise an issue on GitHub.
