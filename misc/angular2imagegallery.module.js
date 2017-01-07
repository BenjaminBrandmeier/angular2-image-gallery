"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var gallery_component_1 = require("./gallery/gallery.component");
var viewer_component_1 = require("./viewer/viewer.component");
var material_1 = require("@angular/material");
var image_service_1 = require("./services/image.service");
var Angular2ImageGalleryModule = (function () {
    function Angular2ImageGalleryModule() {
    }
    Angular2ImageGalleryModule = __decorate([
        core_1.NgModule({
            declarations: [
                gallery_component_1.GalleryComponent,
                viewer_component_1.ViewerComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot()
            ],
            providers: [image_service_1.ImageService],
            exports: [
                gallery_component_1.GalleryComponent,
                viewer_component_1.ViewerComponent
            ]
        })
    ], Angular2ImageGalleryModule);
    return Angular2ImageGalleryModule;
}());
exports.Angular2ImageGalleryModule = Angular2ImageGalleryModule;
