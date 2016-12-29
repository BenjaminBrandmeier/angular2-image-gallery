import {Component, Input, Output, EventEmitter, OnChanges, AfterContentInit} from "@angular/core";
import "rxjs/Rx";

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
    leftArrowVisible: boolean = true
    rightArrowVisible: boolean = true
    qualitySelectorShown: boolean = false
    qualitySelected: string = 'auto'
    previewImagePath = ''

    constructor() {
    }

    ngOnChanges(changes) {
        if (this.images[this.currentIdx].name) {
            this.updatePreviewImage()
        }
    }

    ngAfterContentInit() {
    }

    onKeydown(event: KeyboardEvent) {
        let prevent = [37, 39, 27, 36, 35]
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
            case 36:
                // pos 1
                this.currentIdx = 0
                this.updatePreviewImage()
                break
            case 35:
                // end
                this.currentIdx = this.images.length - 1
                this.updatePreviewImage()
                break
        }
    }

    public get leftArrowActive(): boolean {
        return this.currentIdx > 0;
    }

    public get rightArrowActive(): boolean {
        return this.currentIdx < this.images.length - 1;
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

        let usedCategory = ''

        switch (this.qualitySelected) {
            case 'auto': {
                usedCategory = 'preview_xs'

                if (screenWidth > this.images[this.currentIdx]['preview_xs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xs'].height) {
                    usedCategory = 'preview_s'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_s'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_s'].height) {
                    usedCategory = 'preview_m'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_m'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_m'].height) {
                    usedCategory = 'preview_l'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_l'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_l'].height) {
                    usedCategory = 'preview_xl'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_xl'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xl'].height) {
                    usedCategory = 'raw'
                }
                break;
            }
            case 'low': {
                usedCategory = 'preview_xxs'
                break;
            }
            case 'mid': {
                usedCategory = 'preview_m'
                break;
            }
            case 'high': {
                usedCategory = 'raw'
                break;
            }
        }

        this.previewImagePath = this.images[this.currentIdx][usedCategory].path
    }

    private onResize() {
        this.updatePreviewImage()
    }

    showQualitySelector() {
        this.qualitySelectorShown = !this.qualitySelectorShown
    }

    qualityChanged(newQuality) {
        this.qualitySelected = newQuality
        this.updatePreviewImage()
    }
}
