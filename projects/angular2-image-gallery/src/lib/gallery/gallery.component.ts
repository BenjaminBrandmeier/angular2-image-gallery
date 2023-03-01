import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { ImageService } from '../services/image.service'
import { Subscription } from 'rxjs/internal/Subscription'
import { HttpClient } from '@angular/common/http'
import { ImageMetadata } from '../data/image-metadata'

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass'],
})
export class GalleryComponent implements OnInit, OnDestroy, OnChanges {
  gallery: any[] = []
  imageDataStaticPath: string = 'assets/img/gallery/'
  imageMetadataUri: string = ''
  dataFileName: string = 'data.json'
  images: ImageMetadata[] = []
  minimalQualityCategory = 'preview_xxs'
  viewerSubscription: Subscription
  rowIndex: number = 0
  rightArrowInactive: boolean = false
  leftArrowInactive: boolean = false

  @Input('flexBorderSize') providedImageMargin: number = 3
  @Input('flexImageSize') providedImageSize: number = 7
  @Input('galleryName') providedGalleryName: string = ''
  @Input('metadataUri') providedMetadataUri: string = undefined
  @Input('maxRowsPerPage') rowsPerPage: number = 200

  @Output() viewerChange = new EventEmitter<boolean>()

  @ViewChild('galleryContainer', { static: true }) galleryContainer: ElementRef
  @ViewChildren('imageElement') imageElements: QueryList<any>

  @HostListener('window:scroll', ['$event']) triggerCycle(event: any): void {
    this.loadImagesInsideView()
  }

  @HostListener('window:resize', ['$event']) windowResize(event: any): void {
    this.render()
  }

  constructor(public imageService: ImageService, public http: HttpClient, public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchDataAndRender()
    this.viewerSubscription = this.imageService.showImageViewerChanged$.subscribe((visibility: boolean) =>
      this.viewerChange.emit(visibility)
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    // input params changed
    this.imageMetadataUri = this.determineMetadataPath()

    if (!changes['providedGalleryName']?.isFirstChange()) {
      this.fetchDataAndRender()
    }

    this.render()
  }

  ngOnDestroy(): void {
    if (this.viewerSubscription) {
      this.viewerSubscription.unsubscribe()
    }
  }

  openImageViewer(img: any): void {
    this.imageService.updateImages(this.images)
    this.imageService.updateSelectedImageIndex(this.images.indexOf(img))
    this.imageService.showImageViewer(true)
  }

  /**
   * direction (-1: left, 1: right)
   */
  navigate(direction: number): void {
    if ((direction === 1 && this.rowIndex < this.gallery.length - this.rowsPerPage) || (direction === -1 && this.rowIndex > 0)) {
      this.rowIndex += this.rowsPerPage * direction
    }
    this.refreshArrowState()
    this.render()
  }

  calcImageMargin(): number {
    const galleryWidth = this.getGalleryWidth()
    const ratio = galleryWidth / 1920
    return Math.round(Math.max(1, this.providedImageMargin * ratio))
  }

  private fetchDataAndRender(): void {
    this.http.get(this.imageMetadataUri).subscribe((data: ImageMetadata[]) => {
      this.images = data
      this.imageService.updateImages(this.images)

      this.images.forEach((image) => {
        image.viewerImageLoaded = false
        image.srcAfterFocus = ''
      })

      this.render()
    }, this.handleErrorWhenLoadingImages)
  }

  private handleErrorWhenLoadingImages = (err) => {
    if (this.providedMetadataUri) {
      console.error(`Provided endpoint '${this.providedMetadataUri}' did not serve metadata correctly or in the expected format.
      See here for more information: https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md,
      Original error: ${err}`)
    } else {
      console.error(`Did you run the convert script from angular2-image-gallery for your images first? Original error: ${err}`)
    }
  }

  private determineMetadataPath() {
    let imageMetadataUri = this.providedMetadataUri

    if (!this.providedMetadataUri) {
      imageMetadataUri =
        this.providedGalleryName !== ''
          ? `${this.imageDataStaticPath + this.providedGalleryName}/${this.dataFileName}`
          : this.imageDataStaticPath + this.dataFileName
    }

    return imageMetadataUri
  }

  private render(): void {
    this.gallery = []

    let tempRow = [this.images[0]]
    let currentRowIndex = 0
    let i = 0

    for (i; i < this.images.length; i++) {
      while (this.images[i + 1] && this.shouldAddCandidate(tempRow, this.images[i + 1])) {
        i++
      }
      if (this.images[i + 1]) {
        tempRow.pop()
      }
      this.gallery[currentRowIndex++] = tempRow

      tempRow = [this.images[i + 1]]
    }

    this.scaleGallery()
  }

  private shouldAddCandidate(imgRow: any[], candidate: any): boolean {
    const oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow)
    imgRow.push(candidate)
    const newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow)

