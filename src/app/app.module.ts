import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { GalleryComponent } from './gallery/gallery.component';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
  declarations: [
    GalleryComponent,
    ViewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [GalleryComponent]
})
export class AppModule { }
