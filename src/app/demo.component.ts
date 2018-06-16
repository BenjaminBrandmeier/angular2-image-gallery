import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

    flexBorderSize: number = 3
    flexImageSize: number = 7
    galleryName: string = ''

    constructor() {
    }

    ngOnInit(): void {
    }

    onViewerVisibilityChanged(isVisible: boolean): void {
        console.log(`viewer visible: ${isVisible}`)
    }
}
