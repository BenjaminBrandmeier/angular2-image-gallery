# Angular 2 Image Gallery

[![npm version](https://img.shields.io/npm/v/angular2-image-gallery?style=for-the-badge)](https://img.shields.io/npm/v/angular2-image-gallery?style=for-the-badge)
[![npm downloads](https://img.shields.io/npm/dm/angular2-image-gallery?style=for-the-badge)](https://www.npmjs.com/package/angular2-image-gallery)

----> **compatible with Angular 20 (and older versions)** <----

Responsive image gallery designed for high resolution images.

The project consists of a gallery (+ viewer) and a script for image preparation.

## Demo

[https://oidamo.de/blog/gallery-demo](https://oidamo.de/blog/gallery-demo)

### Fundamentals

Before Using the gallery, you have to process all of your images with the **convert** script.

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

`-d` sort chronologically by the original creation time

`-c` sort by primary image color

Additional optional parameter to support multiple galleries. Add it if you want to put your images into a separate gallery.

`--gName=yourGalleryName`

#### 5. Embed gallery in your template

```javascript
<gallery
    [flexBorderSize]="3"
    [flexImageSize]="7"
    [galleryName]="'yourGalleryName'"
    [maxRowsPerPage]="100"
    (viewerChange)="yourNotificationFunction($event)"
    [includeViewer]="true"
    [lazyLoadGalleryImages]="true"
></gallery>
```

All parameters are optional.

* **[flexBorderSize]** used to define the border thickness between the images within the gallery.
* **[flexImageSize]** used to define the size of the images with the gallery (not the viewer).
* **[galleryName]** used when having multiple galleries.
* **[maxRowsPerPage]** maximum rows per gallery, this will add navigation arrows once the threshold is reached.
* **[viewerChange]** event fires once the viewer component gets opened or closed.
* **[includeViewer]** provides an option to manually place the viewer outside the default DOM structure. Defaults to true.
* **[lazyLoadGalleryImages]** allows to disable lazy loading of gallery images. All images will be loaded at once when set to false. Defaults to true.

## Different use cases
### Fetching images from an external data source

Fetching your images from an external data source: [CLICK HERE](https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md)

### I don't want to use the convert script and provide my own metadata JSON

This is possible, but not the intent of this project. Please [CLICK HERE](https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/ownJSON.md)

## Troubleshooting

If the conversion process fails, make sure you have enough swap space provided.

If you experience any other issues, please raise an issue on GitHub.

## Changelog

### 20.0.0

* Angular 20 support

### 19.0.0

* Angular 19 support

### 18.0.0

* Angular 18 support

### 17.0.0

* Angular 17 support

### 16.0.0

* Angular 16 support

### 15.2.0

* Adding optional parameter **[lazyLoadGalleryImages]** to turn off lazy loading when set to false and instead load all gallery images at once.

### 15.1.0

* Adding optional parameter [includeViewer] to support use cases where viewer is placed outside the gallery component manually

### 15.0.0

* Angular 15 support
* Performance improvements

### 14.1.0

* Refactor convert script entirely
* Provide smoother output for image conversion process

### 14.0.0

* Angular 14 support
