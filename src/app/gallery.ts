import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {CliRouteConfig} from './route-config';
import {Component, NgZone, ViewChild, ElementRef} from 'angular2/core';
import {Http, Response, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/Rx';

interface IImage {
  url: string
  thumbnail: string
  date: string
  width: number
  height: number
}

@Component({
  selector: 'gallery',
  providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS],
  templateUrl: 'app/gallery.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
  styleUrls: ['app/gallery.css'],
  host: {
    '(document:keydown)': '_keydown($event)',
  }
})
@RouteConfig([

].concat(CliRouteConfig))
export class GalleryApp {
  @ViewChild('galleryContainer') galleryContainer: ElementRef;
  // Set our default values
  localState = { value: '' }
  currentImg: string
  currentIdx: number = 0
  arrows: string[] = ['assets/img/left.svg', 'assets/img/right.svg']
  galleryBasePath: string = 'assets/img/gallery/'
  showBig: boolean = false
  leftArrowActive: boolean = true
  rightArrowActive: boolean = true
  images: any[] = [{ url: '' }]
  gallery: any[] = []
  heightCoefficient = 6

  // TypeScript public modifiers
  constructor(private _ngZone: NgZone, private http: Http) {

  }

  ngOnInit() {

    window.onresize = function(event) {
      this._ngZone.run(() => {
        this.scaleGallery()
      })
    }.bind(this)

    this.fetchDataAndRender()
  }

  fetchDataAndRender() {

    console.log('THIS.HTTP.GET', this.http.get)

    this.http.get(this.galleryBasePath + 'data.json')
      .map((res: Response) => res.json())
      .subscribe(
      data => {
        this.images = data

        let tempRow = [data[0]]
        let rowIndex = 0

        for (var i = 0; i < data.length; i++) {
          while (data[i + 1] && this.shouldAddCandidate(tempRow, data[i + 1])) {
            i++
          }
          if (data[i + 1]) {
            tempRow.pop()
          }
          this.gallery[rowIndex++] = tempRow

          tempRow = [data[i + 1]]
        }

        this.scaleGallery()
      },
      err => console.error(err),
      () => console.log('done'))
  }

  shouldAddCandidate(imgRow: IImage[], candidate: IImage): boolean {
    let oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow)
    imgRow.push(candidate)
    let newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow)

    return Math.abs(oldDifference) > Math.abs(newDifference)
  }

  calcRowHeight(imgRow: IImage[]) {
    let xsum = this.normalizeHeight(imgRow)

    let ratio = (this.getGalleryWidth()) / xsum
    let rowHeight = imgRow[0].height * ratio

    return rowHeight
  }

  scaleGallery() {
    this.gallery.forEach((imgRow) => {
      let xsum = this.normalizeHeight(imgRow)

      if (imgRow != this.gallery[this.gallery.length - 1]) {
        let ratio = (this.getGalleryWidth()) / xsum

        imgRow.forEach((img) => {
          img.width = img.width * ratio
          img.height = img.height * ratio
        })
      }
    })
  }

  normalizeHeight(imgRow: IImage[]) {
    let xsum = 0
    imgRow.forEach((img) => {
      let individualRatio = this.calcIdealHeight() / img.height
      img.width = img.width * individualRatio
      img.height = this.calcIdealHeight()
      xsum += img.width + 2
    })

    return xsum
  }

  calcIdealHeight() {
    // let idealHeight = Math.log(this.getGalleryWidth() * 100000) * this.heightCoefficient
    let idealHeight = this.getGalleryWidth() / this.heightCoefficient
    return idealHeight
  }

  isActive(index) {
    return index == this.currentIdx
  }

  _keydown(event: KeyboardEvent) {
    let prevent = [37, 39, 27]
      .find(no => no === event.keyCode);
    if (prevent) event.preventDefault();

    switch (prevent) {
      case 37:
        // left arrow
        this.navigateLeft();
        break;
      case 39:
        // right arrow
        this.navigateRight();
        break;
      case 27:
        // esc
        this.showBig = false
        break;
    }
  }

  navigateRight() {
    if (this.currentIdx < this.images.length - 1) {
      this.currentIdx++
      this.updateArrowActivation()
    }
    this.currentImg = this.images[this.currentIdx].url

  }

  navigateLeft() {
    if (this.currentIdx > 0) {
      this.currentIdx--
      this.updateArrowActivation()
    }
    this.currentImg = this.images[this.currentIdx].url
  }

  updateArrowActivation() {
    if (this.currentIdx <= 0) {
      this.leftArrowActive = false
    }
    else {
      this.leftArrowActive = true
    }

    if (this.currentIdx >= this.images.length - 1) {
      this.rightArrowActive = false
    }
    else {
      this.rightArrowActive = true
    }
  }

  openImageViewer(img) {
    this.currentIdx = this.images.indexOf(img)
    this.updateArrowActivation()
    this.showBig = true
  }

  private getGalleryWidth() {
    return this.galleryContainer.nativeElement.clientWidth
  }
}
