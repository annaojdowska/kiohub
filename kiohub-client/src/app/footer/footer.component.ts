import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  pathToLogoPg: string;
  pathToLogoKio: string;
  pgUrl: string;
  kioUrl: string;
  kiohubRulesUrl: string;

  constructor() {
    this.pathToLogoPg = '../../assets/small-logo-pg.png';
    this.pathToLogoKio = '../../assets/small-kio-logo-with-text-transparent.png';
    this.kioUrl = 'https://eti.pg.edu.pl/katedra-inzynierii-oprogramowania';
    this.pgUrl = 'https://pg.edu.pl/';
    this.kiohubRulesUrl = 'http://kiohub.eti.pg.gda.pl/rules';
  }

  ngOnInit() {
  }
}
