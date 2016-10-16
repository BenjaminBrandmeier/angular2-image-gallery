import {Component, NgZone, ViewChild, ElementRef} from '@angular/core'
import {Http, Response} from '@angular/http'
import {ViewerComponent} from '../viewer/viewer.component'
import 'rxjs/Rx'

interface IImage {
  url: string
  thumbnail: string
  date: string
  width: number
  height: number
}

@Component({
  selector: 'gallery',
  templateUrl: 'gallery.component.html',
  styleUrls: ['gallery.component.css']
})
export class GalleryComponent {
  @ViewChild('galleryContainer') galleryContainer: ElementRef
  @ViewChild('asyncLoadingContainer') asyncLoadingContainer: ElementRef

  thumbnailBasePath = 'assets/img/gallery/preview_xxs/'
  currentIdx: number = 0
  galleryBasePath: string = 'assets/img/gallery/'
  showBig: boolean = false
  images: any[] = [{ url: '' }]
  gallery: any[] = []
  imgIterations = 1
  allImagesLoaded = false

  // TypeScript public modifiers
  constructor(private _ngZone: NgZone, private http: Http) {

  }

  private ngAfterContentInit() {
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

    if (i >= this.images.length) {
      this.allImagesLoaded = true
    }
    else {
      this.checkForAsyncReload()
    }
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
    let rowHeight = imgRow[0].height * ratio

    return rowHeight
  }

  private scaleGallery() {
    this.gallery.forEach((imgRow) => {
      let xsum = this.calcOriginalRowWidth(imgRow)

      if (imgRow != this.gallery[this.gallery.length - 1]) {
        let ratio = this.getGalleryWidth() / xsum

        imgRow.forEach((img) => {
          img.width = img.width * ratio
          img.height = img.height * ratio
        })
      }
    })
  }

  private calcOriginalRowWidth(imgRow: IImage[]) {
    let xsum = 0
    imgRow.forEach((img) => {
      let individualRatio = this.calcIdealHeight() / img.height
      img.width = img.width * individualRatio
      img.height = this.calcIdealHeight()
      xsum += img.width + 1
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
    if (this.galleryContainer.nativeElement.clientWidth == 0) {
      // IE11
      return this.galleryContainer.nativeElement.scrollWidth
    }
    return this.galleryContainer.nativeElement.clientWidth
  }

  private checkForAsyncReload() {
    if (!this.allImagesLoaded) {
      var loadingDiv: any = this.asyncLoadingContainer.nativeElement

      var elmTop = loadingDiv.getBoundingClientRect().top
      var elmBottom = loadingDiv.getBoundingClientRect().bottom

      var isVisible = (elmTop >= 0) && (elmBottom <= window.innerHeight)

      if (isVisible) {
        this.imgIterations += 5
        this.fetchDataAndRender()
      }
    }
  }

  private onClose() {
    this.showBig = false
  }

  private onResize() {
    this.render()
  }
}
