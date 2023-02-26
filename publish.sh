#!/usr/bin/env bash

npm run lib
cd dist/angular2-image-gallery/
npm publish --registry=https://npm.pkg.github.com  --scope=@martapanc
