import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor() { }

  private flexBorderSize: number = 3
  private flexImageSize: number = 7

  ngOnInit() {
  }

}
