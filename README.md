# ng2imggallery
A responsive image gallery designed for high resolution images.
The project consists of a gallery, a viewer and a script for image preparation.

The current state is still pretty much work in progress with plenty of ideas in mind.

## Demo

http://oidamo.de/ng2imggallery/0.2.0/

## Pre-requirements

The following dependencies are installed locally by the setup.sh file:

- NodeJS 5.x
- graphicsmagick
- curl

## Usage
Run the following commands to get going.

Check pre-requirements to see if you need to run the setup:
```bash
sh tools/setup.sh
```
Copy all your images for the image gallery to "tools/images_to_convert/":
```bash
node convert.js
```
Start the developing server with:
```bash
ng serve
```

## Built with

For image prepration node.js and graphicsmagick was used.

The project is built with [angular/angular-cli](https://github.com/angular/angular-cli).

In an earlier version I used the [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) seed.

## Troubleshooting

If the convert process fails make sure you have some swap space ready.
