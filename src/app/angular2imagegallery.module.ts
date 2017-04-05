import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {GalleryComponent} from "./gallery/gallery.component";
import {ViewerComponent} from "./viewer/viewer.component";
import {MaterialModule} from "@angular/material";
import {ImageService} from "./services/image.service";
import {DemoComponent} from "./demo/demo.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        GalleryComponent,
        ViewerComponent,
        DemoComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        MaterialModule.forRoot()
    ],
    providers: [
        ImageService
    ],
    exports: [
        GalleryComponent,
        ViewerComponent
    ],
    bootstrap: [
        DemoComponent
    ]
})
export class Angular2ImageGalleryModule {
}
