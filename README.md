# ng2imggallery
An experimental image gallery built with Angular 2.
For image preparation node.js and graphicsmagick was used.

This project is pretty much work in progress with plenty ideas in mind.

The alpha version contains lots of expected functionality. Be prepared for a smooth beta version. :)
## Demo

http://oidamo.de/ng2imggallery/0.1.0-alpha/

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

This project is based on [angular/angular-cli](https://github.com/angular/angular-cli).

In an earlier version I used the [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) seed.

## Troubleshooting

If the convert process fails make sure you have some swap space ready.
