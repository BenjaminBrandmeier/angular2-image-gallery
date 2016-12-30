import {
    Component, ViewChild, ElementRef, AfterContentInit, HostListener, ViewChildren,
    ChangeDetectorRef
} from "@angular/core"
import {Http, Response} from "@angular/http"
import "rxjs/Rx"

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
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterContentInit {
    @ViewChild('galleryContainer') galleryContainer: ElementRef
    @ViewChildren('imageElement') imageElements: any

    @HostListener('window:scroll', ['$event']) triggerCycle(event) {
    }

    @HostListener('window:resize', ['$event']) windowResize(event) {
        this.render()
    }

    currentIdx: number = 0
    galleryBasePath: string = 'assets/img/gallery/'
    showBig: boolean = false
    images: any[] = [{}]
    gallery: any[] = []
    imgIterations = 100000

    constructor(private http: Http, private ChangeDetectorRef: ChangeDetectorRef) {
    }

    ngAfterContentInit() {
        this.fetchDataAndRender()
    }

    private fetchDataAndRender() {
        this.http.get(this.galleryBasePath + 'data.json')
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    this.images = data
                    this.render()
                },
                err => console.error(err),
                () => undefined)
    }

    private render() {
        this.gallery = []
        this.images.forEach((image) => {
            image['loaded'] = false
        })

        let tempRow = [this.images[0]]
        let rowIndex = 0
        let i = 0

        for (i; i < this.imgIterations && i < this.images.length; i++) {
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
        let xsum = this.calcOriginalRowWidth(imgRow)

        let ratio = this.getGalleryWidth() / xsum
        let rowHeight = imgRow[0].preview_xxs.height * ratio

        return rowHeight
    }

    private scaleGallery() {
        // TODO: Make this dynamic depending on screen size
        let galleryImageSizeCategory = 'preview_xxs'

        this.gallery.forEach((imgRow) => {
            let xsum = this.calcOriginalRowWidth(imgRow)

            if (imgRow !== this.gallery[this.gallery.length - 1]) {
                let ratio = this.getGalleryWidth() / xsum

                imgRow.forEach((img) => {
                    img.width = img[galleryImageSizeCategory].width * ratio
                    img.height = img[galleryImageSizeCategory].height * ratio
                })
            }
            else {
                imgRow.forEach((img) => {
                    img.width = img[galleryImageSizeCategory].width
                    img.height = img[galleryImageSizeCategory].height
                })
            }
        })

        this.ChangeDetectorRef.detectChanges()
    }

    private calcOriginalRowWidth(imgRow: IImage[]) {
        let xsum = 0
        imgRow.forEach((img) => {
            let individualRatio = this.calcIdealHeight() / img.preview_xxs.height
            img.preview_xxs.width = img.preview_xxs.width * individualRatio
            img.preview_xxs.height = this.calcIdealHeight()
            xsum += img.preview_xxs.width + 1
        })

        return xsum
    }

    private calcIdealHeight() {
        return (this.getGalleryWidth() / 8) + 70
    }

    private openImageViewer(img) {
        this.showBig = undefined
        this.showBig = true
        this.currentIdx = this.images.indexOf(img)
    }

    private getGalleryWidth() {
        if (this.galleryContainer.nativeElement.clientWidth === 0) {
            // IE11
            return this.galleryContainer.nativeElement.scrollWidth
        }
        return this.galleryContainer.nativeElement.clientWidth
    }

    private onClose() {
        this.showBig = false
    }

    private loadImage(image) {
        let imageIndex = this.images.indexOf(image)
        let imageElements = this.imageElements.toArray()

        if (imageElements.length > 0 && this.isScrolledIntoView(imageElements[imageIndex].nativeElement)) {
            image['loaded'] = true
            return image['preview_xxs']['path']
        }
        return ''
    }

    private isScrolledIntoView(element) {
        let elementTop = element.getBoundingClientRect().top
        let elementBottom = element.getBoundingClientRect().bottom

        return elementTop < window.innerHeight && elementBottom >= 0
    }
}
