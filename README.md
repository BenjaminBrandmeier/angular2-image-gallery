# Angular 2 Image Gallery
[![Build Status](https://travis-ci.org/BenjaminBrandmeier/ng2imggallery.svg?branch=master)](https://travis-ci.org/BenjaminBrandmeier/ng2imggallery)

A responsive image gallery designed for high resolution images.

The project consists of a gallery, a viewer and a script for image preparation.

If you'd like to contribute, I'm happy to accept pull requests.

## Demo

http://oidamo.de/ng2imggallery/

## Currently used tools

- Angular 2.3.1
- NodeJS 7.3.0
- Angular-CLI 1.0.0-beta.24
- graphicsmagick

## Pre-requirements

Install node, angular-cli and graphicsmagick.

For windows users:

http://www.graphicsmagick.org/download.html

For ubuntu users:
```bash
apt-get install graphicsmagick
```
## Getting started
Copy all your images to the folder **images_to_convert**.

Install dependencies:
```bash
npm install
```
Start images conversion process:
```bash
npm run convert
```
Start the development server with:
```bash
ng serve
```

## Embed in your project
I'm planning on publishing a npm package for this soon to make embedding even simpler.
For now, after the conversion of your images finished successfully, add the gallery, viewer and service as components/providers to your project and include the gallery inside your Angular 2 template as follows:

```bash
<gallery [flexBorderSize]="flexBorderSize" [flexImageSize]="flexImageSize"></gallery>
```

The parameters flexBorderSize and flexImageSize are optional. You may play around on the demo site to find out what parameters suit your needs.

## Troubleshooting

If the conversion process fails, make sure you have enough swap space provided.
