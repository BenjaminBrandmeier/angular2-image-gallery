var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var process = require("process");
var gm = require('gm');
var appRoot = require('app-root-path');
var argv = require('minimist')(process.argv.slice(2));
var one = require('onecolor')

var sortFunction;
var projectRoot = appRoot.path;
var toConvertAbsoluteBasePath;
var assetsAbsoluteBasePath = projectRoot + "/src/assets/img/gallery/";
var previewRelativePath = "assets/img/gallery/";
var imageMetadataArray = [];
var resolutions = [
    {name: 'preview_xxs', height: 375},
    {name: 'preview_xs', height: 768},
    {name: 'preview_s', height: 1080},
    {name: 'preview_m', height: 1600},
    {name: 'preview_l', height: 2160},
    {name: 'preview_xl', height: 2880},
    {name: 'raw', height: undefined}
];

function init() {
    if (argv["gName"] !== undefined) {
        var galleryName = argv['gName'];
        console.log(`Gallery name provided - '${galleryName}'.`);
        assetsAbsoluteBasePath = assetsAbsoluteBasePath + argv['gName'] + "/";
        previewRelativePath = previewRelativePath + argv['gName'] + "/";
    }
    if (argv["outputDir"]) {
        var outputDirectory = argv["outputDir"];
        if (outputDirectory.indexOf(outputDirectory.length) != '/') {
          outputDirectory += '/';
        }
        assetsAbsoluteBasePath = outputDirectory;
    }
    if (argv["remoteBaseUrl"]) {
        var remoteBaseUrl = argv["remoteBaseUrl"];
        if (remoteBaseUrl.indexOf(remoteBaseUrl.length) != '/') {
          remoteBaseUrl += '/';
        }
        previewRelativePath = remoteBaseUrl;
    }
    if (argv['_'].length == 0) {
        toConvertAbsoluteBasePath = projectRoot + "/images_to_convert";
        console.log('No path specified! Defaulting to ' + toConvertAbsoluteBasePath);
    } else if (argv['_'].length > 1) {
        console.log('Illegally specified more than one argument!');
    }
    else {
        toConvertAbsoluteBasePath = argv._[0];
        if (toConvertAbsoluteBasePath.indexOf(toConvertAbsoluteBasePath.length) != '/') {
            toConvertAbsoluteBasePath += '/';
        }
    }

    console.log(`\nImages will be scanned from this location:\n${toConvertAbsoluteBasePath}`);
    console.log(`\nImages will be exported to this location:\n${assetsAbsoluteBasePath}`);
    console.log(`\nImages will be expected during runtime at this location:\n${previewRelativePath}\n`);

    if (!argv['d'] && !argv['n'] && !argv['c']) {
        console.log('No sorting mechanism specified! Default mode will be sorting by file name.');
        sortFunction = sortByFileName;
    }
    if (argv['d']) {
        sortFunction = sortByCreationDate;
        console.log('Going to sort images by actual creation time (EXIF).');
    }
    if (argv['n']) {
        sortFunction = sortByFileName;
        console.log('Going to sort images by file name.');
    }
    if (argv['c']) {
        sortFunction = sortByPrimaryColor;
        console.log('Going to sort images by color (experimental).');
    }

    convert();
}

function convert() {
    createFolderStructure();

    var files = fs.readdirSync(toConvertAbsoluteBasePath);

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
        var extension = file.substring(file.lastIndexOf(".")+1, file.length);
        if (isSupportedExtension(extension)) {
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
        console.log('\n\nProviding image information...')
        provideImageInformation(imageMetadataArray, 0, resolutions, 0);
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

            var dateTimeOriginal = undefined;
            if (features['Profile-EXIF']) {
                dateTimeOriginal = features['Profile-EXIF']['Date Time Original'];
            }

            var imageMetadata = {
                name: file,
                date: dateTimeOriginal
            };

            imageMetadataArray.push(imageMetadata);

            // copy raw image to assets folder
            fs.createReadStream(filePath).pipe(fs.createWriteStream(assetsAbsoluteBasePath + 'raw/' + file));

            createPreviewImage(files, fidx, filePath, file, 0);
        });
}

function createPreviewImage(files, fidx, filePath, file, index) {
    // create various preview images

    gm(filePath)
        .resize(null, resolutions[index].height)
        .autoOrient()
        .quality(95)
        .write(assetsAbsoluteBasePath + resolutions[index].name + '/' + file, function (err) {
            if (err) throw err;
            if (index !== resolutions.length - 2) {
                // don't resize raw images
                createPreviewImage(files, fidx, filePath, file, ++index);
            } else {
                process.stdout.write('\rConverted ' + (fidx) + " images.");
                processFiles(files, ++fidx);
            }
        });
}