    return Math.abs(oldDifference) > Math.abs(newDifference)
  }

  private calcRowHeight(imgRow: any[]): number {
    const originalRowWidth = this.calcOriginalRowWidth(imgRow)

    const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth
    return imgRow[0].resolutions[this.minimalQualityCategory].height * ratio
  }

  private calcOriginalRowWidth(imgRow: any[]): number {
    let originalRowWidth = 0
    imgRow.forEach((img) => {
      const individualRatio = this.calcIdealHeight() / img.resolutions[this.minimalQualityCategory].height
      img.resolutions[this.minimalQualityCategory].width = img.resolutions[this.minimalQualityCategory].width * individualRatio
      img.resolutions[this.minimalQualityCategory].height = this.calcIdealHeight()
      originalRowWidth += img.resolutions[this.minimalQualityCategory].width
    })

    return originalRowWidth
  }

  private isPaginationActive = () => !this.rightArrowInactive || !this.leftArrowInactive
  private calcIdealHeight = (): number => this.getGalleryWidth() / (80 / this.providedImageSize) + 100
  private getGalleryWidth = (): number => this.galleryContainer.nativeElement.clientWidth
  private isLastRow = (imgRow) => imgRow === this.gallery[this.gallery.length - 1]

  private scaleGallery(): void {
    let maximumGalleryImageHeight = 0

    this.gallery.slice(this.rowIndex, this.rowIndex + this.rowsPerPage).forEach((imgRow) => {
      const originalRowWidth = this.calcOriginalRowWidth(imgRow)
      const calculatedRowWidth = this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()

      const ratio = this.isLastRow(imgRow) ? 1 : calculatedRowWidth / originalRowWidth

      imgRow.forEach((img) => {
        img.width = img.resolutions[this.minimalQualityCategory].width * ratio
        img.height = img.resolutions[this.minimalQualityCategory].height * ratio
        maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img.height)
      })
    })

    this.minimalQualityCategory = maximumGalleryImageHeight > 375 ? 'preview_xs' : 'preview_xxs'

    this.refreshArrowState()
    this.loadImagesInsideView()
  }

  private loadImagesInsideView() {
    this.changeDetectorRef.detectChanges()

    this.images.forEach((image: ImageMetadata, index: number) => {
      const imageElements = this.imageElements.toArray()

      if (this.isPaginationActive() || this.isScrolledIntoView(imageElements[index]?.nativeElement)) {
        image.srcAfterFocus = image.resolutions[this.minimalQualityCategory].path
      }
    })
  }

  private isScrolledIntoView(element: HTMLElement): boolean {
    if (!element) {
      return false
    }
    const elementTop = element.getBoundingClientRect().top
    const elementBottom = element.getBoundingClientRect().bottom
    const viewableHeight = document.documentElement.clientHeight

    return elementTop < viewableHeight && elementBottom >= 0
  }

  private refreshArrowState(): void {
    this.leftArrowInactive = this.rowIndex == 0
    this.rightArrowInactive = this.rowIndex >= this.gallery.length - this.rowsPerPage
  }
}
