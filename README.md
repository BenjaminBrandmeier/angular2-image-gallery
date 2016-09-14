# ng2imggallery
A responsive image gallery designed for high resolution images.
The project consists of a gallery, a viewer and a script for image preparation.

The current state is still pretty much work in progress with plenty of ideas in mind.

## Demo

http://oidamo.de/ng2imggallery/0.2.0/

## Currently used tools

- Angular 2.0.0-rc.7
- NodeJS 4.5.0
- NPM 3.10.7
- Angular-CLI 1.0.0-beta.11-webpack.9-4
- graphicsmagick

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
