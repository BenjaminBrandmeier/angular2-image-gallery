import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {GalleryComponent} from "./gallery/gallery.component";
import {ViewerComponent} from "./viewer/viewer.component";
import {MaterialModule} from "@angular/material";
import {ImageService} from "./services/image.service";

@NgModule({
    declarations: [
        GalleryComponent,
        ViewerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule.forRoot()
    ],
    providers: [ImageService],
    exports: [
        GalleryComponent,
        ViewerComponent
    ]
})
export class Angular2ImageGalleryModule {
}
