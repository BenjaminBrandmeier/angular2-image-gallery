import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ImageService} from "./services/image.service";
import {GalleryComponent} from "./gallery/gallery.component";
import {ViewerComponent} from "./viewer/viewer.component";
import {DemoComponent} from "./demo/demo.component";


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
    BrowserAnimationsModule
  ],
  providers: [
    ImageService
  ],
  bootstrap: [
    DemoComponent
  ],
  exports: [
    GalleryComponent,
    ViewerComponent
  ]
})
export class Angular2ImageGalleryModule {
}
