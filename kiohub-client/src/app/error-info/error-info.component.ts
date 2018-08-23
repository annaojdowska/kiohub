import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-info',
  templateUrl: './error-info.component.html',
  styleUrls: ['./error-info.component.css']
})
export class ErrorInfoComponent implements OnInit {
@Input() errorText: string;

  ngOnInit() {
  }

}
