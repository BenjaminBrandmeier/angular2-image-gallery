import watch from 'node-watch';
import { exec } from 'child_process';
const dir = process.argv[2];

const doCopy = () => {
  console.log(new Date().toLocaleTimeString() + '> COPYING DATA...');
  exec(`rm -R ${dir}/@martapanc/angular2-image-gallery`);
  exec(`cp -R ./dist/angular2-image-gallery ${dir}/@martapanc/`);
  console.log(new Date().toLocaleTimeString() + '> COPIED TO!');
};

doCopy();

watch(['./projects/angular2-image-gallery/src/', './dist/angular2-image-gallery/package.json'], { recursive: true }, function(evt, name) {
  doCopy();
});
