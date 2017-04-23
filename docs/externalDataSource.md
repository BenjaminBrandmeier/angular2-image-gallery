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
