# ng2imggallery
An experimental image gallery built with Angular 2, node.js and imagemagick.

This project is pretty much work in progress. Hoping to release a first alpha soon.
## Prerequirements

The following dependency are installed locally by the setup.sh file:

node.js, mkdirp, imagemagick
## Usage
Run the following commands to get going.
```bash
sh tools/setup.sh
```
Copy all your images for the image gallery to tools/images_to_convert/
```bash
node convert.js
```
Start the developing server with:
```bash
npm run
```

## Based on

This project uses the [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) seed.

However I'd like to switch to [angular/angular-cli](https://github.com/angular/angular-cli) as soon as it's ready.
