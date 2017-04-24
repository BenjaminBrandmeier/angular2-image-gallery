# Provide your own metadata JSON

You are able to do that, but it's not the original intent of this project. 

## 1. Gallery parameter
      
Define the input parameter `[metadataUri]` to point to the remote endpoint where the images metadata JSON is stored.

```javascript
<gallery [metadataUri]="'http://oidamo.de/angular2-image-gallery/assets/img/gallery/data.json'"></gallery>
```

## 2. Expected JSON format

The currently expected JSON format looks like this:

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

This is an example for one image. You define the ordering of your images. The dimensions (preview_xxs, preview_xs, preview_s, etc.) are mandatory.

The convert script served with this project creates this exact data structure plus additional metadata which will be consumed by the gallery in upcoming versions.
