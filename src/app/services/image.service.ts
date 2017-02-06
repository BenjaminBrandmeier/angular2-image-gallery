import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ImageService {
    private imagesUpdatedSource = new Subject<any[]>()
    private imageSelectedIndexUpdatedSource = new Subject<number>()
    private showImageViewerSource = new Subject<boolean>()

    imagesUpdated$ : Observable<any[]> = this.imagesUpdatedSource.asObservable()
    imageSelectedIndexUpdated$ : Observable<number> = this.imageSelectedIndexUpdatedSource.asObservable()
    showImageViewerChanged$ : Observable<boolean> = this.showImageViewerSource.asObservable()

    updateImages(images: any[]) {
        this.imagesUpdatedSource.next(images)
    }

    updateSelectedImageIndex(newIndex: number) {
        this.imageSelectedIndexUpdatedSource.next(newIndex)
    }

    showImageViewer(show: boolean) {
        this.showImageViewerSource.next(show)
    }
}