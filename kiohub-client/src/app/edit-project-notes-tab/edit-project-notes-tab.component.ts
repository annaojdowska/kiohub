import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorInfoComponent } from '../error-info/error-info.component';
import { ErrorType } from '../error-info/error-type.enum';
import { Note } from '../model/note.interface';
import { User } from '../model/user.interface';
import { Visibility } from '../model/visibility.enum';
import { NoteService } from '../services/note.service';
import { UserService } from '../services/user.service';
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
  showVisibility: boolean;
  inputEditNote: string;
  inputEditId: number;
  visibilitySelected: string;
  currentUser: User;
  viewUtils = new ViewUtils();
  inputNewNote = '';

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
  @ViewChild('info') info: ErrorInfoComponent;
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
    this.showVisibility = false;
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
    this.noteService.addNote(newNoteContent, visibility, this.currentUser.id, this.projectId)
      .subscribe(result => {
        this.downloadNotes();
        this.info.setComponent(true, ErrorType.SUCCESS, 'Dodano notatkę.');
      }, error => {
        this.info.setComponent(true, ErrorType.ERROR, 'Dodawanie notatki nie powiodło się.');
        this.spinner.setDisplay(false);
      });
  }

  editNote(noteId: number) {
    this.viewUtils.scrollToTop();
    let editingNote: Note;
    editingNote = this.notes.find(note => note.id === noteId);
    if (this.currentUser.id === editingNote.ownerId) {
      this.showVisibility = true;
    } else {
      this.showVisibility = false;
    }
    this.inputEditNote = editingNote.content;
    this.inputEditId = noteId;
    this.noteVisibility = editingNote.isPrivate ? 'PRIVATE' : 'COLLABORATORS';
  }

  deleteNote(noteId: number) {
    this.spinner.showSpinner('Trwa usuwanie notatki.');
    this.noteService.deleteNote(noteId)
      .subscribe(result => {
        this.downloadNotes();
        this.info.setComponent(true, ErrorType.SUCCESS, 'Usunięto notatkę.');
      }, error => {
        this.info.setComponent(true, ErrorType.ERROR, 'Usunięcie notatki nie powiodło się.');
        this.spinner.setDisplay(false);
      });
  }

  updateNote() {
    this.spinner.showSpinner('Trwa aktualizowanie notatki');
    const editNoteContent = this.editNoteContent.nativeElement.value;
    const visibility = this.noteVisibility === 'PRIVATE' ? 1 : 0;
    this.noteService
      .editNote(this.inputEditId, editNoteContent, visibility)
      .subscribe(result => {
        this.downloadNotes();
        this.noteEditInputShows = false;
        this.info.setComponent(true, ErrorType.SUCCESS, 'Zaktualizowano notatkę.');
      }, error => {
        this.info.setComponent(true, ErrorType.ERROR, 'Nie udało się zaktualizować notatki.');
        this.spinner.setDisplay(false);
      });
  }

  toggleNoteInput() {
    if (this.noteEditInputShows) {
      this.noteEditInputShows = false;
    }
    this.noteInputShows = !this.noteInputShows;
    this.inputNewNote = '';
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
