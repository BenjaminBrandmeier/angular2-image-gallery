import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    AfterContentInit,
    trigger,
    state,
    style,
    transition,
    animate,
    ChangeDetectorRef
} from "@angular/core";
import "rxjs/Rx";

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css'],
    host: {
        '(document:keydown)': 'onKeydown($event)',
    },
    animations: [
        trigger('imageTransition', [
            state('enterFromRight', style({
                opacity: 1,
                transform: 'translate(0px, 0px)'
            })),
            state('enterFromLeft', style({
                opacity: 1,
                transform: 'translate(0px, 0px)'
            })),
            state('leaveToLeft', style({
                opacity: 0,
                transform: 'translate(-10%, 0px)'
            })),
            state('leaveToRight', style({
                opacity: 0,
                transform: 'translate(10%, 0px)'
            })),
            transition('* => enterFromRight', [
                style({
                    opacity: 0,
                    transform: 'translate(3%, 0px)'
                }),
                animate('250ms 500ms ease-in')
            ]),
            transition('* => enterFromLeft', [
                style({
                    opacity: 0,
                    transform: 'translate(-3%, 0px)'
                }),
                animate('250ms 500ms ease-in')
            ]),
            transition('* => leaveToLeft', [
                style({
                    opacity: 1,
                    transform: 'translate(0px, 0px)'
                }),
                animate('250ms ease-out')]
            ),
            transition('* => leaveToRight', [
                style({
                    opacity: 1,
                    transform: 'translate(0px, 0px)'
                }),
                animate('250ms ease-out')]
            )
        ])
    ]
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
    categorySelected: string = 'preview_xxs'
    private transform: string;

    constructor(private ChangeDetectorRef: ChangeDetectorRef) {
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
                break
            case 36:
                // pos 1
                this.images[this.currentIdx]['transition'] = 'leaveToRight'
                this.currentIdx = 0
                this.images[this.currentIdx]['transition'] = 'enterFromLeft'
                this.updatePreviewImage()
                break
            case 35:
                // end
                this.images[this.currentIdx]['transition'] = 'leaveToLeft'
                this.currentIdx = this.images.length - 1
                this.images[this.currentIdx]['transition'] = 'enterFromRight'
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

    pan(swipe: any) {
        let currentDeltaX = swipe.deltaX;
        this.transform = currentDeltaX + 'px'
    }

    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     */
    navigate(direction: number, swipe: any) {
        if ((direction === 1 && this.currentIdx < this.images.length - 1) ||
            (direction === -1 && this.currentIdx > 0)) {

            if (direction == -1) {
                this.images[this.currentIdx]['transition'] = 'leaveToRight'
                this.images[this.currentIdx - 1]['transition'] = 'enterFromLeft'
            }
            else {
                this.images[this.currentIdx]['transition'] = 'leaveToLeft'
                this.images[this.currentIdx + 1]['transition'] = 'enterFromRight'
            }
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

    private closeViewer() {
        this.images.forEach((image) => image['transition'] = undefined)
        this.images.forEach((image) => image['active'] = false)
        this.showViewer = false
        this.onClose.emit(false)
    }

    private updatePreviewImage() {
        let screenWidth = window.innerWidth
        let screenHeight = window.innerHeight

        switch (this.qualitySelected) {
            case 'auto': {
                this.categorySelected = 'preview_xxs'

                if (screenWidth > this.images[this.currentIdx]['preview_xxs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xxs'].height) {
                    this.categorySelected = 'preview_xs'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_xs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xs'].height) {
                    this.categorySelected = 'preview_s'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_s'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_s'].height) {
                    this.categorySelected = 'preview_m'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_m'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_m'].height) {
                    this.categorySelected = 'preview_l'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_l'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_l'].height) {
                    this.categorySelected = 'preview_xl'
                }
                if (screenWidth > this.images[this.currentIdx]['preview_xl'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xl'].height) {
                    this.categorySelected = 'raw'
                }
                break;
            }
            case 'low': {
                this.categorySelected = 'preview_xxs'
                break;
            }
            case 'mid': {
                this.categorySelected = 'preview_m'
                break;
            }
            case 'high': {
                this.categorySelected = 'raw'
                break;
            }
        }

        this.images[this.currentIdx]['active'] = true
        // wait for animation to end
        setTimeout(() => {
            this.images.forEach((image) => image['active'] = false)
            this.images[this.currentIdx]['active'] = true
            this.transform = '0px'
        }, 500)
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
