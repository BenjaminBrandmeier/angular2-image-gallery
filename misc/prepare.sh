#!/bin/bash

set -eux

rm -rf src/lib

npm run dist

cp package.json src/lib/
cp README.md src/lib/
cp misc/convert.js src/lib/

cp src/app/gallery/gallery.component.html src/lib/gallery
cp src/app/viewer/viewer.component.html src/lib/viewer
cp src/app/demo/demo.component.html src/lib/demo

cp src/app/gallery/gallery.component.css src/lib/gallery
cp src/app/viewer/viewer.component.css src/lib/viewer
cp src/app/demo/demo.component.css src/lib/demo

node_modules/.bin/ng2-inline.cmd -o . -b src/lib/viewer src/lib/viewer/*.js -c
node_modules/.bin/ng2-inline.cmd -o . -b src/lib/gallery src/lib/gallery/*.js -c
node_modules/.bin/ng2-inline.cmd -o . -b src/lib/demo src/lib/demo/*.js -c
