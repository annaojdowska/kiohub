import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-test-post',
  templateUrl: './test-post.component.html',
  styleUrls: ['./test-post.component.css']
})

export class TestPostComponent implements OnInit {
  @ViewChild('nameInput') nameInput: any;
  @ViewChild('name2Input') name2Input: any;
  constructor(@Inject(Http) private http: Http) { }

  ngOnInit() {
  }

  send() {
    const nameFromInput = this.nameInput.nativeElement.value;
    const name2FromInput = this.name2Input.nativeElement.value;

    const body = new URLSearchParams();
    body.set('name', nameFromInput);
    body.set('name2', name2FromInput);

    this.http.post('http://kiohub.eti.pg.gda.pl:8080/project/addTag', body.toString())
    .subscribe(data => {
      alert('ok');
    },
    error => {
      // console.log(JSON.stringify(error.json()));
      alert('nie ok');
    });
  }
}
