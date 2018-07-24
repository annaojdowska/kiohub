import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unlogged-search',
  templateUrl: './unlogged-search.component.html',
  styleUrls: ['./unlogged-search.component.css']
})
export class UnloggedSearchComponent implements OnInit {

  pathToSearchIcon: string;
  constructor() {
    this.pathToSearchIcon = '../../assets/search_icon.svg';
  }

  ngOnInit() {
  }

}
