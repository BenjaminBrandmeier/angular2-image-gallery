"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var rxjs_1 = require("rxjs");
var ImageService = (function () {
    function ImageService() {
        this.imagesUpdatedSource = new rxjs_1.Subject();
        this.imageSelectedIndexUpdatedSource = new rxjs_1.Subject();
        this.showImageViewerSource = new rxjs_1.Subject();
        this.imagesUpdated$ = this.imagesUpdatedSource.asObservable();
        this.imageSelectedIndexUpdated$ = this.imageSelectedIndexUpdatedSource.asObservable();
        this.showImageViewerChanged$ = this.showImageViewerSource.asObservable();
    }
    ImageService.prototype.updateImages = function (images) {
        this.imagesUpdatedSource.next(images);
    };
    ImageService.prototype.updateSelectedImageIndex = function (newIndex) {
        this.imageSelectedIndexUpdatedSource.next(newIndex);
    };
    ImageService.prototype.showImageViewer = function (show) {
        this.showImageViewerSource.next(show);
    };
    ImageService = __decorate([
        core_1.Injectable()
    ], ImageService);
    return ImageService;
}());
exports.ImageService = ImageService;
