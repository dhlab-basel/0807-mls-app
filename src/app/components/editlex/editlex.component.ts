import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators} from '@angular/forms';
import {KnoraService, LexiconData, LinkPropertyData, ListPropertyData} from '../../services/knora.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class LexiconIds {
  public label: ValInfo;
  public shortname: ValInfo;
  public citationForm: ValInfo;
  public comment: ValInfo;
  public year: ValInfo;
  public weblink: ValInfo;
  public library: ValInfo;
  public scanFinished: ValInfo;
  public scanVendor: ValInfo;
  public ocrFinished: ValInfo;
  public ocrVendor: ValInfo;
  public editFinished: ValInfo;
  public editVendor: ValInfo;

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.shortname = {id: undefined, changed: false, toBeDeleted: false};
    this.citationForm = {id: undefined, changed: false, toBeDeleted: false};
    this.comment = {id: undefined, changed: false, toBeDeleted: false};
    this.year = {id: undefined, changed: false, toBeDeleted: false};
    this.weblink = {id: undefined, changed: false, toBeDeleted: false};
    this.library = {id: undefined, changed: false, toBeDeleted: false};
    this.scanFinished = {id: undefined, changed: false, toBeDeleted: false};
    this.scanVendor = {id: undefined, changed: false, toBeDeleted: false};
    this.ocrFinished = {id: undefined, changed: false, toBeDeleted: false};
    this.ocrVendor = {id: undefined, changed: false, toBeDeleted: false};
    this.editFinished = {id: undefined, changed: false, toBeDeleted: false};
    this.editVendor = {id: undefined, changed: false, toBeDeleted: false};
  }
}

