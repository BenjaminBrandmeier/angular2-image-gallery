import { NgModule } from '@angular/core'
import { ImageService } from './services/image.service'
import { GalleryComponent } from './gallery/gallery.component'
import { ViewerComponent } from './viewer/viewer.component'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  declarations: [
    GalleryComponent,
    ViewerComponent
  ],
  providers: [
    ImageService
  ],
  exports: [
    GalleryComponent,
    ViewerComponent
  ]
})
export class Angular2ImageGalleryModule {
}
