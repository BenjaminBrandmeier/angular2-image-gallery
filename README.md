# ng2imggallery
An experimental image gallery built with Angular 2, node.js and imagemagick.

This project is pretty much work in progress. Hoping to release a first alpha soon.
## Pre-requirements

The following dependency are installed locally by the setup.sh file:

NodeJS
```bash
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install --yes nodejs
```

imagemagick
```bash
echo "yes" | sudo apt-get install imagemagick imagemagick-doc
npm install imagemagick
```

imagemagick setup
```bash
export MAGICK_THREAD_LIMIT=1
```

mkdirp
```bash
npm install mkdirp
```

## Usage
Run the following commands to get going.

Check pre-requirements to see if you need to run the setup
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

Currently this project uses the [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) seed.

However I'd like to switch to [angular/angular-cli](https://github.com/angular/angular-cli) as soon as it's ready, which means e.g. ng2-material compatible.
