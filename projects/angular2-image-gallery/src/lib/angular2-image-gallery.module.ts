import { NgModule } from '@angular/core'
import { ImageService } from './services/image.service'
import { GalleryComponent } from './gallery/gallery.component'
import { ViewerComponent } from './viewer/viewer.component'
import { CommonModule } from '@angular/common'

@NgModule({
  imports: [
    CommonModule
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
