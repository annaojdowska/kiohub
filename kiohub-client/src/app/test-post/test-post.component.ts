import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Project } from '../model/project.interface';
import { SearchService } from '../services/search.service';
import { AttachmentType } from '../model/attachment-type.enum';
import { Visibility } from '../model/visibility.enum';
import { AttachmentService } from '../services/attachment.service';

const httpOptions = {
  headers: new HttpHeaders({
    'ContentType' : 'application/json'
  })
};

const httpOptionsMultipart = {
  headers: new HttpHeaders({
    'ContentType' : 'multipart/form-data'
  })
};

@Component({
  selector: 'app-test-post',
  templateUrl: './test-post.component.html',
  styleUrls: ['./test-post.component.css']
})

export class TestPostComponent implements OnInit {
  results: Project[];
  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(SearchService) private searchService: SearchService,
    @Inject(AttachmentService) private attachmentService: AttachmentService) { }

  ngOnInit() {
    this.searchService.getAllProjects().subscribe(res => this.results = res);
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

  addFile(event, projectId: string) {
    const file: Blob = event.target.files[0];

    // With service
    this.attachmentService.upload(file, AttachmentType.MANUAL_USAGE, projectId, Visibility.EVERYONE, false).subscribe(data => {
      alert('ok');
    },
    error => {
      alert('nie ok');
    });

    // Without service
    // const formData = new FormData();
    // formData.append('File', file);
    // formData.append('ProjectId', projectId);
    // formData.append('Type', AttachmentType.THESIS);
    // formData.append('Visibility', Visibility.EVERYONE);
    // formData.append('MainPhoto', 'false');
    // this.http.post<string>('http://localhost:8080/attachment/upload', formData, httpOptionsMultipart)
    // .subscribe(data => {
    //   alert('ok');
    // },
    // error => {
    //   alert('nie ok');
    // });
  }
}
