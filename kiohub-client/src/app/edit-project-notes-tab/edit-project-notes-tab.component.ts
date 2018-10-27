import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { Note } from '../model/note.interface';
import { NoteService } from '../services/note.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user.interface';
import { Visibility } from '../model/visibility.enum';
import { SpinnerComponent } from '../ui-elements/spinner/spinner.component';
import { ViewUtils } from '../utils/view-utils';

@Component({
  selector: 'app-edit-project-notes-tab',
  templateUrl: './edit-project-notes-tab.component.html',
  styleUrls: ['./edit-project-notes-tab.component.css']
})
export class EditProjectNotesTabComponent implements OnInit {
  notes: Note[] = [];
  mapNotesUsers: Map<Note, User> = new Map<Note, User>();
  projectId: number;
  noteInputShows: boolean;
  noteEditInputShows: boolean;
  inputEditNote: string;
  inputEditId: number;
  visibilitySelected: string;
  currentUser: User;
  viewUtils = new ViewUtils();

  MAX_LENGTH = 500; // value from database

  tooltipVisibility = 'Zmień widoczność elementu.';
  tooltipDelete = 'Usuń notatkę.';
  tooltipEdit = 'Edytuj treść i widoczność notatki.';
  tooltipPrivateNote = 'Ta notatka jest widoczna tylko dla Ciebie.';
  tooltipPublicNote = 'Ta notatka jest widoczna dla wszystkich współtwórców projektu.';

  @ViewChild('noteVisibility') noteVisibility: any;
  @ViewChild('newNoteContent') newNoteContent: any;
  @ViewChild('editNoteContent') editNoteContent: any;
  @ViewChild('spinner') spinner: SpinnerComponent;
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
    this.downloadNotes();
    this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
  }

  private downloadNotes() {
    this.viewUtils.scrollToTop();
    this.notes = [];
    this.mapNotesUsers.clear();
    this.noteService.getNotesByProjectId(this.projectId)
      .subscribe(allNotes => allNotes
        .forEach(note => {
          this.notes.push(note);
          this.userService.getUserById(note.ownerId, this.projectId)
            .subscribe(owner => {
              this.mapNotesUsers.set(note, owner);
            }
            );
          console.log('Notatka');
          console.log(note);
        }));
    this.noteInputShows = false;
    this.noteEditInputShows = false;
    this.noteVisibility = 'COLLABORATORS';
    this.spinner.setDisplay(false);
  }

  addNote() {
    this.spinner.showSpinner('Trwa dodawanie notatki.');
    const newNoteContent = this.newNoteContent.nativeElement.value;
    const visibility = this.noteVisibility === 'PRIVATE' ? 1 : 0;
    this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    this.noteService.addNote(newNoteContent, visibility, this.currentUser.id, this.projectId) // testy 437
      .subscribe(result => {
        this.downloadNotes();
      });
  }
  editNote(noteId: number) {
    this.viewUtils.scrollToTop();
    let editingNote: Note;
    editingNote = this.notes.find(note => note.id === noteId);
    this.inputEditNote = editingNote.content;
    this.inputEditId = noteId;
    this.noteVisibility = editingNote.isPrivate ? 'PRIVATE' : 'COLLABORATORS';
  }

  deleteNote(noteId: number) {
    this.spinner.showSpinner('Trwa usuwanie notatki.');
    this.noteService.deleteNote(this.projectId, noteId)
      .subscribe(result => {
        this.downloadNotes();
      });
  }

  updateNote() {
    this.spinner.showSpinner('Trwa aktualizowanie notatki');
    const editNoteContent = this.editNoteContent.nativeElement.value;
    const visibility = this.noteVisibility === 'PRIVATE' ? 1 : 0;
    this.noteService
      .editNote(this.inputEditId, editNoteContent, visibility, this.projectId)
      .subscribe(result => {
        this.downloadNotes();
        this.noteEditInputShows = false;
      });
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
