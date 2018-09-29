import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { Note } from '../model/note.interface';
import { NoteService } from '../services/note.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';

@Component({
  selector: 'app-edit-project-notes-tab',
  templateUrl: './edit-project-notes-tab.component.html',
  styleUrls: ['./edit-project-notes-tab.component.css']
})
export class EditProjectNotesTabComponent implements OnInit {
  notes: Note[] = [];
  notesOwners: User[] = [];
  projectId: number;
  noteInputShows: boolean;
  noteEditInputShows: boolean;
  inputEditNote: string;
  inputEditId: number;

  @ViewChild('newNoteContent') newNoteContent: any;
  @ViewChild('editNoteContent') editNoteContent: any;

  getProjectIdFromRouter() {
    let id: number;
    this.route.params.subscribe(routeParams => {
      id = routeParams.id;
    });
    return id;
  }

  constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
              @Inject(NoteService) private noteService: NoteService,
              @Inject(UserService) private userService: UserService,
              @Inject(Router) private router: Router) { }

  ngOnInit() {
    this.projectId = this.getProjectIdFromRouter();
    this.noteService.getNotesByProjectId(this.projectId).subscribe(result => result.forEach(note => {
      this.notes.push(note);
      this.userService.getUserById(note.ownerId).subscribe(owner => this.notesOwners.push(owner));
    }));
    this.noteInputShows = false;
    this.noteEditInputShows = false;
  }

  addNote() {
    const newNoteContent = this.newNoteContent.nativeElement.value;
   // TO DO: drugi parametr - widoczność, trzeci parametr - zalogowany użytkownik
    this.noteService.addNote(newNoteContent, 0, 296, this.projectId).subscribe(result => console.log(result));
    window.location.reload();
  }

  editNote(noteId: number) {
    window.scrollTo(0, 0);
    this.inputEditNote = this.notes.find(note => note.id === noteId).content;
    this.inputEditId = noteId;
  }

  deleteNote(noteId: number) {
    this.noteService.deleteNote(noteId).subscribe(result => console.log(result));
    window.location.reload();
  }

  editExistingNote() {
    const editNoteContent = this.editNoteContent.nativeElement.value;
    this.noteService.editNote(this.inputEditId, editNoteContent).subscribe(result => console.log(result));

    window.location.reload();
    this.noteEditInputShows = false;
  }

  toggleNoteInput() {
    if (this.noteEditInputShows) {
      this.noteEditInputShows = false;
    }
    this.noteInputShows = !this.noteInputShows;
  }

  showEditNoteInput() {
    this.noteInputShows = false;
    this.noteEditInputShows = true;
  }

  closeEditNoteInput() {
    this.noteEditInputShows = false;
  }
}
