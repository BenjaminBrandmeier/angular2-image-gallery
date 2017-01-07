"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
require("rxjs/Rx");
var GalleryComponent = (function () {
    function GalleryComponent(ImageService, http, ChangeDetectorRef, elementRef) {
        this.ImageService = ImageService;
        this.http = http;
        this.ChangeDetectorRef = ChangeDetectorRef;
        this.providedImageMargin = 3;
        this.providedImageSize = 7;
        this.imageDataFilePath = 'assets/img/gallery/data.json';
        this.images = [];
        this.gallery = [];
        this.minimalQualityCategory = 'preview_xxs';
    }
    GalleryComponent.prototype.triggerCycle = function (event) {
        this.scaleGallery();
    };
    GalleryComponent.prototype.windowResize = function (event) {
        this.render();
    };
    GalleryComponent.prototype.ngOnInit = function () {
        this.fetchDataAndRender();
    };
    GalleryComponent.prototype.ngOnChanges = function (changes) {
        // input params changed
        this.render();
    };
    GalleryComponent.prototype.openImageViewer = function (img) {
        this.ImageService.updateSelectedImageIndex(this.images.indexOf(img));
        this.ImageService.showImageViewer(true);
    };
    GalleryComponent.prototype.fetchDataAndRender = function () {
        var _this = this;
        this.http.get(this.imageDataFilePath)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.images = data;
            _this.ImageService.updateImages(_this.images);
            _this.images.forEach(function (image) {
                image['galleryImageLoaded'] = false;
                image['viewerImageLoaded'] = false;
                image['srcAfterFocus'] = '';
            });
            // twice, single leads to different strange browser behaviour
            _this.render();
            _this.render();
        }, function (err) { return console.error("Did you run the convert script from angular2-image-gallery for your images first? Original error: " + err); }, function () { return undefined; });
    };
    GalleryComponent.prototype.render = function () {
        this.gallery = [];
        var tempRow = [this.images[0]];
        var rowIndex = 0;
        var i = 0;
        for (i; i < this.images.length; i++) {
            while (this.images[i + 1] && this.shouldAddCandidate(tempRow, this.images[i + 1])) {
                i++;
            }
            if (this.images[i + 1]) {
                tempRow.pop();
            }
            this.gallery[rowIndex++] = tempRow;
            tempRow = [this.images[i + 1]];
        }
        this.scaleGallery();
    };
    GalleryComponent.prototype.shouldAddCandidate = function (imgRow, candidate) {
        var oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
        imgRow.push(candidate);
        var newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
        return Math.abs(oldDifference) > Math.abs(newDifference);
    };
    GalleryComponent.prototype.calcRowHeight = function (imgRow) {
        var originalRowWidth = this.calcOriginalRowWidth(imgRow);
        var ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth;
        var rowHeight = imgRow[0][this.minimalQualityCategory]['height'] * ratio;
        return rowHeight;
    };
    GalleryComponent.prototype.calcImageMargin = function () {
        var galleryWidth = this.getGalleryWidth();
        var ratio = galleryWidth / 1920;
        return Math.round(Math.max(1, this.providedImageMargin * ratio));
    };
    GalleryComponent.prototype.calcOriginalRowWidth = function (imgRow) {
        var _this = this;
        var originalRowWidth = 0;
        imgRow.forEach(function (img) {
            var individualRatio = _this.calcIdealHeight() / img[_this.minimalQualityCategory]['height'];
            img[_this.minimalQualityCategory]['width'] = img[_this.minimalQualityCategory]['width'] * individualRatio;
            img[_this.minimalQualityCategory]['height'] = _this.calcIdealHeight();
            originalRowWidth += img[_this.minimalQualityCategory]['width'];
        });
        return originalRowWidth;
    };
    GalleryComponent.prototype.calcIdealHeight = function () {
        return this.getGalleryWidth() / (80 / this.providedImageSize) + 100;
    };
    GalleryComponent.prototype.getGalleryWidth = function () {
        if (this.galleryContainer.nativeElement.clientWidth === 0) {
            // IE11
            return this.galleryContainer.nativeElement.scrollWidth;
        }
        return this.galleryContainer.nativeElement.clientWidth;
    };
    GalleryComponent.prototype.scaleGallery = function () {
        var _this = this;
        var imageCounter = 0;
        var maximumGalleryImageHeight = 0;
        this.gallery.forEach(function (imgRow) {
            var originalRowWidth = _this.calcOriginalRowWidth(imgRow);
            if (imgRow !== _this.gallery[_this.gallery.length - 1]) {
                var ratio_1 = (_this.getGalleryWidth() - (imgRow.length - 1) * _this.calcImageMargin()) / originalRowWidth;
                imgRow.forEach(function (img) {
                    img['width'] = img[_this.minimalQualityCategory]['width'] * ratio_1;
                    img['height'] = img[_this.minimalQualityCategory]['height'] * ratio_1;
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height']);
                    _this.checkForAsyncLoading(img, imageCounter++);
                });
            }
            else {
                imgRow.forEach(function (img) {
                    img.width = img[_this.minimalQualityCategory]['width'];
                    img.height = img[_this.minimalQualityCategory]['height'];
                    maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img['height']);
                    _this.checkForAsyncLoading(img, imageCounter++);
                });
            }
        });
        if (maximumGalleryImageHeight > 375) {
            this.minimalQualityCategory = 'preview_xs';
        }
        else {
            this.minimalQualityCategory = 'preview_xxs';
        }
        this.ChangeDetectorRef.detectChanges();
    };
    GalleryComponent.prototype.checkForAsyncLoading = function (image, imageCounter) {
        var imageElements = this.imageElements.toArray();
        if (image['galleryImageLoaded'] ||
            (imageElements.length > 0 && this.isScrolledIntoView(imageElements[imageCounter].nativeElement))) {
            image['galleryImageLoaded'] = true;
            image['srcAfterFocus'] = image[this.minimalQualityCategory]['path'];
        }
        else {
            image['srcAfterFocus'] = '';
        }
    };
    GalleryComponent.prototype.isScrolledIntoView = function (element) {
        var elementTop = element.getBoundingClientRect().top;
        var elementBottom = element.getBoundingClientRect().bottom;
        return elementTop < window.innerHeight && elementBottom >= 0 && (elementBottom > 0 || elementTop > 0);
    };
    __decorate([
        core_1.Input('flexBorderSize')
    ], GalleryComponent.prototype, "providedImageMargin", void 0);
    __decorate([
        core_1.Input('flexImageSize')
    ], GalleryComponent.prototype, "providedImageSize", void 0);
    __decorate([
        core_1.ViewChild('galleryContainer')
    ], GalleryComponent.prototype, "galleryContainer", void 0);
    __decorate([
        core_1.ViewChildren('imageElement')
    ], GalleryComponent.prototype, "imageElements", void 0);
    __decorate([
        core_1.HostListener('window:scroll', ['$event'])
    ], GalleryComponent.prototype, "triggerCycle", null);
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], GalleryComponent.prototype, "windowResize", null);
    GalleryComponent = __decorate([
        core_1.Component({
            selector: 'gallery',
            templateUrl: './gallery.component.html',
            styleUrls: ['./gallery.component.css']
        })
    ], GalleryComponent);
    return GalleryComponent;
}());
exports.GalleryComponent = GalleryComponent;