function provideImageInformation(imageMetadataArray, imgMetadataIdx, resolutions, resolutionIdx) {
    var imgMetadata = imageMetadataArray[imgMetadataIdx];
    var resolution = resolutions[resolutionIdx];

    var filePath = assetsAbsoluteBasePath + resolution.name + '/' + imgMetadata.name;

    gm(filePath)
        .size(function (err, size) {
            if (err) {
                console.log(filePath)
                console.log(err)
                throw err;
            }

            imgMetadata[resolution.name] = {};
            imgMetadata[resolution.name]['path'] = previewRelativePath + resolution.name + '/' + imgMetadata.name;
            imgMetadata[resolution.name]['width'] = size.width;
            imgMetadata[resolution.name]['height'] = size.height;

            if (resolutions.length - 1 == resolutionIdx) {
                gm(filePath)
                    .resize(250, 250)
                    .colors(1)
                    .toBuffer('RGB', function (err, buffer) {
                        if (err) throw err;
                        imgMetadata['dominantColor'] = '#' + buffer.slice(0, 3).toString('hex');

                        if (imageMetadataArray.length - 1 == imgMetadataIdx) {
                            console.log('...done (information)');
                            sortFunction();
                        }
                        else {
                            provideImageInformation(imageMetadataArray, ++imgMetadataIdx, resolutions, 0);
                        }
                    });
            }
            else {
                provideImageInformation(imageMetadataArray, imgMetadataIdx, resolutions, ++resolutionIdx);
            }
        });
}

function sortByCreationDate() {
    console.log('\nSorting images by actual creation time...');

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

    saveMetadataFile(imageMetadataArray);
}

function sortByFileName() {
    console.log('\nSorting images by file name...');

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

    saveMetadataFile(imageMetadataArray);
}

function sortByPrimaryColor() {
    console.log('\nSorting images by primary color...');

    var iterations = 8;
    var sortedColorsArray = [];
    for (var i = 0; i < iterations; i++) {
        var specificColorSpectrum = imageMetadataArray.filter(function(imageMetadata) {
            var color = one(imageMetadata['dominantColor']);
            var hue = color.hue();
            return hue <= i * 0.125 && hue > ((i * 0.125) - 0.125)
        });

        specificColorSpectrum.sort(function (a, b) {
            var colorA = one(a['dominantColor']);
            var colorB = one(b['dominantColor']);
            var luminanceA = calcRelativeLuminance(colorA);
            var luminanceB = calcRelativeLuminance(colorB);
            if (i % 2 == 1) {
                return luminanceA - luminanceB;
            } else {
                return luminanceB - luminanceA;
            }
        });

        sortedColorsArray[i] = specificColorSpectrum;
    }
    var sortedColorsArray = flatten(sortedColorsArray);

    console.log('...done (sorting)');

    saveMetadataFile(sortedColorsArray);
}

function saveMetadataFile(sortedMetadataArray) {
    var metadataAsJSON = JSON.stringify(sortedMetadataArray, null, null);
    console.log('\nSaving metadata file...');

    fs.writeFile(assetsAbsoluteBasePath + 'data.json', metadataAsJSON, function (err) {
        if (err) throw err;
        console.log('...done (metadata)');
    });
}

function calcRelativeLuminance(color) {
    return Math.sqrt(.299 * Math.pow(color.red(), 2) + .587 * Math.pow(color.green(), 2) + .114 * Math.pow(color.blue(), 2));
}

// http://stackoverflow.com/a/15030117/810595
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function isSupportedExtension(format) {
    var supportedFormats = ["3FR", "8BIM", "8BIMTEXT", "8BIMWTEXT", "APP1", "APP1JPEG", "ART", "ARW", "AVS", "BIE", "BMP", "BMP2", "BMP3", "CACHE", "CALS", "CAPTION", "CIN", "CMYK", "CMYKA", "CR2", "CRW", "CUR", "CUT", "DCM", "DCR", "DCX", "DNG", "DPS", "DPX", "EPDF", "EPI", "EPS", "EPS2", "EPS3", "EPSF", "EPSI", "EPT",
        "EPT2", "EPT3", "EXIF", "FAX", "FITS", "FRACTAL", "FPX", "GIF", "GIF87", "GRADIENT", "GRAY", "HISTOGRAM", "HRZ", "HTML", "ICB", "ICC", "ICM", "ICO", "ICON", "IDENTITY", "IMAGE", "INFO", "IPTC", "IPTCTEXT", "IPTCWTEXT", "JBG", "JBIG", "JNG", "JP2", "JPC", "JPEG", "JPG", "K25", "KDC", "LABEL", "M2V", "MAP", "MAT",
        "MATTE", "MIFF", "MNG", "MONO", "MPC", "MPEG", "MPG", "MRW", "MSL", "MTV", "MVG", "NEF", "NULL", "OTB", "P7", "PAL", "PALM", "PBM", "PCD", "PCDS", "PCL", "PCT", "PCX", "PDB", "PDF", "PEF", "PFA", "PFB", "PGM", "PGX", "PICON", "PICT", "PIX", "PLASMA", "PNG", "PNG24", "PNG32", "PNG8", "PNM", "PPM", "PREVIEW", "PS",
        "PS2", "PS3", "PSD", "PTIF", "PWP", "RAF", "RAS", "RGB", "RGBA", "RLA", "RLE", "SCT", "SFW", "SGI", "SHTML", "STEGANO", "SUN", "SVG", "TEXT", "TGA", "TIFF", "TILE", "TIM", "TOPOL", "TTF", "UIL", "UYVY", "VDA", "VICAR", "VID", "VIFF", "VST", "WBMP", "WMF", "WPG", "X", "X3F", "XBM", "XC", "XCF", "XMP", "XPM", "XV", "XWD", "YUV"];

    return supportedFormats.includes(format.toUpperCase());
}

init();
