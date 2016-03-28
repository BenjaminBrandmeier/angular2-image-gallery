var im = require('imagemagick');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var process = require("process");

var projectRoot = getProjectRootPath();
var basePath = projectRoot + "/tools/images_to_convert";
var assetBasePath = projectRoot + "/src/assets/img/gallery/";
var rawBasePath = "assets/img/gallery/raw/";
var thumbnailBasePath = "assets/img/gallery/thumbnail/";
var imageMetadataArray = [];

function convert() {
  createFolderStructure();

  fs.readdir(basePath, function(err, files) {
    if (err) throw err;

    // TODO: Implement different sorting mechanisms (e.g. by filename, manually, ...)
    var sortFunction = sortByCreationDate;

    var processCount = 0;
    files.forEach(function(file, index) {

      var filePath = path.join(basePath, file);
      if (fs.lstatSync(filePath).isFile()) {
        im.identify(filePath, function(err, features) {
          if (err) {
            console.log(filePath)
            throw err;
          }

          var fileMetadata = {
            url: rawBasePath + file,
            thumbnail: thumbnailBasePath + file,
            date: features.properties['exif:datetimeoriginal'],
            width: features.width,
            height: features.height
          };

          imageMetadataArray[index] = fileMetadata;

          // copy raw images to assets folder
          fs.createReadStream(filePath).pipe(fs.createWriteStream(assetBasePath + 'raw/' + file));

          // create thumbnails and save them
          createThumbnails(file, filePath);

          if (++processCount == files.length) {
            // after image processing sort image metadata as requested
            sortFunction();

            // save meta data file
            saveMetadataFile();
          }
        });
      } else {
        ++processCount;
      }
    });
  });
}

function createFolderStructure() {
  console.log('Creating folder structure ...');
  mkdirp.sync(assetBasePath + 'raw', function(err) {
    if (err) throw err;
  });
  mkdirp.sync(assetBasePath + 'thumbnail', function(err) {
    if (err) throw err;
  });
  console.log('done.');
}

function createThumbnails(file, filePath) {
  im.resize({
    srcPath: filePath,
    dstPath: assetBasePath + 'thumbnail/' + file,
    height: 200
  }, function(err, stdout, stderr) {
    if (err) throw err;
  });
}

function sortByCreationDate() {
  console.log('Sorting images by actual creation time ...');

  imageMetadataArray.sort(function(a, b) {
    if (a.date > b.date) {
      return 1;
    } else if (a.date == b.date) {
      return 0;
    } else {
      return -1;
    }
  });
  console.log('done.');
}

function saveMetadataFile() {
  var metadataAsJSON = JSON.stringify(imageMetadataArray, null, 4);
  console.log('Saving metadata file ...');

  fs.writeFile(assetBasePath + 'data.json', metadataAsJSON, function(err) {
    if (err) throw err;
    console.log('done.');
  });
}

function getProjectRootPath()
{
    var toolsPath = path.dirname(require.main.filename);
    var pathElements = toolsPath.split('/');
    pathElements.pop();
    return pathElements.join('/');
}

convert();
