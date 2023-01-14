import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import process from 'process'
import appRoot from 'app-root-path'
import gm from 'gm'
import mkdirp from 'mkdirp'
import one from 'onecolor'

type ImageMetadata = {
  name: string
  date: string
  dominantColor?: string
  resolutions: {
    [resolution: string]: {
      path: string
      width: string
      height: string
    }
  }
}

const resolutions = [
  { name: 'preview_xxs', height: 375 },
  { name: 'preview_xs', height: 768 },
  { name: 'preview_s', height: 1080 },
  { name: 'preview_m', height: 1600 },
  { name: 'preview_l', height: 2160 },
  { name: 'preview_xl', height: 2880 },
  { name: 'raw', height: undefined },
]

async function execute() {
  const argv = minimist(process.argv.slice(2))
  const [webPath, targetDirectory, sourceDirectory, sortFunction] = await parseArguments(argv)
  let imageMetadata = await convert(targetDirectory, sourceDirectory)
  imageMetadata = await provideImageInformation(webPath, imageMetadata, targetDirectory)
  imageMetadata = await sortFunction(imageMetadata)
  await saveMetadataFile(imageMetadata, targetDirectory)
}

async function parseArguments(argv: minimist.ParsedArgs): Promise<any[]> {
  let webPath = 'assets/img/gallery/'
  let targetDirectory = appRoot.path + '/src/assets/img/gallery/'

  if (argv['gName'] !== undefined) {
    let galleryName = argv['gName']
    console.log(`Gallery name provided - '${galleryName}'.`)
    targetDirectory = targetDirectory + argv['gName'] + '/'
    webPath = webPath + argv['gName'] + '/'
  }

  if (argv['outputDir']) {
    let outputDirectory = argv['outputDir']
    if (outputDirectory.indexOf(outputDirectory.length) != '/') {
      outputDirectory += '/'
    }
    targetDirectory = outputDirectory
  }

  if (argv['remoteBaseUrl']) {
    let remoteBaseUrl = argv['remoteBaseUrl']
    if (remoteBaseUrl.indexOf(remoteBaseUrl.length) != '/') {
      remoteBaseUrl += '/'
    }
    webPath = remoteBaseUrl
  }
  const sourceDirectory = determineSourceDirectory(argv)

  await logInfo(`\nImages will be scanned from this location:\n${sourceDirectory}`)
  await logInfo(`\nImages will be exported to this location:\n${targetDirectory}`)
  await logInfo(`\nImages will be expected during runtime at this location:\n${webPath}\n`)

  const sortFunction = await determineSortFunction(argv)

  return [webPath, targetDirectory, sourceDirectory, sortFunction]
}

function determineSourceDirectory(argv: minimist.ParsedArgs) {
  if (argv['_'].length == 0) {
    exitWithError('No path specified!', 'Usage: node node_modules/angular2-image-gallery/convert.js <path/to/your/images>')
  } else if (argv['_'].length > 1) {
    exitWithError(
      'Illegally specified more than one argument!',
      'Usage: node node_modules/angular2-image-gallery/convert.js <path/to/your/images>'
    )
  }
  return path.join(argv._[0], '/')
}

async function logInfo(message: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(message)
  await new Promise((resolve) => setTimeout(resolve, 0))
}

function exitWithError(shortMessage: string, longMessage: string) {
  console.error(`\nERROR! ${shortMessage}`)
  console.log(`\n${longMessage}\n`)
  process.exit(1)
}

async function convert(targetDirectory: string, sourceDirectory: string): Promise<ImageMetadata[]> {
  createFolderStructure(targetDirectory)

  let files = fs.readdirSync(sourceDirectory)

  let allImagesMetadata = []
  console.log('\nConverting images...')
  for (const file of files) {
    const filePath = path.join(sourceDirectory, file)
    if (isConvertableImage(filePath)) {
      allImagesMetadata = await identifyAndConvertImage(filePath, file, targetDirectory, allImagesMetadata)
    }
  }
  console.log('...done.')
  return allImagesMetadata
}

function isConvertableImage(filePath: string): boolean {
  const extension = filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length)
  return fs.lstatSync(filePath).isFile() && isSupportedExtension(extension)
}

function createFolderStructure(targetDirectory: string): void {
  console.log('\nCreating folder structure...')
  mkdirp.sync(targetDirectory + 'raw')

  for (let resolution of resolutions) {
    mkdirp.sync(targetDirectory + resolution.name)
  }

  console.log('...done.')
}

