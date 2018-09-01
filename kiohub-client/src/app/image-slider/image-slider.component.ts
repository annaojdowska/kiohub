import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  public imagesUrl;
  constructor() { }

  ngOnInit() {
    this.imagesUrl = [
      '../assets/add-photo.png',
      '../assets/add-project.png',
      '../assets/add.png',
      ];
  }

}
