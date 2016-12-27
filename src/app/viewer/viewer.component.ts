import {
    Component, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges,
    AfterContentInit, HostBinding
} from '@angular/core'
import {Http, Response} from '@angular/http'
import 'rxjs/Rx'

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css'],
    host: {
        '(document:keydown)': 'onKeydown($event)',
    }
})
export class ViewerComponent implements OnChanges, AfterContentInit {
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
    leftArrowVisible: boolean = true
    rightArrowVisible: boolean = true
    previewImagePath = ''

    // TypeScript public modifiers
    constructor(private _ngZone: NgZone, private http: Http) {
    }

    ngOnChanges(changes) {
        if (this.images[this.currentIdx].name) {
            this.updatePreviewImage()
        }
    }

    ngAfterContentInit() {
    }

    onKeydown(event: KeyboardEvent) {
        let prevent = [37, 39, 27]
            .find(no => no === event.keyCode)
        if (prevent) {
            event.preventDefault()
        }

        switch (prevent) {
            case 37:
                // navigate left
                this.navigate(-1, false)
                break
            case 39:
                // navigate right
                this.navigate(1, false)
                break
            case 27:
                // esc
                this.closeViewer()
                break
        }
    }

    updateArrowActivation() {
        if (this.currentIdx <= 0) {
            this.leftArrowActive = false
        } else {
            this.leftArrowActive = true
        }
        if (this.currentIdx >= this.images.length - 1) {
            this.rightArrowActive = false
        } else {
            this.rightArrowActive = true
        }
    }

    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     */
    navigate(direction: number, swipe: boolean) {
        if ((direction === 1 && this.currentIdx < this.images.length - 1) ||
            (direction === -1 && this.currentIdx > 0)) {
            // increases or decreases the counter
            this.currentIdx += direction
            if (swipe) {
                this.hideNavigationArrows()
            } else {
                this.updateArrowActivation()
                this.showNavigationArrows()
            }
            this.updatePreviewImage()
        }
    }

    hideNavigationArrows() {
        this.leftArrowVisible = false
        this.rightArrowVisible = false
    }

    showNavigationArrows() {
        this.leftArrowVisible = true
        this.rightArrowVisible = true
    }

    openFullsize() {
        window.location.href = 'assets/img/gallery/raw/' + this.images[this.currentIdx].name
    }

    private closeViewer() {
        this.showViewer = false
        this.onClose.emit(false)
    }

    private updatePreviewImage() {
        let screenWidth = window.innerWidth
        let screenHeight = window.innerHeight

        let optimalCategory = 'preview_xs'

        if (screenWidth > this.images[this.currentIdx]['preview_xs'].width &&
            screenHeight > this.images[this.currentIdx]['preview_xs'].height) {
            optimalCategory = 'preview_s'
        }
        if (screenWidth > this.images[this.currentIdx]['preview_s'].width &&
            screenHeight > this.images[this.currentIdx]['preview_s'].height) {
            optimalCategory = 'preview_m'
        }
        if (screenWidth > this.images[this.currentIdx]['preview_m'].width &&
            screenHeight > this.images[this.currentIdx]['preview_m'].height) {
            optimalCategory = 'preview_l'
        }
        if (screenWidth > this.images[this.currentIdx]['preview_l'].width &&
            screenHeight > this.images[this.currentIdx]['preview_l'].height) {
            optimalCategory = 'preview_xl'
        }
        if (screenWidth > this.images[this.currentIdx]['preview_xl'].width &&
            screenHeight > this.images[this.currentIdx]['preview_xl'].height) {
            optimalCategory = 'raw'
        }

        this.previewImagePath = this.images[this.currentIdx][optimalCategory].path
    }

    private onResize() {
        this.updatePreviewImage()
    }
}
