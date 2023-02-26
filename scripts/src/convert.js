"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var minimist_1 = require("minimist");
var process_1 = require("process");
var app_root_path_1 = require("app-root-path");
var gm_1 = require("gm");
var mkdirp_1 = require("mkdirp");
var onecolor_1 = require("onecolor");
var constants_1 = require("./constants");
var resolutions = [
    { name: 'preview_xxs', height: 375 },
    { name: 'preview_xs', height: 768 },
    { name: 'preview_s', height: 1080 },
    { name: 'preview_m', height: 1600 },
    { name: 'preview_l', height: 2160 },
    { name: 'preview_xl', height: 2880 },
    { name: 'raw', height: undefined },
];
function execute() {
    return __awaiter(this, void 0, void 0, function () {
        var argv, _a, webPath, targetDirectory, sourceDirectory, sortFunction, imageMetadata;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    argv = (0, minimist_1["default"])(process_1["default"].argv.slice(2));
                    return [4 /*yield*/, parseArguments(argv)];
                case 1:
                    _a = _b.sent(), webPath = _a[0], targetDirectory = _a[1], sourceDirectory = _a[2], sortFunction = _a[3];
                    return [4 /*yield*/, convert(targetDirectory, sourceDirectory)];
                case 2:
                    imageMetadata = _b.sent();
                    return [4 /*yield*/, provideImageInformation(webPath, imageMetadata, targetDirectory)];
                case 3:
                    imageMetadata = _b.sent();
                    return [4 /*yield*/, sortFunction(imageMetadata)];
                case 4:
                    imageMetadata = _b.sent();
                    return [4 /*yield*/, saveMetadataFile(imageMetadata, targetDirectory)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function parseArguments(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var webPath, targetDirectory, galleryName, outputDirectory, remoteBaseUrl, sourceDirectory, sortFunction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    webPath = 'assets/img/gallery/';
                    targetDirectory = app_root_path_1["default"].path + '/src/assets/img/gallery/';
                    if (argv['gName'] !== undefined) {
                        galleryName = argv['gName'];
                        console.log("Gallery name provided - '".concat(galleryName, "'."));
                        targetDirectory = targetDirectory + argv['gName'] + '/';
                        webPath = webPath + argv['gName'] + '/';
                    }
                    if (argv['outputDir']) {
                        outputDirectory = argv['outputDir'];
                        if (outputDirectory.indexOf(outputDirectory.length) != '/') {
                            outputDirectory += '/';
                        }
                        targetDirectory = outputDirectory;
                    }
                    if (argv['remoteBaseUrl']) {
                        remoteBaseUrl = argv['remoteBaseUrl'];
                        if (remoteBaseUrl.indexOf(remoteBaseUrl.length) != '/') {
                            remoteBaseUrl += '/';
                        }
                        webPath = remoteBaseUrl;
                    }
                    sourceDirectory = determineSourceDirectory(argv);
                    return [4 /*yield*/, logInfo("\nImages will be scanned from this location:\n".concat(sourceDirectory))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, logInfo("\nImages will be exported to this location:\n".concat(targetDirectory))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, logInfo("\nImages will be expected during runtime at this location:\n".concat(webPath, "\n"))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, determineSortFunction(argv)];
                case 4:
                    sortFunction = _a.sent();
                    return [2 /*return*/, [webPath, targetDirectory, sourceDirectory, sortFunction]];
            }
        });
    });
}
function determineSourceDirectory(argv) {
    if (argv['_'].length == 0) {
        exitWithError('No path specified!', 'Usage: node node_modules/angular2-image-gallery/convert.js <path/to/your/images>');
    }
    else if (argv['_'].length > 1) {
        exitWithError('Illegally specified more than one argument!', 'Usage: node node_modules/angular2-image-gallery/convert.js <path/to/your/images>');
    }
    return path_1["default"].join(argv._[0], '/');
}
function logInfo(message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    console.log(message);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function exitWithError(shortMessage, longMessage) {
    console.error("\nERROR! ".concat(shortMessage));
    console.log("\n".concat(longMessage, "\n"));
    process_1["default"].exit(1);
}
function convert(targetDirectory, sourceDirectory) {
    return __awaiter(this, void 0, void 0, function () {
        var files, allImagesMetadata, _i, files_1, file, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createFolderStructure(targetDirectory)];
                case 1:
                    _a.sent();
                    files = fs_1["default"].readdirSync(sourceDirectory);
                    allImagesMetadata = [];
                    return [4 /*yield*/, logInfo('\nConverting images...')];
                case 2:
                    _a.sent();
                    _i = 0, files_1 = files;
                    _a.label = 3;
                case 3:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    file = files_1[_i];
                    filePath = path_1["default"].join(sourceDirectory, file);
                    if (!isConvertableImage(filePath)) return [3 /*break*/, 5];
                    return [4 /*yield*/, identifyAndConvertImage(filePath, file, targetDirectory, allImagesMetadata)];
                case 4:
                    allImagesMetadata = _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('...done.');
                    return [2 /*return*/, allImagesMetadata];
            }
        });
    });
}
function isConvertableImage(filePath) {
    var extension = filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length);
    return fs_1["default"].lstatSync(filePath).isFile() && isSupportedExtension(extension);
}
function createFolderStructure(targetDirectory) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, resolutions_1, resolution;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logInfo('\nCreating folder structure...')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, mkdirp_1["default"])(targetDirectory + 'raw')];
                case 2:
                    _a.sent();
                    _i = 0, resolutions_1 = resolutions;
                    _a.label = 3;
                case 3:
                    if (!(_i < resolutions_1.length)) return [3 /*break*/, 6];
                    resolution = resolutions_1[_i];
                    return [4 /*yield*/, (0, mkdirp_1["default"])(targetDirectory + resolution.name)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('...done.');
                    return [2 /*return*/];
            }
        });
    });
}
function copyRawImageToAssetFolder(filePath, targetDirectory, fileName) {
    fs_1["default"].createReadStream(filePath).pipe(fs_1["default"].createWriteStream(targetDirectory + 'raw/' + fileName));
}
function initializeBasicImageMetadata(features, allImagesMetadata, fileName) {
    var _a;
    var dateTaken = (_a = features['Profile-EXIF']) === null || _a === void 0 ? void 0 : _a['Date Time Original'];
    return allImagesMetadata.concat({ name: fileName, date: dateTaken, resolutions: {} });
}
function identifyAndConvertImage(filePath, fileName, targetDirectory, allImagesMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        (0, gm_1["default"])(filePath).identify(function (err, features) {
                            if (err)
                                throw err;
                            allImagesMetadata = initializeBasicImageMetadata(features, allImagesMetadata, fileName);
                            copyRawImageToAssetFolder(filePath, targetDirectory, fileName);
                            createVariousImageResolutions(filePath, fileName, targetDirectory, resolve, reject, allImagesMetadata);
                        });
                    }
                    catch (err) {
                        console.log('error when identifying', err);
                        reject(err);
                    }
                })];
        });
    });
}
function createVariousImageResolutions(filePath, fileName, targetDirectory, overallResolve, overallReject, allImagesMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, _a, resolution;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _loop_1 = function (resolution) {
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        try {
                                            (0, gm_1["default"])(filePath)
                                                .resize(null, resolution.height)
                                                .autoOrient()
                                                .quality(95)
                                                .write(targetDirectory + resolution.name + '/' + fileName, function (err) {
                                                if (err) {
                                                    console.log('error when resizing image', err);
                                                    reject();
                                                    overallReject();
                                                    throw err;
                                                }
                                                resolve();
                                            });
                                        }
                                        catch (_a) {
                                            reject();
                                            overallReject();
                                        }
                                    })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = resolutions.filter(function (r) { return r.name !== 'raw'; });
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    resolution = _a[_i];
                    return [5 /*yield**/, _loop_1(resolution)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('Converted', filePath);
                    overallResolve(allImagesMetadata);
                    return [2 /*return*/];
            }
        });
    });
}
function provideImageInformation(webPath, allImagesMetadata, targetDirectory) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_2, _i, allImagesMetadata_1, imgMetadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logInfo('\nProviding image information...')];
                case 1:
                    _a.sent();
                    _loop_2 = function (imgMetadata) {
                        var _loop_3, _b, resolutions_2, resolution;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _loop_3 = function (resolution) {
                                        var filePath;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    filePath = targetDirectory + resolution.name + '/' + imgMetadata.name;
                                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                            (0, gm_1["default"])(filePath).size(function (err, size) {
                                                                if (err)
                                                                    throw err;
                                                                imgMetadata.resolutions[resolution.name] = {
                                                                    path: webPath + resolution.name + '/' + imgMetadata.name,
                                                                    width: size.width,
                                                                    height: size.height
                                                                };
                                                                (0, gm_1["default"])(filePath)
                                                                    .resize(250, 250)
                                                                    .colors(1)
                                                                    .toBuffer('RGB', function (err, buffer) {
                                                                    if (err) {
                                                                        reject();
                                                                        throw err;
                                                                    }
                                                                    imgMetadata['dominantColor'] = '#' + buffer.slice(0, 3).toString('hex');
                                                                    resolve();
                                                                });
                                                            });
                                                        })];
                                                case 1:
                                                    _d.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _b = 0, resolutions_2 = resolutions;
                                    _c.label = 1;
                                case 1:
                                    if (!(_b < resolutions_2.length)) return [3 /*break*/, 4];
                                    resolution = resolutions_2[_b];
                                    return [5 /*yield**/, _loop_3(resolution)];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3:
                                    _b++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, allImagesMetadata_1 = allImagesMetadata;
                    _a.label = 2;
                case 2:
                    if (!(_i < allImagesMetadata_1.length)) return [3 /*break*/, 5];
                    imgMetadata = allImagesMetadata_1[_i];
                    return [5 /*yield**/, _loop_2(imgMetadata)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log('...done.');
                    return [2 /*return*/, allImagesMetadata];
            }
        });
    });
}
function saveMetadataFile(sortedMetadataArray, targetDirectory) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataAsJSON;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadataAsJSON = JSON.stringify(sortedMetadataArray, null, null);
                    return [4 /*yield*/, logInfo('\nSaving metadata file...')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1["default"].writeFile(targetDirectory + 'data.json', metadataAsJSON, function (err) {
                            if (err)
                                throw err;
                            console.log('...done.\n');
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function calcRelativeLuminance(color) {
    return Math.sqrt(0.299 * Math.pow(color.red(), 2) + 0.587 * Math.pow(color.green(), 2) + 0.114 * Math.pow(color.blue(), 2));
}
function isSupportedExtension(format) {
    // http://stackoverflow.com/a/15030117/810595
    return constants_1.supportedFormats.includes(format.toUpperCase());
}
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function sortByCreationDate(imageMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logInfo('\nSorting images by actual creation time...')];
                case 1:
                    _a.sent();
                    imageMetadata.sort(function (a, b) {
                        if (a.date > b.date) {
                            return 1;
                        }
                        else if (a.date == b.date) {
                            return 0;
                        }
                        else {
                            return -1;
                        }
                    });
                    console.log('...done.');
                    return [2 /*return*/, imageMetadata];
            }
        });
    });
}
function sortByFileName(imageMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('\nSorting images by file name...');
            imageMetadata.sort(function (a, b) { return a.name.localeCompare(b.name); });
            console.log('...done.');
            return [2 /*return*/, imageMetadata];
        });
    });
}
function sortByPrimaryColor(imageMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        var iterations, sortedColorsArray, _loop_4, i, sortedByColors;
        return __generator(this, function (_a) {
            console.log('\nSorting images by primary color...');
            iterations = 8;
            sortedColorsArray = [];
            _loop_4 = function (i) {
                var specificColorSpectrum = imageMetadata.filter(function (imageMetadata) {
                    var color = (0, onecolor_1["default"])(imageMetadata['dominantColor']);
                    var hue = color.hue();
                    return hue <= i * 0.125 && hue > i * 0.125 - 0.125;
                });
                specificColorSpectrum.sort(function (a, b) {
                    var colorA = (0, onecolor_1["default"])(a['dominantColor']);
                    var colorB = (0, onecolor_1["default"])(b['dominantColor']);
                    var luminanceA = calcRelativeLuminance(colorA);
                    var luminanceB = calcRelativeLuminance(colorB);
                    if (i % 2 == 1) {
                        return luminanceA - luminanceB;
                    }
                    else {
                        return luminanceB - luminanceA;
                    }
                });
                sortedColorsArray[i] = specificColorSpectrum;
            };
            for (i = 0; i < iterations; i++) {
                _loop_4(i);
            }
            sortedByColors = flatten(sortedColorsArray);
            console.log('...done.');
            return [2 /*return*/, sortedByColors];
        });
    });
}
function determineSortFunction(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = true;
                    switch (_a) {
                        case argv['d']: return [3 /*break*/, 1];
                        case argv['n']: return [3 /*break*/, 3];
                        case argv['c']: return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, logInfo('Going to sort images by actual creation time (EXIF).')];
                case 2:
                    _b.sent();
                    return [2 /*return*/, sortByCreationDate];
                case 3: return [4 /*yield*/, logInfo('Going to sort images by file name.')];
                case 4:
                    _b.sent();
                    return [2 /*return*/, sortByFileName];
                case 5: return [4 /*yield*/, logInfo('Going to sort images by color (experimental).')];
                case 6:
                    _b.sent();
                    return [2 /*return*/, sortByPrimaryColor];
                case 7: return [4 /*yield*/, logInfo('No sorting mechanism specified! Default mode will be sorting by file name.')];
                case 8:
                    _b.sent();
                    return [2 /*return*/, sortByFileName];
            }
        });
    });
}
await execute();
