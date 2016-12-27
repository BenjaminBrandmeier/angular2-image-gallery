var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var process = require("process");
var gm = require('gm');
var sizeOf = require('image-size');

var sortFunction;
var projectRoot = getProjectRootPath();
var toConvertAbsoluteBasePath = projectRoot + "/tools/images_to_convert";
var assetsAbsoluteBasePath = projectRoot + "/src/assets/img/gallery/";
var previewRelativePath = "assets/img/gallery/";
var imageMetadataArray = [];
var resolutions = [
    {name: 'preview_xxs', height: 375},
    {name: 'preview_xs', height: 768},
    {name: 'preview_s', height: 1080},
    {name: 'preview_m', height: 1600},
    {name: 'preview_l', height: 2160},
    {name: 'preview_xl', height: 2880}
];

function convert() {
    createFolderStructure();

    var files = fs.readdirSync(toConvertAbsoluteBasePath);

    // sortFunction = sortByCreationDate;
    sortFunction = sortByFileName;

    processFiles(files, 0);

    console.log('\nConverting images...');
}

function createFolderStructure() {
    console.log('\nCreating folder structure...');
    mkdirp.sync(assetsAbsoluteBasePath + 'raw', function (err) {
        if (err) throw err;
    });

    for (var i in resolutions) {
        mkdirp.sync(assetsAbsoluteBasePath + resolutions[i].name, function (err) {
            if (err) throw err;
        });
    }

    console.log('...done (folder structure)');
}

function processFiles(files, fidx) {
    if (fidx < files.length) {
        var file = files[fidx];
        if (file != '.gitignore') {
            var filePath = path.join(toConvertAbsoluteBasePath, file);
            if (fs.lstatSync(filePath).isFile()) {
                identifyImage(files, fidx, filePath, file);
            }
            else {
                processFiles(files, ++fidx);
            }
        }
        else {
            processFiles(files, ++fidx);
        }
    }
    else {
        provideImageInformation();
        // after image processing sort image metadata as requested
        sortFunction();
    }
}

function identifyImage(files, fidx, filePath, file) {
    gm(filePath)
        .identify(function (err, features) {
            if (err) {
                console.log(filePath)
                console.log(err)
                throw err;
            }

            var imageMetadata = {
                name: file,
                date: features['Profile-EXIF']['Date Time Original'],
            };

            imageMetadataArray.push(imageMetadata);

            // copy raw image to assets folder
            fs.createReadStream(filePath).pipe(fs.createWriteStream(assetsAbsoluteBasePath + 'raw/' + file));

            createPreviewImageSync(files, fidx, filePath, file, 0);
        });
}

function createPreviewImageSync(files, fidx, filePath, file, index) {
    // create various preview images

    gm(filePath)
        .resize(null, resolutions[index].height)
        .write(assetsAbsoluteBasePath + resolutions[index].name + '/' + file, function (err) {
            if (err) throw err;
            if (index < resolutions.length - 1) {
                createPreviewImageSync(files, fidx, filePath, file, ++index);
            } else {
                process.stdout.write('Converted ' + (fidx) + ' images.\r');
                processFiles(files, ++fidx);
            }
        });
}

function provideImageInformation() {
    imageMetadataArray.forEach(function (imgMetadata) {
        resolutions.forEach(function (resolution) {
            var filePath = assetsAbsoluteBasePath + resolution.name + '/' + imgMetadata.name;

            var dimensions = sizeOf(filePath);
            imgMetadata[resolution.name] = {};
            imgMetadata[resolution.name]['path'] = previewRelativePath + resolution.name + '/' + imgMetadata.name;
            imgMetadata[resolution.name]['width'] = dimensions.width;
            imgMetadata[resolution.name]['height'] = dimensions.height;
        });

        var filePath = assetsAbsoluteBasePath + 'raw/' + imgMetadata.name;

        var dimensions = sizeOf(filePath);
        imgMetadata['raw'] = {};
        imgMetadata['raw']['path'] = previewRelativePath + 'raw/' + imgMetadata.name;
        imgMetadata['raw']['width'] = dimensions.width;
        imgMetadata['raw']['height'] = dimensions.height;
    });
}

function sortByCreationDate() {
    console.log('\n\nSorting images by actual creation time...');

    imageMetadataArray.sort(function (a, b) {
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

    imageMetadataArray.sort(function (a, b) {
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

    fs.writeFile(assetsAbsoluteBasePath + 'data.json', metadataAsJSON, function (err) {
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
