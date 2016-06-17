import {Router, ROUTER_DIRECTIVES} from '@angular/router'
import {Component, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core'
import {Http, Response} from '@angular/http'
import 'rxjs/Rx'

interface IImage {
  url: string
  thumbnail: string
  date: string
  width: number
  height: number
}

@Component({
  moduleId: module.id,
  selector: 'viewer',
  templateUrl: 'viewer.component.html',
  styleUrls: ['viewer.component.css'],
  host: {
    '(document:keydown)': 'onKeydown($event)',
  }
})
export class ViewerComponent {
  @Input()
  images: any[]
  @Input()
  currentIdx: number
  @Input()
  showViewer: boolean;
  @Output()
  onClose = new EventEmitter<boolean>()

  arrows: string[] = ['assets/img/icon/left.svg', 'assets/img/icon/right.svg']
  leftArrowActive: boolean = true
  rightArrowActive: boolean = true
  previewImagePath = ''

  // TypeScript public modifiers
  constructor(private _ngZone: NgZone, private http: Http, private router: Router) {
  }

  ngOnChanges(changes) {
    if (changes.currentIdx && this.images[this.currentIdx].name) {
      this.updatePreviewImage()
    }
  }

  ngAfterContentInit() {
  }

  onKeydown(event: KeyboardEvent) {
    let prevent = [37, 39, 27]
      .find(no => no === event.keyCode)
    if (prevent) event.preventDefault()

    switch (prevent) {
      case 37:
        // left arrow
        this.navigateLeft()
        break
      case 39:
        // right arrow
        this.navigateRight()
        break
      case 27:
        // esc
        this.showViewer = false
        break
    }
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
    this.updatePreviewImage()
  }

  navigateRight() {
    if (this.currentIdx < this.images.length - 1) {
      this.currentIdx++
      this.updateArrowActivation()
    }
  }

  navigateLeft() {
    if (this.currentIdx > 0) {
      this.currentIdx--
      this.updateArrowActivation()
    }
  }

  openFullsize() {
    window.location.href = 'assets/img/gallery/raw/' + this.images[this.currentIdx].name
  }

  private closeViewer() {
    this.showViewer = false
    this.onClose.emit(false)
  }

  private updatePreviewImage() {
    let height = window.innerHeight
    let basePath = 'assets/img/gallery/'

    if (height <= 375) {
      basePath += 'preview_xxs/'
    } else if (height <= 768) {
      basePath += 'preview_xs/'
    } else if (height <= 1080) {
      basePath += 'preview_s/'
    } else if (height <= 1600) {
      basePath += 'preview_m/'
    } else if (height <= 2160) {
      basePath += 'preview_l/'
    } else if (height <= 2880) {
      basePath += 'preview_xl/'
    } else {
      basePath += 'raw'
    }

    this.previewImagePath = basePath + this.images[this.currentIdx].name
  }

  private onResize() {
    this.updatePreviewImage()
  }
}
