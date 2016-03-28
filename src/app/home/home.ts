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
  currentIdx: number
  arrows: string[] = ['left.svg', 'right.svg']
  basepath: string = 'assets/img/'
  galleryBasePath: string = 'assets/img/gallery/'
  showBig: boolean = false
  leftArrowActive: boolean = true
  rightArrowActive: boolean = true
  images: any[] = [20]

  // TypeScript public modifiers
  constructor(private _ngZone: NgZone, private http: Http) {

  }

  ngOnInit() {
    window.onresize = function(event) {
      this._ngZone.run(() => {
        this.calc()
      })
    }.bind(this)

    this.http.get(this.galleryBasePath + 'data.json')
      .map((res: Response) => res.json())
      .subscribe(
      data => {
        this.images = data
        this.calc()
      },
      err => console.error(err),
      () => console.log('done'))

    this.currentIdx = 0
    this.currentImg = this.images[this.currentIdx].url
    this.updateArrowActivation()
  }

  calc() {
    this.images.forEach((img) => {
      let individualRatio = 1 / img.height
      img.width = img.width * individualRatio
      img.height = 1
    })
    let xsum = 0
    this.images.forEach((img) => {
      xsum += img.width
    })
    let ratio = window.outerWidth / xsum
    // check if ratio is too high
    this.images.forEach((img) => {
      img.width = img.width * ratio
      img.height = img.height * ratio
      console.log(img.width + ' ' + img.height)
    })
  }

  isActive(index) {
    return index == this.currentIdx
  }

  private _keydown(event: KeyboardEvent) {
    let prevent = [37, 39]
      .find(no => no === event.keyCode);
    if (prevent) event.preventDefault();

    if (prevent == 37) {
      // left
      this.navigateLeft();
    }
    else if (prevent == 39) {
      // right
      this.navigateRight();
    }
    else {
      console.error('unexpected key pushed')
    }
  }

  navigateRight() {
    if (this.currentIdx < this.images.length - 1) {
      this.currentIdx++
      this.updateArrowActivation()
    }
    this.currentImg = this.basepath + this.images[this.currentIdx - 1]
  }

  navigateLeft() {
    if (this.currentIdx > 0) {
      this.currentIdx--
      this.updateArrowActivation()
    }
    this.currentImg = this.basepath + this.images[this.currentIdx]
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

  openImageViewer() {
    this.showBig = !this.showBig
  }
}
