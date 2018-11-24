import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'app-menu-button',
    templateUrl: './menu-button.component.html',
    styleUrls: ['./menu-button.component.css']
})

export class MenuButtonComponent implements OnInit {
    @Input() title: string;
    @Input() href: string;

    ngOnInit() { }

}
