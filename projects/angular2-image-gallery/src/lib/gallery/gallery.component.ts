import {
    Component, ViewChild, ElementRef, HostListener, ViewChildren,
    ChangeDetectorRef, QueryList, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy
} from '@angular/core'
import {ImageService} from '../services/image.service'
import {Subscription} from 'rxjs/internal/Subscription'
import {map} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy, OnChanges {
    @Input('flexBorderSize') providedImageMargin: number = 3
    @Input('flexImageSize') providedImageSize: number = 7
    @Input('galleryName') providedGalleryName: string = ''
    @Input('metadataUri') providedMetadataUri: string = undefined
    @Input('maxRowsPerPage') rowsPerPage: number = 200

    @Output() viewerChange = new EventEmitter<boolean>()

    @ViewChild('galleryContainer') galleryContainer: ElementRef
    @ViewChildren('imageElement') imageElements: QueryList<any>

    @HostListener('window:scroll', ['$event']) triggerCycle(event: any) {
        this.scaleGallery()
    }

    @HostListener('window:resize', ['$event']) windowResize(event: any) {
        this.render()
    }

    public gallery: any[] = []
    public imageDataStaticPath: string = 'assets/img/gallery/'
    public imageDataCompletePath: string = ''
    public dataFileName: string = 'data.json'
    public images: any[] = []
    public minimalQualityCategory = 'preview_xxs'
    public viewerSubscription: Subscription
    public rowIndex: number = 0
    public rightArrowInactive: boolean = false
    public leftArrowInactive: boolean = false

    constructor(public ImageService: ImageService, public http: HttpClient, public ChangeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.fetchDataAndRender()
        this.viewerSubscription = this.ImageService.showImageViewerChanged$
            .subscribe((visibility: boolean) => this.viewerChange.emit(visibility))
    }

    public ngOnChanges(changes: SimpleChanges) {
        // input params changed
        if (changes['providedGalleryName'] != null)
            this.fetchDataAndRender()
        else
            this.render()
    }

    public ngOnDestroy() {
        if (this.viewerSubscription) {
            this.viewerSubscription.unsubscribe()
        }
    }

    public openImageViewer(img: any) {
        this.ImageService.updateImages(this.images)
        this.ImageService.updateSelectedImageIndex(this.images.indexOf(img))
        this.ImageService.showImageViewer(true)
    }

    private fetchDataAndRender() {
        this.imageDataCompletePath = this.providedMetadataUri

        if (!this.providedMetadataUri) {
            this.imageDataCompletePath = this.providedGalleryName != '' ?
                this.imageDataStaticPath + this.providedGalleryName + '/' + this.dataFileName :
                this.imageDataStaticPath + this.dataFileName
        }

        this.http.get(this.imageDataCompletePath)
          .subscribe(
            (data: any[]) => {
                    this.images = data;
                    this.ImageService.updateImages(this.images)

                    this.images.forEach((image) => {
                      image['galleryImageLoaded'] = false
                      image['viewerImageLoaded'] = false
                      image['srcAfterFocus'] = ''
                    })
                    // twice, single leads to different strange browser behaviour
                    this.render()
                    this.render()
                },
                err => this.providedMetadataUri ?
                    console.error('Provided endpoint \'' + this.providedMetadataUri + '\' did not serve metadata correctly or in the expected format. \n\nSee here for more information: https://github.com/BenjaminBrandmeier/angular2-image-gallery/blob/master/docs/externalDataSource.md,\n\nOriginal error: ' + err) :
                    console.error('Did you run the convert script from angular2-image-gallery for your images first? Original error: ' + err),
                () => undefined)
    }

    private render() {
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

    private calcRowHeight(imgRow: any[]) {
        const originalRowWidth = this.calcOriginalRowWidth(imgRow)

        const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth
        const rowHeight = imgRow[0][this.minimalQualityCategory]['height'] * ratio

        return rowHeight
    }

    public calcImageMargin() {
        const galleryWidth = this.getGalleryWidth()
        const ratio = galleryWidth / 1920
        return Math.round(Math.max(1, this.providedImageMargin * ratio))
    }

    private calcOriginalRowWidth(imgRow: any[]) {
        let originalRowWidth = 0
        imgRow.forEach((img) => {
            const individualRatio = this.calcIdealHeight() / img[this.minimalQualityCategory]['height']
            img[this.minimalQualityCategory]['width'] = img[this.minimalQualityCategory]['width'] * individualRatio
            img[this.minimalQualityCategory]['height'] = this.calcIdealHeight()
            originalRowWidth += img[this.minimalQualityCategory]['width']
        })

        return originalRowWidth
    }

    private calcIdealHeight() {
        return this.getGalleryWidth() / (80 / this.providedImageSize) + 100
    }

    private getGalleryWidth() {
        if (this.galleryContainer.nativeElement.clientWidth === 0) {
            // IE11
            return this.galleryContainer.nativeElement.scrollWidth
        }
        return this.galleryContainer.nativeElement.clientWidth
    }

    private scaleGallery() {
        let imageCounter = 0
        let maximumGalleryImageHeight = 0

        this.gallery.slice(this.rowIndex, this.rowIndex + this.rowsPerPage).forEach((imgRow) => {
            const originalRowWidth = this.calcOriginalRowWidth(imgRow)

            if (imgRow !== this.gallery[this.gallery.length - 1]) {
                const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth

                imgRow.forEach((img: any) => {
                    img['width'] = img[this.minimalQualityCategory]['width'] * ratio
                    img['height'] = img[this.minimalQualityCategory]['height'] * ratio
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height'])
                    this.checkForAsyncLoading(img, imageCounter++)
                })
            }
            else {
                imgRow.forEach((img: any) => {
                    img.width = img[this.minimalQualityCategory]['width']
                    img.height = img[this.minimalQualityCategory]['height']
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height'])
                    this.checkForAsyncLoading(img, imageCounter++)
                })
            }
        })

        if (maximumGalleryImageHeight > 375) {
            this.minimalQualityCategory = 'preview_xs'
        } else {
            this.minimalQualityCategory = 'preview_xxs'
        }

        this.refreshNavigationErrorState()

        this.ChangeDetectorRef.detectChanges()
    }

    private checkForAsyncLoading(image: any, imageCounter: number) {
        const imageElements = this.imageElements.toArray()

        if (image['galleryImageLoaded'] ||
            (imageElements.length > 0 && this.isScrolledIntoView(imageElements[imageCounter].nativeElement))) {
            image['galleryImageLoaded'] = true
            image['srcAfterFocus'] = image[this.minimalQualityCategory]['path']
        }
        else {
            image['srcAfterFocus'] = ''
        }
    }

    private isScrolledIntoView(element: any) {
        const elementTop = element.getBoundingClientRect().top
        const elementBottom = element.getBoundingClientRect().bottom

        return elementTop < window.innerHeight && elementBottom >= 0 && (elementBottom > 0 || elementTop > 0)
    }

    /**
     * direction (-1: left, 1: right)
     */
    public navigate(direction: number) {
        if ((direction === 1 && this.rowIndex < this.gallery.length - this.rowsPerPage)
            || (direction === -1 && this.rowIndex > 0)) {
            this.rowIndex += (this.rowsPerPage * direction)
        }
        this.refreshNavigationErrorState()
    }

    private refreshNavigationErrorState() {
        this.leftArrowInactive = this.rowIndex == 0
        this.rightArrowInactive = this.rowIndex > (this.gallery.length - this.rowsPerPage)
    }
}
