var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var process = require("process");
var gm = require('gm');

var sortFunction;
var projectRoot = getProjectRootPath();
var basePath = projectRoot + "/tools/images_to_convert";
var assetBasePath = projectRoot + "/src/assets/img/gallery/";
var rawBasePath = "assets/img/gallery/raw/";
var imageMetadataArray = [];
var resolutions = [
  { name: 'preview_xxs', height: 375 },
  { name: 'preview_xs', height: 768 },
  { name: 'preview_s', height: 1080 },
  { name: 'preview_m', height: 1600 },
  { name: 'preview_l', height: 2160 },
  { name: 'preview_xl', height: 2880 }
];

function convert() {
  createFolderStructure();

  var files = fs.readdirSync(basePath);

  // sortFunction = sortByCreationDate;
  sortFunction = sortByFileName;

  precheckFile(files, 0);

  console.log('\nConverting images...');
}

function createFolderStructure() {
  console.log('\nCreating folder structure...');
  mkdirp.sync(assetBasePath + 'raw', function(err) {
    if (err) throw err;
  });

  for (var i in resolutions) {
    mkdirp.sync(assetBasePath + resolutions[i].name, function(err) {
      if (err) throw err;
    });
  }

  console.log('...done (folder structure)');
}

function precheckFile(files, fidx) {
  if (fidx < files.length) {
    var file = files[fidx];
    if (file != '.gitignore') {
      var filePath = path.join(basePath, file);
      if (fs.lstatSync(filePath).isFile()) {
        identifyImage(files, fidx, filePath, file);
      }
      else {
        precheckFile(files, ++fidx);
      }
    }
    else {
      precheckFile(files, ++fidx);
    }
  }
  else {
    // after image processing sort image metadata as requested
    sortFunction();
  }
}

function identifyImage(files, fidx, filePath, file) {
  gm(filePath)
    .identify(function(err, features) {
      if (err) {
        console.log(filePath)
        console.log(err)
        throw err;
      }

      var fileMetadata = {
        name: file,
        raw: rawBasePath + file,
        date: features['Profile-EXIF']['Date Time Original'],
        width: features.size.width * (350/features.size.height),
        height: 350
      };

      imageMetadataArray.push(fileMetadata);

      // copy raw image to assets folder
      fs.createReadStream(filePath).pipe(fs.createWriteStream(assetBasePath + 'raw/' + file));

      createPreviewImageSync(files, fidx, filePath, file, 0);
    });
}

function createPreviewImageSync(files, fidx, filePath, file, index) {
  // create various preview images

    gm(filePath)
      .resize(null, resolutions[index].height)
      .write(assetBasePath + resolutions[index].name + '/' + file, function(err) {
        if (err) throw err;
        if (index < resolutions.length-1) {
          createPreviewImageSync(files, fidx, filePath, file, ++index);
        } else {
          process.stdout.write('Converted '+(fidx)+' images.\r');
          precheckFile(files, ++fidx);
        }
    });
}

function sortByCreationDate() {
  console.log('\n\nSorting images by actual creation time...');

  imageMetadataArray.sort(function(a, b) {
    if (a.date > b.date) {
      return 1;
    } else if (a.date == b.date) {
      return 0;
    } else {
      return -1;
    }
  });
  console.log('...done (sorting)');

  saveMetadataFile();
}

function sortByFileName() {
  console.log('\n\nSorting images by file name...');

  imageMetadataArray.sort(function(a, b) {
    if (a.name > b.name) {
      return 1;
    } else if (a.name == b.name) {
      return 0;
    } else {
      return -1;
    }
  });
  console.log('...done (sorting)');

  saveMetadataFile();
}

function saveMetadataFile() {
  var metadataAsJSON = JSON.stringify(imageMetadataArray, null, 4);
  console.log('\nSaving metadata file...');

  fs.writeFile(assetBasePath + 'data.json', metadataAsJSON, function(err) {
    if (err) throw err;
    console.log('...done (metadata)');
  });
}

function getProjectRootPath() {
  var toolsPath = path.dirname(require.main.filename);
  var pathElements = toolsPath.split(/[/|\\]/);
  pathElements.pop();
  return pathElements.join('/');
}

convert();
