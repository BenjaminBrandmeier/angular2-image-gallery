import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ImageService {

    constructor() {
    }

    private imagesUpdatedSource = new Subject<any[]>()
    private imageSelectedIndexUpdatedSource = new Subject<number>()
    private showImageViewerSource = new Subject<boolean>()

    imagesUpdated$ = this.imagesUpdatedSource.asObservable()
    imageSelectedIndexUpdated$ = this.imageSelectedIndexUpdatedSource.asObservable()
    showImageViewerChanged$ = this.showImageViewerSource.asObservable()

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