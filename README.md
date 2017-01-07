# Angular 2 Image Gallery
[![Build Status](https://travis-ci.org/BenjaminBrandmeier/ng2imggallery.svg?branch=master)](https://travis-ci.org/BenjaminBrandmeier/ng2imggallery)

A responsive image gallery designed for high resolution images.

The project consists of a gallery, a viewer and a script for image preparation.

If you'd like to contribute, I'm happy to accept pull requests.

## Demo

http://oidamo.de/angular2-image-gallery/

## Currently used tools

- Angular 2.3.1
- NodeJS 7.3.0
- Angular-CLI 1.0.0-beta.24
- graphicsmagick

## How to use the gallery in your project
### Pre-requirements
Install **node** and **graphicsmagick**.

For windows users: http://www.graphicsmagick.org/download.html

For ubuntu users run: `apt-get install graphicsmagick`

### Embed in your project

1.  Install angular2-image-gallery
  ```bash
npm install angular2-image-gallery --save
  ```

2.  Import angular2-image-gallery in your Angular 2 module
  ```javascript
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Angular2ImageGalleryModule <-----
  ],
  ```

3. Import scripts (when using angular-cli add these lines in polyfills.ts)
  ```javascript
import 'web-animations-js/web-animations.min';
import 'hammerjs/hammer';
  ```

4. Import styles (when using angular-cli add this line in styles.css)
  ```javascript
@import '~@angular/material/core/theming/prebuilt/deeppurple-amber.css';
  ```

5. Run convert script
  ```bash
node node_modules/angular2-image-gallery/convert.js <path/to/your/images>
  ```

6. Embed gallery in your template
  ```javascript
<gallery [flexBorderSize]="3" [flexImageSize]="7"></gallery>
  ```

The parameters flexBorderSize and flexImageSize are optional. 

You may play around on the demo site to find out what parameters suit your needs.

That's it, start your application and have a look!

## Troubleshooting

If the conversion process fails, make sure you have enough swap space provided.

If you experience any other issues, please raise an issue on GitHub.
