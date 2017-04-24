# How to fetch your images from an external/remote data source?

## 1. Gallery parameter

Define the input parameter `[metadataUri]` to point to the remote endpoint where the images metadata is stored.

The images metadata will be created by the convert script.

```javascript
  <gallery [metadataUri]="'http://oidamo.de/angular2-image-gallery/assets/img/gallery/data.json'"></gallery>
```

## 2. Additional convert options

```bash
node node_modules/angular2-image-gallery/convert.js <path/to/your/images>
```

`--outputDir` defines the export location of the images after conversion.

`--remoteBaseUrl` defines where the images will be fetched from during runtime, possibly a different host.

## 3. Explain expected serving structure
The created folder structure will look like this:

    -- preview_xxs
      -- your_image01.jpg
         ...
    -- preview_xs
      -- your_image01.jpg
         ...
    -- preview_s
      -- your_image01.jpg
         ...
    -- preview_m
      -- your_image01.jpg
         ...
    -- preview_l
      -- your_image01.jpg
         ...
    -- preview_xl
      -- your_image01.jpg
         ...
    -- raw
      -- your_image01.jpg
         ...

The gallery expects this exact folder structure served from your server specified via `--remoteBaseUrl`.

## 4. CORS
Please take into consideration to allow cross origin requests on your server 
when trying to load images from a different origin.

## 5. But I'd like to provide my own JSON

You are able to do that, but it is not recommended. The currently expected JSON format looks like this:

```javascript
[
  {
    "preview_xxs": {
      "path": "http://example.com/angular2-image-gallery/some_path/image001.jpg",
      "width": 500,
      "height": 375
    },
    "preview_xs": {
      "path": "http://example.com/hello/some_other_path/image001.jpg",
      "width": 1024,
      "height": 768
    },
    "preview_s": {
      "path": "http://example.com/angular2-image-gallery/but_you_probably/image001.jpg",
      "width": 1440,
      "height": 1080
    },
    "preview_m": {
      "path": "http://example.com/angular2-image-gallery/might_want_to_have/image001.jpg",
      "width": 2133,
      "height": 1600
    },
    "preview_l": {
      "path": "http://example.com/angular2-image-gallery/something_like/image001.jpg",
      "width": 2880,
      "height": 2160
    },
    "preview_xl": {
      "path": "http://example.com/xl/image001.jpg",
      "width": 3840,
      "height": 2880
    },
    "raw": {
      "path": "http://example.com/raw/image001.jpg",
      "width": 1400,
      "height": 1050
    },
    "dominantColor": "#a6a6a6"
  },
  ...
]
```

This is an example for one image. So you define the ordering. The dimensions (preview_xxs, preview_xs, preview_s, etc.) are mandatory.

The convert script creates this exact data structure plus additional metadata which will be consumed by the gallery in upcoming versions.
