import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  images = [1, 2, 3].map(() => {
    return `https://picsum.photos/900/500?random&t=${Math.random()}`;
  });

  constructor() {
  }

  ngOnInit() {
  }


}
