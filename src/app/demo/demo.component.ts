import {Component, OnInit} from '@angular/core'

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

    public flexBorderSize: number = 3
    public flexImageSize: number = 7
    public galleryName: string = ''

    constructor() {
    }

    ngOnInit() {
    }

    onViewerVisibilityChanged(isVisible: boolean) {
        console.log('viewer visible: ' + isVisible)
    }
}
