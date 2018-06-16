import { ImageService } from '../services/image.service'
import { Component } from '@angular/core'
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
    selector: 'viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css'],
    host: {
        '(document:keydown)': 'onKeydown($event)'
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
                transform: 'translate(-100px, 0px)'
            })),
            state('leaveToRight', style({
                opacity: 0,
                transform: 'translate(100px, 0px)'
            })),
            transition('* => enterFromRight', [
                style({
                    opacity: 0,
                    transform: 'translate(30px, 0px)'
                }),
                animate('250ms 500ms ease-in')
            ]),
            transition('* => enterFromLeft', [
                style({
                    opacity: 0,
                    transform: 'translate(-30px, 0px)'
                }),
                animate('250ms 500ms ease-in')
            ]),
            transition('* => leaveToLeft', [
                style({
                    opacity: 1
                }),
                animate('250ms ease-out')]
            ),
            transition('* => leaveToRight', [
                style({
                    opacity: 1
                }),
                animate('250ms ease-out')]
            )
        ]),
        trigger('showViewerTransition', [
            state('true', style({
                opacity: 1
            })),
            state('void', style({
                opacity: 0
            })),
            transition('void => *', [
                style({
                    opacity: 0
                }),
                animate('1000ms ease-in')]
            ),
            transition('* => void', [
                style({
                    opacity: 1
                }),
                animate('500ms ease-out')]
            )
        ])
    ]
})

export class ViewerComponent {
    showViewer: boolean
    images: Array<any> = [{}]
    currentIdx: number = 0
    leftArrowVisible: boolean = true
    rightArrowVisible: boolean = true
    categorySelected: string = 'preview_xxs'
    transform: number
    math: Math
    private qualitySelectorShown: boolean = false
    private qualitySelected: string = 'auto'

    constructor(private imageService: ImageService) {
        imageService.imagesUpdated$.subscribe(
            images => {
                this.images = images
            })
        imageService.imageSelectedIndexUpdated$.subscribe(
            newIndex => {
                this.currentIdx = newIndex
                this.images.forEach(image => image['active'] = false)
                this.images[this.currentIdx]['active'] = true
                this.transform = 0
                this.updateQuality()
            })
        imageService.showImageViewerChanged$.subscribe(
            showViewer => {
                this.showViewer = showViewer
            })
        this.math = Math
    }

    get leftArrowActive(): boolean {
        return this.currentIdx > 0
    }

    get rightArrowActive(): boolean {
        return this.currentIdx < this.images.length - 1
    }

    pan(swipe: any): void {
        this.transform = swipe.deltaX
    }

    onResize(): void {
        this.images.forEach(image => {
            image['viewerImageLoaded'] = false
            image['active'] = false
        })
        this.updateImage()
    }

    showQualitySelector(): void {
        this.qualitySelectorShown = !this.qualitySelectorShown
    }

    qualityChanged(newQuality: any): void {
        this.qualitySelected = newQuality
        this.updateImage()
    }

    imageLoaded(image: any): void {
        image['viewerImageLoaded'] = true
    }

    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     */
    navigate(direction: number, swipe: any): void {
        if ((direction === 1 && this.currentIdx < this.images.length - 1) ||
            (direction === -1 && this.currentIdx > 0)) {

            if (direction == -1) {
                this.images[this.currentIdx]['transition'] = 'leaveToRight'
                this.images[this.currentIdx - 1]['transition'] = 'enterFromLeft'
            } else {
                this.images[this.currentIdx]['transition'] = 'leaveToLeft'
                this.images[this.currentIdx + 1]['transition'] = 'enterFromRight'
            }
            this.currentIdx += direction

            if (swipe) {
                this.hideNavigationArrows()
            } else {
                this.showNavigationArrows()
            }
            this.updateImage()
        }
    }

    showNavigationArrows(): void {
        this.leftArrowVisible = true
        this.rightArrowVisible = true
    }

    closeViewer(): void {
        this.images.forEach(image => image['transition'] = undefined)
        this.images.forEach(image => image['active'] = false)
        this.imageService.showImageViewer(false)
    }

    onKeydown(event: KeyboardEvent): void {
        const prevent = [37, 39, 27, 36, 35]
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
                this.updateImage()
                break
            case 35:
                // end
                this.images[this.currentIdx]['transition'] = 'leaveToLeft'
                this.currentIdx = this.images.length - 1
                this.images[this.currentIdx]['transition'] = 'enterFromRight'
                this.updateImage()
                break
            default:
                break
        }
    }

    private hideNavigationArrows(): void {
        this.leftArrowVisible = false
        this.rightArrowVisible = false
    }

    private updateImage(): void {
        // wait for animation to end
        setTimeout(() => {
            this.updateQuality()
            this.images[this.currentIdx]['active'] = true
            this.images.forEach(image => {
                if (image != this.images[this.currentIdx]) {
                    image['active'] = false
                    this.transform = 0
                }
            })
        }, 500)
    }

    private updateQuality(): void {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight

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
                break
            }
            case 'low': {
                this.categorySelected = 'preview_xxs'
                break
            }
            case 'mid': {
                this.categorySelected = 'preview_m'
                break
            }
            case 'high': {
                this.categorySelected = 'raw'
                break
            }
            default: {
              this.categorySelected = 'preview_m'
            }
        }
    }
}
