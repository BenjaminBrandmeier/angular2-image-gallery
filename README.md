# Angular 2 Image Gallery

[![npm version](https://img.shields.io/npm/v/angular2-image-gallery?style=for-the-badge)](https://img.shields.io/npm/v/angular2-image-gallery?style=for-the-badge)
[![npm downloads](https://img.shields.io/npm/dm/angular2-image-gallery?style=for-the-badge)](https://www.npmjs.com/package/angular2-image-gallery)

----> **compatible with Angular 14+** <----

Responsive image gallery designed for high resolution images.

The project consists of a gallery (+ viewer) and a script for image preparation.

### Demo

[https://oidamo.de/gallery-demo.html](https://oidamo.de/gallery-demo.html)

### Fundamentals
Before using the gallery, you have to process all of your images with the **convert** script. 

The processed images will be stored to your applications assets.

The viewer takes care of an optimal image quality being served based on the users screen resolution.

### Installation

#### 1. Install graphicsmagick

Follow the instructions: [http://www.graphicsmagick.org/README.html#installation](http://www.graphicsmagick.org/README.html#installation)

#### 2. Install dependencies

```bash
npm install angular2-image-gallery hammerjs --save
```

#### 3. Import modules

```javascript
imports: [
  ...,
  Angular2ImageGalleryModule,
  HammerModule
],
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

#### 4. Embed gallery in your template

```javascript
<gallery
    [flexBorderSize]="3"
    [flexImageSize]="7"
    [galleryName]="'yourGalleryName'"
    [maxRowsPerPage]="100"
    (viewerChange)="yourNotificationFunction($event)">
</gallery>
```

All parameters are optional. You may play around on the demo site to find out what parameters suit your needs.

The viewerChange event fires once the viewer component gets opened or closed.

## Different use cases
### Fetching images from an external data source

Fetching your images from an external data source: [CLICK HERE](https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md)

### I don't want to use the convert script and provide my own metadata JSON

This is possible, but not the intent of this project. Please [CLICK HERE](https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/ownJSON.md)

## Troubleshooting

If the conversion process fails, make sure you have enough swap space provided.

If you experience any other issues, please raise an issue on GitHub.
