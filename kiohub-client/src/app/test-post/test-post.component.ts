import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { SearchService } from '../search-service/search.service';
import { ProjectType } from '../model/project-type.interface';

const httpOptions = {
  headers: new HttpHeaders({
    'ContentType' : 'application/json'
  })
};
@Component({
  selector: 'app-test-post',
  templateUrl: './test-post.component.html',
  styleUrls: ['./test-post.component.css']
})

export class TestPostComponent implements OnInit {
  @ViewChild('nameInput') nameInput: any;
  @ViewChild('name2Input') name2Input: any;
  results: Project[];
  constructor(@Inject(HttpClient) private http: HttpClient, @Inject(SearchService) private searchService: SearchService) { }

  ngOnInit() {
    this.searchService.getSearchResults().subscribe(res => this.results = res);
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

  send2() {
    console.log(this.results[0]);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<Project>('http://localhost:8080/project/post', this.results[0], httpOptions)
    // this.http.post<ProjectType>('http://localhost:8080/project/post', this.results[0].projectType, httpOptions)
    .subscribe(data => {
      alert('ok');
    },
    error => {
      // console.log(JSON.stringify(error.json()));
      alert('nie ok');
    });
  }
}
