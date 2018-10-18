import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-search-result-single-project-options',
  templateUrl: './search-result-single-project-options.component.html',
  styleUrls: ['./search-result-single-project-options.component.css']
})
export class SearchResultSingleProjectOptionsComponent implements OnInit {
  pinText: string;
  @Input() pinned = false;
  @Input() allowEdit = true;
  @Input() allowPin = true;
  @Input() projectId: number;

  PIN = 'PIN';
  EDIT = 'EDIT';

  constructor(@Inject(Router) private router: Router) { }

  ngOnInit() {
    this.pinnedTextRefresh();
  }

  pinnedTextRefresh() {
    if (this.pinned) {
      this.pinText = 'Odepnij';
    } else {
      this.pinText = 'Przypnij';
    }
  }

  selectChange(value: string) {
    switch (value) {
      case this.PIN:
        this.pinned = !this.pinned;
        this.pinnedTextRefresh();
        break;
      case this.EDIT:
        if (this.projectId) {
          this.router.navigate(['/edit-project', this.projectId]);
        }
        break;
    }
  }

}
