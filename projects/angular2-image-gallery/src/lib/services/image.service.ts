import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { ImageMetadata } from '../data/image-metadata'

@Injectable()
export class ImageService {
  private imagesUpdatedSource = new Subject<ImageMetadata[]>()
  private imageSelectedIndexUpdatedSource = new Subject<number>()
  private showImageViewerSource = new Subject<boolean>()

  imagesUpdated$: Observable<ImageMetadata[]> = this.imagesUpdatedSource.asObservable()
  imageSelectedIndexUpdated$: Observable<number> = this.imageSelectedIndexUpdatedSource.asObservable()
  showImageViewerChanged$: Observable<boolean> = this.showImageViewerSource.asObservable()

  updateImages(images: ImageMetadata[]): void {
    this.imagesUpdatedSource.next(images)
  }

  updateSelectedImageIndex(newIndex: number): void {
    this.imageSelectedIndexUpdatedSource.next(newIndex)
  }

  showImageViewer(show: boolean): void {
    this.showImageViewerSource.next(show)
  }
}
