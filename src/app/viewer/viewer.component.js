"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
require("rxjs/Rx");
var ViewerComponent = (function () {
    function ViewerComponent(ImageService) {
        var _this = this;
        this.ImageService = ImageService;
        this.images = [{}];
        this.currentIdx = 0;
        this.leftArrowVisible = true;
        this.rightArrowVisible = true;
        this.qualitySelectorShown = false;
        this.qualitySelected = 'auto';
        this.categorySelected = 'preview_xxs';
        ImageService.imagesUpdated$.subscribe(function (images) {
            _this.images = images;
        });
        ImageService.imageSelectedIndexUpdated$.subscribe(function (newIndex) {
            _this.currentIdx = newIndex;
            _this.images.forEach(function (image) { return image['active'] = false; });
            _this.images[_this.currentIdx]['active'] = true;
            _this.transform = '0px';
            _this.updateQuality();
        });
        ImageService.showImageViewerChanged$.subscribe(function (showViewer) {
            _this.showViewer = showViewer;
        });
        this.Math = Math;
    }
    Object.defineProperty(ViewerComponent.prototype, "leftArrowActive", {
        get: function () {
            return this.currentIdx > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewerComponent.prototype, "rightArrowActive", {
        get: function () {
            return this.currentIdx < this.images.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    ViewerComponent.prototype.pan = function (swipe) {
        var currentDeltaX = swipe.deltaX;
        this.transform = currentDeltaX + 'px';
    };
    ViewerComponent.prototype.onResize = function () {
        this.images.forEach(function (image) {
            image['viewerImageLoaded'] = false;
            image['active'] = false;
        });
        this.updateImage();
    };
    ViewerComponent.prototype.showQualitySelector = function () {
        this.qualitySelectorShown = !this.qualitySelectorShown;
    };
    ViewerComponent.prototype.qualityChanged = function (newQuality) {
        this.qualitySelected = newQuality;
        this.updateImage();
    };
    ViewerComponent.prototype.imageLoaded = function (image) {
        image['viewerImageLoaded'] = true;
    };
    /**
     * direction (-1: left, 1: right)
     * swipe (user swiped)
     */
    ViewerComponent.prototype.navigate = function (direction, swipe) {
        if ((direction === 1 && this.currentIdx < this.images.length - 1) ||
            (direction === -1 && this.currentIdx > 0)) {
            if (direction == -1) {
                this.images[this.currentIdx]['transition'] = 'leaveToRight';
                this.images[this.currentIdx - 1]['transition'] = 'enterFromLeft';
            }
            else {
                this.images[this.currentIdx]['transition'] = 'leaveToLeft';
                this.images[this.currentIdx + 1]['transition'] = 'enterFromRight';
            }
            this.currentIdx += direction;
            if (swipe) {
                this.hideNavigationArrows();
            }
            else {
                this.showNavigationArrows();
            }
            this.updateImage();
        }
    };
    ViewerComponent.prototype.hideNavigationArrows = function () {
        this.leftArrowVisible = false;
        this.rightArrowVisible = false;
    };
    ViewerComponent.prototype.showNavigationArrows = function () {
        this.leftArrowVisible = true;
        this.rightArrowVisible = true;
    };
    ViewerComponent.prototype.closeViewer = function () {
        this.images.forEach(function (image) { return image['transition'] = undefined; });
        this.images.forEach(function (image) { return image['active'] = false; });
        this.ImageService.showImageViewer(false);
    };
    ViewerComponent.prototype.updateImage = function () {
        var _this = this;
        // wait for animation to end
        setTimeout(function () {
            _this.updateQuality();
            _this.images[_this.currentIdx]['active'] = true;
            _this.images.forEach(function (image) {
                if (image != _this.images[_this.currentIdx]) {
                    image['active'] = false;
                    _this.transform = '0px';
                }
            });
        }, 500);
    };
    ViewerComponent.prototype.updateQuality = function () {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        switch (this.qualitySelected) {
            case 'auto': {
                this.categorySelected = 'preview_xxs';
                if (screenWidth > this.images[this.currentIdx]['preview_xxs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xxs'].height) {
                    this.categorySelected = 'preview_xs';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_xs'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xs'].height) {
                    this.categorySelected = 'preview_s';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_s'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_s'].height) {
                    this.categorySelected = 'preview_m';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_m'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_m'].height) {
                    this.categorySelected = 'preview_l';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_l'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_l'].height) {
                    this.categorySelected = 'preview_xl';
                }
                if (screenWidth > this.images[this.currentIdx]['preview_xl'].width &&
                    screenHeight > this.images[this.currentIdx]['preview_xl'].height) {
                    this.categorySelected = 'raw';
                }
                break;
            }
            case 'low': {
                this.categorySelected = 'preview_xxs';
                break;
            }
            case 'mid': {
                this.categorySelected = 'preview_m';
                break;
            }
            case 'high': {
                this.categorySelected = 'raw';
                break;
            }
        }
    };
    ViewerComponent.prototype.onKeydown = function (event) {
        var prevent = [37, 39, 27, 36, 35]
            .find(function (no) { return no === event.keyCode; });
        if (prevent) {
            event.preventDefault();
        }
        switch (prevent) {
            case 37:
                // navigate left
                this.navigate(-1, false);
                break;
            case 39:
                // navigate right
                this.navigate(1, false);
                break;
            case 27:
                // esc
                this.closeViewer();
                break;
            case 36:
                // pos 1
                this.images[this.currentIdx]['transition'] = 'leaveToRight';
                this.currentIdx = 0;
                this.images[this.currentIdx]['transition'] = 'enterFromLeft';
                this.updateImage();
                break;
            case 35:
                // end
                this.images[this.currentIdx]['transition'] = 'leaveToLeft';
                this.currentIdx = this.images.length - 1;
                this.images[this.currentIdx]['transition'] = 'enterFromRight';
                this.updateImage();
                break;
        }
    };
    ViewerComponent = __decorate([
        core_1.Component({
            selector: 'viewer',
            templateUrl: './viewer.component.html',
            styleUrls: ['./viewer.component.css'],
            host: {
                '(document:keydown)': 'onKeydown($event)',
            },
            animations: [
                core_1.trigger('imageTransition', [
                    core_1.state('enterFromRight', core_1.style({
                        opacity: 1,
                        transform: 'translate(0px, 0px)'
                    })),
                    core_1.state('enterFromLeft', core_1.style({
                        opacity: 1,
                        transform: 'translate(0px, 0px)'
                    })),
                    core_1.state('leaveToLeft', core_1.style({
                        opacity: 0,
                        transform: 'translate(-10%, 0px)'
                    })),
                    core_1.state('leaveToRight', core_1.style({
                        opacity: 0,
                        transform: 'translate(10%, 0px)'
                    })),
                    core_1.transition('* => enterFromRight', [
                        core_1.style({
                            opacity: 0,
                            transform: 'translate(3%, 0px)'
                        }),
                        core_1.animate('250ms 500ms ease-in')
                    ]),
                    core_1.transition('* => enterFromLeft', [
                        core_1.style({
                            opacity: 0,
                            transform: 'translate(-3%, 0px)'
                        }),
                        core_1.animate('250ms 500ms ease-in')
                    ]),
                    core_1.transition('* => leaveToLeft', [
                        core_1.style({
                            opacity: 1,
                            transform: 'translate(0px, 0px)'
                        }),
                        core_1.animate('250ms ease-out')]),
                    core_1.transition('* => leaveToRight', [
                        core_1.style({
                            opacity: 1,
                            transform: 'translate(0px, 0px)'
                        }),
                        core_1.animate('250ms ease-out')])
                ]),
                core_1.trigger('showViewerTransition', [
                    core_1.state('true', core_1.style({
                        opacity: 1
                    })),
                    core_1.state('void', core_1.style({
                        opacity: 0
                    })),
                    core_1.transition('void => *', [
                        core_1.style({
                            opacity: 0
                        }),
                        core_1.animate('1000ms ease-in')]),
                    core_1.transition('* => void', [
                        core_1.style({
                            opacity: 1
                        }),
                        core_1.animate('500ms ease-out')])
                ])
            ]
        })
    ], ViewerComponent);
    return ViewerComponent;
}());
exports.ViewerComponent = ViewerComponent;
