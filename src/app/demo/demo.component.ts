import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor() { }

  public flexBorderSize: number = 3
  public flexImageSize: number = 7
  public galleryName: string = ''

  ngOnInit() {
  }

  onViewerVisibilityChanged(isVisible: boolean) {
    console.log('viewer visible: ' + isVisible)
  }
}
