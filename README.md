# ng2imggallery
A responsive image gallery designed for high resolution images.
The project consists of a gallery, a viewer and a script for image preparation.

There is still a lot to do. I will provide a feature list in the near feature.

If you'd like to contribute, I'm happy to accept pull requests. :)

## Demo

http://oidamo.de/ng2imggallery/0.4.0/

## Currently used tools

- Angular 2.3.1
- NodeJS 7.3.0
- Angular-CLI 1.0.0-beta.24
- graphicsmagick

## Pre-requirements

Run npm install in root directory and under tools directory.

For windows users get graphicsmagick here:
http://www.graphicsmagick.org/download.html

For ubuntu users install graphicsmagick via:
apt-get install graphicsmagick

## Usage
After checking pre-requirements run the following commands to get going:

Copy all your images for the image gallery to "tools/images_to_convert/":
```bash
node convert.js
```
Start the developing server with:
```bash
ng serve
```

## Troubleshooting

If the convert process fails, make sure you have some swap space ready.
