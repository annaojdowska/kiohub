import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { SearchService } from '../search-service/search.service';

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
  results: Project[];
  constructor(@Inject(HttpClient) private http: HttpClient, @Inject(SearchService) private searchService: SearchService) { }

  ngOnInit() {
    this.searchService.getSearchResults().subscribe(res => this.results = res);
  }

  send2() {
    this.http.post<Project>('http://kiohub.eti.pg.gda.pl:8080/project/post', this.results[0], httpOptions)
    .subscribe(data => {
      alert('ok');
    },
    error => {
      alert('nie ok');
    });
  }
}