@Component({
  selector: 'app-editlex',
  template: `
    <mat-card>
      <mat-card-title>Lexicon Editor</mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Label"
                 formControlName="label"
                 (input)="_handleInput('label')">
          <mat-error *ngIf="form.controls.label.errors?.required">Label erforderlich!</mat-error>
          <mat-error *ngIf="form.controls.label.errors?.minlength">Label muss mindestens aus 3 Buchstaben bestehen!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('label')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Kürzel"
                 formControlName="shortname"
                 (input)="_handleInput('shortname')">
          <mat-error *ngIf="form.controls.shortname.errors?.required">Kürzel erforderlich!</mat-error>
          <mat-error *ngIf="form.controls.shortname.errors?.minlength">Kürzel muss mindestens aus 3 Buchstaben bestehen!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.shortname.changed" mat-mini-fab (click)="_handleUndo('shortname')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <textarea matInput rows="5"
                    class="full-width"
                    placeholder="Zitierform"
                    formControlName="citationForm"
                    (input)="_handleInput('citationForm')"></textarea>
          <mat-error *ngIf="form.controls.citationForm.errors?.required">Zitierform erforderlich!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.citationForm.changed" mat-mini-fab (click)="_handleUndo('citationForm')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Kommentar"
                 formControlName="comment"
                 (input)="_handleInput('comment')">
          <mat-error *ngIf="form.controls.comment.errors?.required">Kommentar erforderlich!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.comment.changed" mat-mini-fab (click)="_handleUndo('comment')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Jahr"
                 formControlName="year"
                 (input)="_handleInput('year')">
          <mat-error *ngIf="form.controls.year.errors?.required">Jahr erforderlich!</mat-error>
          <mat-error *ngIf="form.controls.year.errors?.pattern">Ungültiges Jahr</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.year.changed" mat-mini-fab (click)="_handleUndo('year')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Weblink"
                 formControlName="weblink"
                 (change)="_handleInput('weblink')"
                 (input)="_handleInput('weblink')">
          <mat-error *ngIf="form.controls.weblink.errors?.pattern">Ungültiger HTTP-Link</mat-error>
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.weblink.changed" mat-mini-fab (click)="_handleUndo('weblink')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.weblink.id !== undefined" mat-mini-fab (click)="_handleDelete('weblink')">
          <mat-icon *ngIf="!valIds.weblink.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.weblink.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field *ngIf="inData.library === undefined" [style.width.px]=400>
          <input matInput [matAutocomplete]="auto"
                 class="knora-link-input-element klnkie-val"
                 placeholder="Bibliothek"
                 formControlName="library"
                 aria-label="Value"
                 (change)="_handleInput('library')"
                 (input)="_handleLinkInput('library')">
          <input matInput style="width: 100%" [hidden]="true" formControlName="libraryIri">
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="_optionSelected($event.option.value)">
            <mat-option *ngFor="let option of options" [value]="option.label">
              {{ option.label }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <mat-form-field *ngIf="inData.libraryIri !== undefined" [style.width.px]=400>
          <input matInput
                 placeholder="Bibliothek"
                 formControlName="library"
                 aria-label="Value">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.library.changed" mat-mini-fab (click)="_handleUndo('library')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.library.id !== undefined" mat-mini-fab (click)="_handleDelete('library')">
          <mat-icon *ngIf="!valIds.library.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.library.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Scan fertig"
                 formControlName="scanFinished"
                 (change)="_handleInput('scanFinished')"
                 (input)="_handleInput('scanFinished')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.scanFinished.changed" mat-mini-fab (click)="_handleUndo('scanFinished')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.scanFinished.id !== undefined" mat-mini-fab (click)="_handleDelete('scanFinished')">
          <mat-icon *ngIf="!valIds.scanFinished.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.scanFinished.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Scan bearbeitet von"
                 formControlName="scanVendor"
                 (input)="_handleInput('scanVendor')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.scanVendor.changed" mat-mini-fab (click)="_handleUndo('scanVendor')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.scanVendor.id !== undefined" mat-mini-fab (click)="_handleDelete('scanVendor')">
          <mat-icon *ngIf="!valIds.scanVendor.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.scanVendor.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="OCR fertig"
                 formControlName="ocrFinished"
                 (change)="_handleInput('ocrFinished')"
                 (input)="_handleInput('ocrFinished')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.ocrFinished.changed" mat-mini-fab (click)="_handleUndo('ocrFinished')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.ocrFinished.id !== undefined" mat-mini-fab (click)="_handleDelete('ocrFinished')">
          <mat-icon *ngIf="!valIds.ocrFinished.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.ocrFinished.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="OCR bearbeitet von"
                 formControlName="ocrVendor"
                 (change)="_handleInput('ocrVendor')"
                 (input)="_handleInput('ocrVendor')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.ocrVendor.changed" mat-mini-fab (click)="_handleUndo('ocrVendor')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.ocrVendor.id !== undefined" mat-mini-fab (click)="_handleDelete('ocrVendor')">
          <mat-icon *ngIf="!valIds.ocrVendor.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.ocrVendor.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Einträge fertig"
                 formControlName="editFinished"
                 (change)="_handleInput('editFinished')"
                 (input)="_handleInput('editFinished')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.editFinished.changed" mat-mini-fab (click)="_handleUndo('editFinished')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.editFinished.id !== undefined" mat-mini-fab (click)="_handleDelete('editFinished')">
          <mat-icon *ngIf="!valIds.editFinished.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.editFinished.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Einträge bearbeitet von"
                 formControlName="editVendor"
                 (change)="_handleInput('editVendor')"
                 (input)="_handleInput('editVendor')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.editVendor.changed" mat-mini-fab (click)="_handleUndo('editVendor')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.editVendor.id !== undefined" mat-mini-fab (click)="_handleDelete('editVendor')">
          <mat-icon *ngIf="!valIds.editVendor.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.editVendor.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>
      </mat-card-content>
      <mat-card-actions>
        <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern">Cancel</button>
        <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
        <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
  ]
})

export class EditlexComponent implements ControlValueAccessor, OnInit {
  controlType = 'EditLexicon';
  inData: any;
  form: FormGroup;
  options: Array<{id: string, label: string}> = [];

  data: LexiconData = new LexiconData('', '', '', '', '');

  resId: string;
  lastmod: string;
  working: boolean;
  public valIds: LexiconIds = new LexiconIds();

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              private location: Location,
              private snackBar: MatSnackBar,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.resId = '';
    this.working = false;
  }

  @Input()
  get value(): LexiconData | null {
    const {value: {label, shortname, citationForm, comment, year, weblink, library, libraryIri, scanFinished, scanVendor,
      ocrFinished, ocrVendor, editFinished, editVendor}} = this.form;
    return new LexiconData(label, shortname, citationForm, comment, year, weblink, library, libraryIri, scanFinished, scanVendor,
      ocrFinished, ocrVendor, editFinished, editVendor);
  }
  set value(knoraVal: LexiconData | null) {
    const {label, shortname, citationForm, comment, year, weblink, library, libraryIri, scanFinished, scanVendor,
      ocrFinished, ocrVendor, editFinished, editVendor}
      = knoraVal || new LexiconData('', '', '', '', '');
    this.form.setValue({label, shortname, citationForm, comment, year, weblink, library, libraryIri, scanFinished, scanVendor,
      ocrFinished, ocrVendor, editFinished, editVendor});
  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr  => {
      if (arr[0].iri !== undefined) {
        this.inData.lexiconIri = arr[0].iri;
      }
      if (this.inData.lexiconIri !== undefined) {
        this.knoraService.getResource(this.inData.lexiconIri).subscribe((data) => {
          if (this.inData.lexiconIri !== undefined) {
            this.resId = data.id;
            this.lastmod = data.lastmod;
            this.form.controls.label.setValue(data.label);
            this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
            this.data.label = data.label;
            for (const ele of data.properties) {
              switch (ele.propname) {
                case this.knoraService.mlsOntology + 'hasShortname':
                  this.form.controls.shortname.setValue(ele.values[0]);
                  this.valIds.shortname = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasCitationForm':
                  this.form.controls.citationForm.setValue(ele.values[0]);
                  this.valIds.citationForm = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasLexiconComment':
                  this.form.controls.comment.setValue(ele.values[0]);
                  this.valIds.comment = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasYear':
                  this.form.controls.year.setValue(ele.values[0]);
                  this.valIds.year = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasLexiconWeblink':
                  this.form.controls.weblink.setValue(ele.values[0]);
                  this.valIds.weblink = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasLibraryValue':
                  const tmp = ele as LinkPropertyData;
                  this.form.controls.libraryIri.setValue(tmp.resourceIris[0]);
                  this.form.controls.library.setValue(tmp.values[0]);
                  this.valIds.library = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.libraryIri = tmp.resourceIris[0];
                  break;
                case this.knoraService.mlsOntology + 'hasScanFinished':
                  this.form.controls.scanFinished.setValue(ele.values[0]);
                  this.valIds.scanFinished = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasScanVendor':
                  this.form.controls.scanVendor.setValue(ele.values[0]);
                  this.valIds.scanVendor = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasOCRFinished':
                  this.form.controls.ocrFinished.setValue(ele.values[0]);
                  this.valIds.ocrFinished = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasOCRVendor':
                  this.form.controls.ocrVendor.setValue(ele.values[0]);
                  this.valIds.ocrVendor = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasEditFinished':
                  this.form.controls.editFinished.setValue(ele.values[0]);
                  this.valIds.editFinished = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                case this.knoraService.mlsOntology + 'hasEditVendor':
                  this.form.controls.editVendor.setValue(ele.values[0]);
                  this.valIds.editVendor = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
              }
            }
          }
        });
      }
      const reg1 = '[0-9]{4}';
      const reg2 = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(3)]],
        shortname: [this.data.shortname, [Validators.required, Validators.minLength(5)]],
        citationForm: [this.data.citationForm, [Validators.required]],
        comment: [this.data.comment, [Validators.required]],
        year: [this.data.year, [Validators.required, Validators.pattern(reg1)]],
        weblink: [this.data.weblink, [Validators.pattern(reg2)]],
        library: [this.data.library, []],
        libraryIri: [this.data.libraryIri, []],
        scanFinished: [this.data.scanFinished, []],
        scanVendor: [this.data.scanVendor, []],
        ocrFinished: [this.data.ocrFinished, []],
        ocrVendor: [this.data.ocrVendor, []],
        editFinished: [this.data.editFinished, []],
        editVendor: [this.data.editVendor, []],
      });
    });

    this.form.valueChanges.pipe(
      map(data => console.log(data))
    );

  }

  onChange = (_: any) => {};

  onTouched = () => {};

  _handleLinkInput(what: string): void {
    console.log('_handleLinkInput: ', this.form.value.library);
    this.valIds.library.changed = true;
    this.knoraService.getResourcesByLabel(this.form.value.library, this.knoraService.mlsOntology + 'Library').subscribe(
      res => {
        this.options = res;
        this.form.value.library = res[0].label;
        this.form.value.libraryIri = res[0].id;
        this.onChange(this.form.value);
      }
    );
  }

  _optionSelected(val): void {
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    this.value = new LexiconData(
      this.form.value.label,
      this.form.value.shortname,
      this.form.value.citationForm,
      this.form.value.comment,
      this.form.value.year,
      this.form.value.weblink,
      res[0].label, // library
      res[0].id,    // libraryIri
      this.form.value.scanFinished,
      this.form.value.scanVendor,
      this.form.value.ocrFinished,
      this.form.value.ocrVendor,
      this.form.value.editFinished,
      this.form.value.editVendor,
    );
  }


  _handleInput(what: string): void {
    this.onChange(this.form.value);
    switch (what) {
      case 'label':
        this.valIds.label.changed = true;
        break;
      case 'shortname':
        this.valIds.shortname.changed = true;
        break;
      case 'citationForm':
        this.valIds.citationForm.changed = true;
        break;
      case 'comment':
        this.valIds.comment.changed = true;
        break;
      case 'year':
        this.valIds.year.changed = true;
        break;
      case 'weblink':
        this.valIds.weblink.changed = true;
        break;
      case 'library':
        this.valIds.library.changed = true;
        break;
      case 'scanFinished':
        this.valIds.scanFinished.changed = true;
        break;
      case 'scanVendor':
        this.valIds.scanVendor.changed = true;
        break;
      case 'ocrFinished':
        this.valIds.ocrFinished.changed = true;
        break;
      case 'ocrVendor':
        this.valIds.ocrVendor.changed = true;
        break;
      case 'editFinished':
        this.valIds.editFinished.changed = true;
        break;
      case 'editVendor':
        this.valIds.editVendor.changed = true;
        break;
    }
  }

  _handleDelete(what: string): void {
    switch (what) {
      case 'weblink':
        this.valIds.weblink.toBeDeleted = !this.valIds.weblink.toBeDeleted;
        break;
      case 'library':
        this.valIds.library.toBeDeleted = !this.valIds.library.toBeDeleted;
        break;
      case 'scanFinished':
        this.valIds.scanFinished.toBeDeleted = !this.valIds.scanFinished.toBeDeleted;
        break;
      case 'scanVendor':
        this.valIds.scanVendor.toBeDeleted = !this.valIds.scanVendor.toBeDeleted;
        break;
      case 'ocrFinished':
        this.valIds.ocrFinished.toBeDeleted = !this.valIds.ocrFinished.toBeDeleted;
        break;
      case 'ocrVendor':
        this.valIds.ocrVendor.toBeDeleted = !this.valIds.ocrVendor.toBeDeleted;
        break;
      case 'editFinished':
        this.valIds.editFinished.toBeDeleted = !this.valIds.editFinished.toBeDeleted;
        break;
      case 'editVendor':
        this.valIds.editVendor.toBeDeleted = !this.valIds.editVendor.toBeDeleted;
        break;
    }
  }

  _handleUndo(what: string) {
    switch (what) {
      case 'label':
        this.form.controls.label.setValue(this.data.label);
        this.valIds.label.changed = false;
        break;
      case 'shortname':
        this.form.controls.shortname.setValue(this.data.shortname);
        this.valIds.shortname.changed = false;
        break;
      case 'citationForm':
        this.form.controls.citationForm.setValue(this.data.citationForm);
        this.valIds.citationForm.changed = false;
        break;
      case 'comment':
        this.form.controls.comment.setValue(this.data.comment);
        this.valIds.comment.changed = false;
        break;
      case 'year':
        this.form.controls.year.setValue(this.data.year);
        this.valIds.year.changed = false;
        break;
      case 'weblink':
        this.form.controls.weblink.setValue(this.data.weblink);
        this.valIds.weblink.changed = false;
        break;
      case 'library':
        this.form.controls.library.setValue(this.data.library);
        this.form.controls.libraryIri.setValue(this.data.libraryIri);
        this.valIds.library.changed = false;
        break;
      case 'scanFinished':
        this.form.controls.scanFinished.setValue(this.data.scanFinished);
        this.valIds.scanFinished.changed = false;
        break;
      case 'scanVendor':
        this.form.controls.scanVendor.setValue(this.data.scanVendor);
        this.valIds.scanVendor.changed = false;
        break;
      case 'ocrFinished':
        this.form.controls.ocrFinished.setValue(this.data.ocrFinished);
        this.valIds.ocrFinished.changed = false;
        break;
      case 'ocrVendor':
        this.form.controls.ocrVendor.setValue(this.data.ocrVendor);
        this.valIds.ocrVendor.changed = false;
        break;
      case 'editFinished':
        this.form.controls.editFinished.setValue(this.data.editFinished);
        this.valIds.editFinished.changed = false;
        break;
      case 'editVendor':
        this.form.controls.editVendor.setValue(this.data.editVendor);
        this.valIds.editVendor.changed = false;
        break;
    }
  }

  writeValue(knoraVal: LexiconData | null): void {
    this.value = knoraVal;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  save() {
    this.working = true;
    if (this.inData.lexiconIri === undefined) {
      //
      // we create a new lexicon
      //
      this.knoraService.createLexicon(this.form.value).subscribe(
        res => {
          console.log('CREATE_RESULT:', res);
          this.working = false;
          this.location.back();
        },
        error => {
          this.snackBar.open('Fehler beim Speichern der Daten des Lexikon-Eintrags!', 'OK');
          console.log('EditLexComponent.save(): ERROR', error);
          this.working = false;
          this.location.back();
        }
      );
    } else {
      //
      // we edit an existing lexicon, update/create only changed fields
      //
      const obs: Array<Observable<string>> = [];

      if (this.valIds.label.changed) {
        const gaga: Observable<string> = this.knoraService.updateLabel(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.form.value.label);
        obs.push(gaga);
      }

      if (this.valIds.shortname.toBeDeleted && this.valIds.shortname.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.shortname.id as string,
          this.knoraService.mlsOntology + 'hasShortname');
        obs.push(gaga);
      } else if (this.valIds.shortname.changed) {
        let gaga: Observable<string>;
        if (this.valIds.shortname.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasShortname',
            this.form.value.shortname);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.shortname.id as string,
            this.knoraService.mlsOntology + 'hasShortname',
            this.form.value.shortname);
        }
        obs.push(gaga);
      }

      if (this.valIds.citationForm.toBeDeleted && this.valIds.citationForm.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.citationForm.id as string,
          this.knoraService.mlsOntology + 'hasCitationForm');
        obs.push(gaga);
      } else if (this.valIds.citationForm.changed) {
        let gaga: Observable<string>;
        if (this.valIds.citationForm.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasCitationForm',
            this.form.value.citationForm);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.citationForm.id as string,
            this.knoraService.mlsOntology + 'hasCitationForm',
            this.form.value.citationForm);
        }
        obs.push(gaga);
      }

      if (this.valIds.comment.toBeDeleted && this.valIds.comment.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.comment.id as string,
          this.knoraService.mlsOntology + 'hasLexiconComment');
        obs.push(gaga);
      } else if (this.valIds.comment.changed) {
        let gaga: Observable<string>;
        if (this.valIds.comment.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasLexiconComment',
            this.form.value.comment);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.comment.id as string,
            this.knoraService.mlsOntology + 'hasLexiconComment',
            this.form.value.comment);
        }
        obs.push(gaga);
      }

      if (this.valIds.year.toBeDeleted && this.valIds.year.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.year.id as string,
          this.knoraService.mlsOntology + 'hasYear');
        obs.push(gaga);
      } else if (this.valIds.year.changed) {
        let gaga: Observable<string>;
        if (this.valIds.year.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasYear',
            this.form.value.year);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.year.id as string,
            this.knoraService.mlsOntology + 'hasYear',
            this.form.value.year);
        }
        obs.push(gaga);
      }

      if (this.valIds.weblink.toBeDeleted && this.valIds.weblink.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteUriValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.weblink.id as string,
          this.knoraService.mlsOntology + 'hasLexiconWeblink');
        obs.push(gaga);
      } else if (this.valIds.weblink.changed) {
        let gaga: Observable<string>;
        if (this.valIds.weblink.id === undefined) {
          gaga = this.knoraService.createUriValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasLexiconWeblink',
            this.form.value.weblink);
        } else {
          gaga = this.knoraService.updateUriValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.weblink.id as string,
            this.knoraService.mlsOntology + 'hasLexiconWeblink',
            this.form.value.weblink);
        }
        obs.push(gaga);
      }

      if (this.valIds.library.toBeDeleted && this.valIds.library.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteLinkValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.library.id as string,
          this.knoraService.mlsOntology + 'hasLibraryValue');
        obs.push(gaga);
      } else if (this.valIds.library.changed) {
        let gaga: Observable<string>;
        if (this.valIds.library.id === undefined) {
          gaga = this.knoraService.createLinkValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasLibraryValue',
            this.form.value.libraryIri);
        } else {
          gaga = this.knoraService.updateLinkValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.library.id as string,
            this.knoraService.mlsOntology + 'hasLibraryValue',
            this.form.value.libraryIri);
        }
        obs.push(gaga);
      }

      if (this.valIds.scanFinished.toBeDeleted && this.valIds.scanFinished.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.scanFinished.id as string,
          this.knoraService.mlsOntology + 'hasScanFinished');
        obs.push(gaga);
      } else if (this.valIds.scanFinished.changed) {
        let gaga: Observable<string>;
        if (this.valIds.scanFinished.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasScanFinished',
            this.form.value.scanFinished);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.scanFinished.id as string,
            this.knoraService.mlsOntology + 'hasScanFinished',
            this.form.value.scanFinished);
        }
        obs.push(gaga);
      }

      if (this.valIds.scanVendor.toBeDeleted && this.valIds.scanVendor.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.scanVendor.id as string,
          this.knoraService.mlsOntology + 'hasScanVendor');
        obs.push(gaga);
      } else if (this.valIds.scanVendor.changed) {
        let gaga: Observable<string>;
        if (this.valIds.scanVendor.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasScanVendor',
            this.form.value.scanVendor);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.scanVendor.id as string,
            this.knoraService.mlsOntology + 'hasScanVendor',
            this.form.value.scanVendor);
        }
        obs.push(gaga);
      }

      if (this.valIds.ocrFinished.toBeDeleted && this.valIds.ocrFinished.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.ocrFinished.id as string,
          this.knoraService.mlsOntology + 'hasOCRFinished');
        obs.push(gaga);
      } else if (this.valIds.ocrFinished.changed) {
        let gaga: Observable<string>;
        if (this.valIds.ocrFinished.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasOCRFinished',
            this.form.value.ocrFinished);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.ocrFinished.id as string,
            this.knoraService.mlsOntology + 'hasOCRFinished',
            this.form.value.ocrFinished);
        }
        obs.push(gaga);
      }

      if (this.valIds.ocrVendor.toBeDeleted && this.valIds.ocrVendor.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.ocrVendor.id as string,
          this.knoraService.mlsOntology + 'hasOCRVendor');
        obs.push(gaga);
      } else if (this.valIds.ocrVendor.changed) {
        let gaga: Observable<string>;
        if (this.valIds.ocrVendor.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasOCRVendor',
            this.form.value.ocrVendor);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.ocrVendor.id as string,
            this.knoraService.mlsOntology + 'hasOCRVendor',
            this.form.value.ocrVendor);
        }
        obs.push(gaga);
      }

      if (this.valIds.editFinished.toBeDeleted && this.valIds.editFinished.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.editFinished.id as string,
          this.knoraService.mlsOntology + 'hasEditFinished');
        obs.push(gaga);
      } else if (this.valIds.editFinished.changed) {
        let gaga: Observable<string>;
        if (this.valIds.editFinished.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasEditFinished',
            this.form.value.editFinished);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.editFinished.id as string,
            this.knoraService.mlsOntology + 'hasEditFinished',
            this.form.value.editFinished);
        }
        obs.push(gaga);
      }

      if (this.valIds.editVendor.toBeDeleted && this.valIds.editVendor.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lexicon',
          this.valIds.editVendor.id as string,
          this.knoraService.mlsOntology + 'hasEditVendor');
        obs.push(gaga);
      } else if (this.valIds.editVendor.changed) {
        let gaga: Observable<string>;
        if (this.valIds.editVendor.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.knoraService.mlsOntology + 'hasEditVendor',
            this.form.value.editVendor);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lexicon',
            this.valIds.editVendor.id as string,
            this.knoraService.mlsOntology + 'hasEditVendor',
            this.form.value.editVendor);
        }
        obs.push(gaga);
      }
      forkJoin(obs).subscribe(res => {
          this.working = false;
          this.location.back();
        },
        error => {
          this.snackBar.open('Fehler beim Speichern der Daten des Lexikon-Eintrags!', 'OK');
          this.working = false;
          this.location.back();
        });
    }
  }

}
