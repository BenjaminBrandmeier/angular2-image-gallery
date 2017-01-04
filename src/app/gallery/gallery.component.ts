import {
    Component, ViewChild, ElementRef, HostListener, ViewChildren,
    ChangeDetectorRef, QueryList, OnInit, Input, SimpleChanges, OnChanges
} from "@angular/core"
import {Http, Response} from "@angular/http"
import "rxjs/Rx"
import {ImageService} from "../services/image.service"

interface IPreviewImageInformation {
    path: string
    height: number
    width: number
}

interface IImage {
    name: string
    date: string
    dominantColor: string
    preview_xxs: IPreviewImageInformation
    preview_xs: IPreviewImageInformation
    preview_s: IPreviewImageInformation
    preview_m: IPreviewImageInformation
    preview_l: IPreviewImageInformation
    preview_xl: IPreviewImageInformation
    raw: IPreviewImageInformation
}

@Component({
    selector: 'gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnChanges {
    @Input('flexBorderSize') providedImageMargin: number = 3
    @Input('flexImageSize') providedImageSize: number = 7

    @ViewChild('galleryContainer') galleryContainer: ElementRef
    @ViewChildren('imageElement') imageElements: QueryList<any>

    @HostListener('window:scroll', ['$event']) triggerCycle(event) {
        this.scaleGallery()
    }

    @HostListener('window:resize', ['$event']) windowResize(event) {
        this.render()
    }

    private imageDataFilePath: string = 'assets/img/gallery/data.json'
    private images: IImage[] = []
    private gallery: any[] = []

    constructor(private ImageService: ImageService, private http: Http, private ChangeDetectorRef: ChangeDetectorRef, elementRef: ElementRef) {
    }

    public ngOnInit() {
        this.fetchDataAndRender()
    }

    public ngOnChanges(changes: SimpleChanges) {
        // input params changed
        this.render()
    }

    public openImageViewer(img) {
        this.ImageService.updateSelectedImageIndex(this.images.indexOf(img))
        this.ImageService.showImageViewer(true)
    }

    private fetchDataAndRender() {
        this.http.get(this.imageDataFilePath)
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    this.images = data
                    this.ImageService.updateImages(this.images)

                    this.images.forEach((image) => {
                        image['galleryImageLoaded'] = false
                        image['viewerImageLoaded'] = false
                        image['srcAfterFocus'] = ''
                    })
                    // initial rendering
                    this.render()
                    this.render()
                },
                err => console.error(err),
                () => undefined)
    }

    private render() {
        this.gallery = []

        let tempRow = [this.images[0]]
        let rowIndex = 0
        let i = 0

        for (i; i < this.images.length; i++) {
            while (this.images[i + 1] && this.shouldAddCandidate(tempRow, this.images[i + 1])) {
                i++
            }
            if (this.images[i + 1]) {
                tempRow.pop()
            }
            this.gallery[rowIndex++] = tempRow

            tempRow = [this.images[i + 1]]
        }

        this.scaleGallery()
    }

    private shouldAddCandidate(imgRow: IImage[], candidate: IImage): boolean {
        let oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow)
        imgRow.push(candidate)
        let newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow)

        return Math.abs(oldDifference) > Math.abs(newDifference)
    }

    private calcRowHeight(imgRow: IImage[]) {
        let originalRowWidth = this.calcOriginalRowWidth(imgRow)

        let ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth
        let rowHeight = imgRow[0]['preview_xxs']['height'] * ratio

        return rowHeight
    }

    private calcImageMargin() {
        let galleryWidth = this.getGalleryWidth()
        let ratio = galleryWidth / 1920
        return Math.round(Math.max(1, this.providedImageMargin * ratio))
    }

    private calcOriginalRowWidth(imgRow: IImage[]) {
        let originalRowWidth = 0
        imgRow.forEach((img) => {
            let individualRatio = this.calcIdealHeight() / img['preview_xxs']['height']
            img['preview_xxs']['width'] = img['preview_xxs']['width'] * individualRatio
            img['preview_xxs']['height'] = this.calcIdealHeight()
            originalRowWidth += img['preview_xxs']['width']
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
        // TODO: Make this dynamic depending on screen size
        let galleryImageSizeCategory = 'preview_xxs'
        let imageCounter = 0

        this.gallery.forEach((imgRow) => {
            let originalRowWidth = this.calcOriginalRowWidth(imgRow)

            if (imgRow !== this.gallery[this.gallery.length - 1]) {
                let ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth

                let xsum = 0
                imgRow.forEach((img) => {
                    img['width'] = img[galleryImageSizeCategory]['width'] * ratio
                    img['height'] = img[galleryImageSizeCategory]['height'] * ratio
                    this.checkForAsyncLoading(img, imageCounter++)
                })
            }
            else {
                imgRow.forEach((img) => {
                    img.width = img[galleryImageSizeCategory]['width']
                    img.height = img[galleryImageSizeCategory]['height']
                    this.checkForAsyncLoading(img, imageCounter++)
                })
            }
        })

        this.ChangeDetectorRef.detectChanges()
    }

    private checkForAsyncLoading(image, imageCounter: number) {
        let imageElements = this.imageElements.toArray()

        if (image['galleryImageLoaded'] ||
            (imageElements.length > 0 && this.isScrolledIntoView(imageElements[imageCounter].nativeElement))) {
            image['galleryImageLoaded'] = true
            image['srcAfterFocus'] = image['preview_xxs']['path']
        }
        else {
            image['srcAfterFocus'] = ''
        }
    }

    private isScrolledIntoView(element) {
        let elementTop = element.getBoundingClientRect().top
        let elementBottom = element.getBoundingClientRect().bottom

        return elementTop < window.innerHeight && elementBottom >= 0 && (elementBottom > 0 || elementTop > 0)
    }
}