function copyRawImageToAssetFolder(filePath: string, targetDirectory: string, fileName: string) {
  fs.createReadStream(filePath).pipe(fs.createWriteStream(targetDirectory + 'raw/' + fileName))
}

function initializeBasicImageMetadata(features, allImagesMetadata: ImageMetadata[], fileName: string) {
  let dateTimeOriginal = undefined
  if (features['Profile-EXIF']) {
    dateTimeOriginal = features['Profile-EXIF']['Date Time Original']
  }

  return allImagesMetadata.concat({
    name: fileName,
    date: dateTimeOriginal,
    resolutions: {},
  })
}

async function identifyAndConvertImage(
  filePath: string,
  fileName: string,
  targetDirectory: string,
  allImagesMetadata: ImageMetadata[]
): Promise<ImageMetadata[]> {
  return new Promise((resolve, reject) => {
    try {
      gm(filePath).identify(function (err, features) {
        if (err) throw err
        allImagesMetadata = initializeBasicImageMetadata(features, allImagesMetadata, fileName)
        copyRawImageToAssetFolder(filePath, targetDirectory, fileName)
        createVariousImageResolutions(filePath, fileName, targetDirectory, resolve, reject, allImagesMetadata)
      })
    } catch (err) {
      console.log('error when identifying', err)
      reject(err)
    }
  })
}

async function createVariousImageResolutions(
  filePath: string,
  fileName: string,
  targetDirectory: string,
  overallResolve: (value: PromiseLike<unknown> | unknown) => void,
  overallReject: (reason?: any) => void,
  allImagesMetadata: ImageMetadata[]
): Promise<void> {
  for (const resolution of resolutions.filter((r) => r.name !== 'raw')) {
    await new Promise<void>((resolve, reject) => {
      try {
        gm(filePath)
          .resize(null, resolution.height)
          .autoOrient()
          .quality(95)
          .write(targetDirectory + resolution.name + '/' + fileName, (err) => {
            if (err) {
              console.log('error when resizing image', err)
              reject()
              overallReject()
              throw err
            }
            resolve()
          })
      } catch {
        reject()
        overallReject()
      }
    })
  }
  console.log('Converted', filePath)
  overallResolve(allImagesMetadata)
}

async function provideImageInformation(
  webPath: string,
  allImagesMetadata: ImageMetadata[],
  targetDirectory: string
): Promise<ImageMetadata[]> {
  console.log('\nProviding image information...')

  for (let imgMetadata of allImagesMetadata) {
    for (let resolution of resolutions) {
      let filePath = targetDirectory + resolution.name + '/' + imgMetadata.name

      await new Promise<void>((resolve, reject) => {
        gm(filePath).size(function (err, size) {
          if (err) throw err

          imgMetadata.resolutions[resolution.name] = {
            path: webPath + resolution.name + '/' + imgMetadata.name,
            width: size.width,
            height: size.height,
          }

          gm(filePath)
            .resize(250, 250)
            .colors(1)
            .toBuffer('RGB', function (err, buffer) {
              if (err) {
                reject()
                throw err
              }

              imgMetadata['dominantColor'] = '#' + buffer.slice(0, 3).toString('hex')

              resolve()
            })
        })
      })
    }
  }

  console.log('...done.')
  return allImagesMetadata
}

async function saveMetadataFile(sortedMetadataArray, targetDirectory: string): Promise<void> {
  let metadataAsJSON = JSON.stringify(sortedMetadataArray, null, null)
  console.log('\nSaving metadata file...')

  await fs.writeFile(targetDirectory + 'data.json', metadataAsJSON, function (err) {
    if (err) throw err
    console.log('...done.\n')
  })
}

function calcRelativeLuminance(color): number {
  return Math.sqrt(0.299 * Math.pow(color.red(), 2) + 0.587 * Math.pow(color.green(), 2) + 0.114 * Math.pow(color.blue(), 2))
}

