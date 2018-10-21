import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { Note } from '../model/note.interface';
import { NoteService } from '../services/note.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { Visibility } from '../model/visibility.enum';

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
  visibilitySelected: string;

  MAX_LENGTH = 500; // value from database

  tooltipVisibility = 'Zmień widoczność elementu.';
  tooltipDelete = 'Usuń notatkę.';
  tooltipEdit = 'Edytuj treść i widoczność notatki.';
  tooltipPrivateNote = 'Ta notatka jest widoczna tylko dla Ciebie.';
  tooltipPublicNote = 'Ta notatka jest widoczna dla wszystkich współtwórców projektu.';

  @ViewChild('noteVisibility') noteVisibility: any;
  @ViewChild('newNoteContent') newNoteContent: any;
  @ViewChild('editNoteContent') editNoteContent: any;
  @Input() visibilityChangeable = true;

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
      this.userService.getUserById(note.ownerId, this.projectId).subscribe(owner => this.notesOwners.push(owner));
    }));
    this.noteInputShows = false;
    this.noteEditInputShows = false;
    this.noteVisibility = 'COLLABORATORS';
  }

  addNote() {
    const newNoteContent = this.newNoteContent.nativeElement.value;
    const visibility = this.noteVisibility === 'PRIVATE' ? 1 : 0;
    // TO DO: trzeci parametr - zalogowany użytkownik
    this.noteService.addNote(newNoteContent, visibility, 844, this.projectId).subscribe(result => console.log(result));
    window.location.reload();
  }

  editNote(noteId: number) {
    window.scrollTo(0, 0);
    let editingNote: Note;
    editingNote = this.notes.find(note => note.id === noteId);
    this.inputEditNote = editingNote.content;
    this.inputEditId = noteId;
    this.noteVisibility = editingNote.isPrivate ? 'PRIVATE' : 'COLLABORATORS';
  }

  deleteNote(noteId: number) {
    this.noteService.deleteNote(this.projectId, noteId).subscribe(result => console.log(result));
    window.location.reload();
  }

  editExistingNote() {
    const editNoteContent = this.editNoteContent.nativeElement.value;
    const visibility = this.noteVisibility === 'PRIVATE' ? 1 : 0;
    this.noteService.editNote(this.inputEditId, editNoteContent, visibility, this.projectId).subscribe(result => console.log(result));

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

  selectionChange(visibility: Visibility) {
    this.noteVisibility = visibility.toString();
  }
}
