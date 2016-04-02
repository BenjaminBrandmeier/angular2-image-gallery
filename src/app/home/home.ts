import {Component, NgZone} from 'angular2/core';
import {AppState} from '../app.service';
import {Http, Response} from 'angular2/http';

import {XLarge} from './directives/x-large';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    //ImageInfo
  ],
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [
    XLarge
  ],
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [require('./home.css')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: require('./home.html'),
  host: {
    '(document:keydown)': '_keydown($event)',
  }
})
export class Home {
  // Set our default values
  localState = { value: '' }
  currentImg: string
  currentIdx: number = 0
  arrows: string[] = ['assets/img/left.svg', 'assets/img/right.svg']
  galleryBasePath: string = 'assets/img/gallery/'
  showBig: boolean = false
  leftArrowActive: boolean = true
  rightArrowActive: boolean = true
  images: any[] = [ {url: 'dummy'} ]
  gallery: any[] = []
  heightCoefficient = 8

  // TypeScript public modifiers
  constructor(private _ngZone: NgZone, private http: Http) {

  }

  ngOnInit() {
    window.onresize = function(event) {
      this._ngZone.run(() => {
        this.calc()
      })
    }.bind(this)

    this.fetchDataAndRender()
  }

  fetchDataAndRender() {
    this.http.get(this.galleryBasePath + 'data.json')
      .map((res: Response) => res.json())
      .subscribe(
      data => {
        this.images = data

        var standardAmount = 7
        let tempRow = []
        let rowIndex = 0
        for (var i = 0; i < data.length; i++) {
          tempRow[i % standardAmount] = data[i]

          if (tempRow.length % standardAmount == 0) {
            this.gallery[rowIndex++] = tempRow
            tempRow = []
          }
          else if (i + 1 == data.length) {
            // don't fill last row until complete width
            this.gallery[rowIndex] = tempRow
          }
        }

        this.calc()
      },
      err => console.error(err),
      () => console.log('done'))
  }

  calc() {
    let idealHeight = window.outerWidth / this.heightCoefficient

    this.gallery.forEach((imgRow) => {
      let xsum = 0
      imgRow.forEach((img) => {
        let individualRatio = idealHeight / img.height
        img.width = img.width * individualRatio
        img.height = idealHeight
        xsum += img.width
      })

      if (imgRow != this.gallery[this.gallery.length - 1]) {
        let ratio = (window.outerWidth) / xsum
        // TODO: normalize height
        imgRow.forEach((img) => {
          img.width = img.width * ratio
          img.height = img.height * ratio
          console.log(img.width + ' ' + img.height)
        })
      }
    })
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
      default:
        console.error('unexpected key pushed')
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

  gnarf(event) {
    /*  debugger
      var clickedElementClass = event.target.className
      if (clickedElementClass.indexOf('thumbnail') < 0 && clickedElementClass.indexOf('image') < 0 && clickedElementClass.indexOf('image') < 0 || clickedElementClass.indexOf('arrow') < 0 && this.showBig == true) {
        this.showBig = false
      }*/
  }
}