// http://stackoverflow.com/a/15030117/810595
function isSupportedExtension(format) {
  // prettier-ignore
  return ["3FR", "8BIM", "8BIMTEXT", "8BIMWTEXT", "APP1", "APP1JPEG", "ART", "ARW", "AVS", "BIE", "BMP", "BMP2", "BMP3", "CACHE", "CALS", "CAPTION", "CIN", "CMYK", "CMYKA", "CR2", "CRW", "CUR", "CUT", "DCM", "DCR", "DCX", "DNG", "DPS", "DPX", "EPDF", "EPI", "EPS", "EPS2", "EPS3", "EPSF", "EPSI", "EPT", "EPT2", "EPT3", "EXIF", "FAX", "FITS", "FRACTAL", "FPX", "GIF", "GIF87", "GRADIENT", "GRAY", "HISTOGRAM", "HRZ", "HTML", "ICB", "ICC", "ICM", "ICO", "ICON", "IDENTITY", "IMAGE", "INFO", "IPTC", "IPTCTEXT", "IPTCWTEXT", "JBG", "JBIG", "JNG", "JP2", "JPC", "JPEG", "JPG", "K25", "KDC", "LABEL", "M2V", "MAP", "MAT", "MATTE", "MIFF", "MNG", "MONO", "MPC", "MPEG", "MPG", "MRW", "MSL", "MTV", "MVG", "NEF", "NULL", "OTB", "P7", "PAL", "PALM", "PBM", "PCD", "PCDS", "PCL", "PCT", "PCX", "PDB", "PDF", "PEF", "PFA", "PFB", "PGM", "PGX", "PICON", "PICT", "PIX", "PLASMA", "PNG", "PNG24", "PNG32", "PNG8", "PNM", "PPM", "PREVIEW", "PS", "PS2", "PS3", "PSD", "PTIF", "PWP", "RAF", "RAS", "RGB", "RGBA", "RLA", "RLE", "SCT", "SFW", "SGI", "SHTML", "STEGANO", "SUN", "SVG", "TEXT", "TGA", "TIFF", "TILE", "TIM", "TOPOL", "TTF", "UIL", "UYVY", "VDA", "VICAR", "VID", "VIFF", "VST", "WBMP", "WMF", "WPG", "X", "X3F", "XBM", "XC", "XCF", "XMP", "XPM", "XV", "XWD", "YUV"]
    .includes(format.toUpperCase());
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

async function sortByCreationDate(imageMetadata: ImageMetadata[]): Promise<ImageMetadata[]> {
  console.log('\nSorting images by actual creation time...')

  imageMetadata.sort(function (a, b) {
    if (a.date > b.date) {
      return 1
    } else if (a.date == b.date) {
      return 0
    } else {
      return -1
    }
  })

  console.log('...done.')
  return imageMetadata
}

async function sortByFileName(imageMetadata: ImageMetadata[]): Promise<ImageMetadata[]> {
  console.log('\nSorting images by file name...')
  imageMetadata.sort((a, b) => a.name.localeCompare(b.name))
  console.log('...done.')
  return imageMetadata
}

async function sortByPrimaryColor(imageMetadata: ImageMetadata[]): Promise<ImageMetadata[]> {
  console.log('\nSorting images by primary color...')

  let iterations = 8
  let sortedColorsArray = []
  for (let i = 0; i < iterations; i++) {
    let specificColorSpectrum = imageMetadata.filter(function (imageMetadata) {
      let color = one(imageMetadata['dominantColor'])
      let hue = color.hue()
      return hue <= i * 0.125 && hue > i * 0.125 - 0.125
    })

    specificColorSpectrum.sort(function (a, b) {
      let colorA = one(a['dominantColor'])
      let colorB = one(b['dominantColor'])
      let luminanceA = calcRelativeLuminance(colorA)
      let luminanceB = calcRelativeLuminance(colorB)
      if (i % 2 == 1) {
        return luminanceA - luminanceB
      } else {
        return luminanceB - luminanceA
      }
    })

    sortedColorsArray[i] = specificColorSpectrum
  }
  const sortedByColors = flatten(sortedColorsArray)

  console.log('...done.')

  return sortedByColors
}

async function determineSortFunction(argv: minimist.ParsedArgs) {
  switch (true) {
    case argv['d']:
      await logInfo('Going to sort images by actual creation time (EXIF).')
      return sortByCreationDate
    case argv['n']:
      await logInfo('Going to sort images by file name.')
      return sortByFileName
    case argv['c']:
      await logInfo('Going to sort images by color (experimental).')
      return sortByPrimaryColor
    default:
      await logInfo('No sorting mechanism specified! Default mode will be sorting by file name.')
      return sortByFileName
  }
}

await execute()
