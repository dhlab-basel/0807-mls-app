import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ArticleData, KnoraService, News} from '../../services/knora.service';
import {AppComponent} from '../../app.component';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {combineLatest} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class NewsIds {
  public label: ValInfo;
  public title: ValInfo;
  public imageid: ValInfo;
  public text: ValInfo;
  public activeDate: ValInfo;
  public lemma: ValInfo;
  public weblink: ValInfo;

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.title = {id: undefined, changed: false, toBeDeleted: false};
    this.imageid = {id: undefined, changed: false, toBeDeleted: false};
    this.text = {id: undefined, changed: false, toBeDeleted: false};
    this.activeDate = {id: undefined, changed: false, toBeDeleted: false};
    this.lemma = {id: undefined, changed: false, toBeDeleted: false};
    this.weblink = {id: undefined, changed: false, toBeDeleted: false};
  }
}

@Component({
  selector: 'app-editnews',
  template: `
     <mat-card class="maxw" xmlns="http://www.w3.org/1999/html">
      <mat-card-title>
        News-Editor
      </mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Label"
                 formControlName="label"
                 (input)="_handleInput('label')">
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('label')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput required class="full-width"
                 placeholder="Titel"
                 formControlName="title"
                 (input)="_handleInput('title')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.title.changed" mat-mini-fab (click)="_handleUndo('title')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <br/>

        <mat-form-field [style.width.px]=400>
          <div>
            <img #image src="{{ temporaryUrl || '/assets/dummy-256x256.jpg'}}">
            <br/>
            <input type="file" class="file-input" #fileUpload (change)="onFileSelected($event)">
            {{filename || "No file uploaded yet."}} &nbsp;
            <button type="submit" class="mat-raised-button"  (click)="fileUpload.click()">Upload</button>
          </div>
          &nbsp;
          <input matInput disabled
                 placeholder="Image-ID"
                 formControlName="imageid">
        </mat-form-field>
        <button *ngIf="valIds.imageid.changed" mat-mini-fab (click)="_handleUndo('imageid')">
          <mat-icon color="warn">cached</mat-icon>
        </button>

        <br/>
        <mat-divider></mat-divider>

        <mat-label>News-text</mat-label><br/>
        <ckeditor matInput #editor [editor]="Editor" formControlName="text" (change)="_handleInput('text')"></ckeditor>
        <button *ngIf="valIds.text.changed" mat-mini-fab (click)="_handleUndo('text')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>
        <mat-divider></mat-divider>
        <br/>

        <mat-form-field appearance="fill" [style.width.px]=400>
          <mat-label>Enter a date range</mat-label>
          <mat-date-range-input [rangePicker]="picker" (change)="_handleInput('activeDate')">
            <input matStartDate class="full-width" placeholder="Start date"
                   formControlName="activeDateStart"
                   (dateChange)="_handleInput('activeDate')">
            <input matEndDate class="full-width" placeholder="End date"
                   formControlName="activeDateEnd"
                   (dateChange)="_handleInput('activeDate')">
          </mat-date-range-input>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.activeDate.changed" mat-mini-fab (click)="_handleUndo('activeDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        &nbsp;
        <button *ngIf="valIds.activeDate.id !== undefined" mat-mini-fab (click)="_handleDelete('activeDate')">
          <mat-icon *ngIf="!valIds.activeDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.activeDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput [matAutocomplete]="auto"
                 class="knora-link-input-element klnkie-val"
                 placeholder="Lemma"
                 formControlName="lemma"
                 aria-label="Value"
                 (input)="_handleLinkInput('lemma')">
          <input matInput style="width: 100%" [hidden]="true" formControlName="lemmaIri">
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="_optionSelected($event.option.value)">
            <mat-option *ngFor="let option of options" [value]="option.label">
              {{ option.label }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <mat-form-field *ngIf="inData.lemmaIri !== undefined" [style.width.px]=400>
          <input matInput
                 placeholder="Lemma"
                 formControlName="lemma"
                 aria-label="Value">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.lemma.changed" mat-mini-fab (click)="_handleUndo('lemma')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Weblink"
                 formControlName="weblink"
                 (input)="_handleInput('weblink')">
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

        <mat-card-actions>
          <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern">Cancel</button>
          <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
        </mat-card-actions>

      </mat-card-content>
    </mat-card>

  `,
  styles: [
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }',
    '.file-input { display: none; }'
  ]
})

export class EditnewsComponent implements OnInit {
  controlType = 'editnews';
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('image') image: ElementRef;
  inData: any;
  form: FormGroup;
  filename?: string;
  temporaryUrl?: string;
  public Editor = ClassicEditor;
  public valIds: NewsIds = new NewsIds();
  data: News = new News('', '', '', '', '', '');
  options: Array<{id: string, label: string}> = [];


  constructor(public knoraService: KnoraService,
              private http: HttpClient,
              private fb: FormBuilder,
              public route: ActivatedRoute) {
    this.inData = {};
  }

  @Input()
  get value(): News | null {
    const {value: {label, title, imageid, text, activeDateStart, activeDateEnd, lemma, lemmaIri, weblink}} = this.form;
    return new News(label, title, imageid, text, activeDateStart, activeDateEnd, lemma, lemmaIri, weblink);
  }
  set value(knoraVal: News | null) {
    const {label, title, imageid, text, activeDateStart, activeDateEnd, lemma, lemmaIri, weblink}
      = knoraVal || new News('', '', '', '', '', '');
    this.form.setValue({label, title, imageid, text, activeDateStart, activeDateEnd, lemma, lemmaIri, weblink});
  }

  ngOnInit(): void {
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.newsItemIri = arr[0].iri;
      }
      if (this.inData.articleIri !== undefined) {
      }
      this.form = this.fb.group({
        label: [this.data.label, []],
        title: [this.data.title, []],
        imageid: [this.data.imageid, []],
        text: [this.data.text, []],
        activeDateStart: [this.data.activeDateStart, []],
        activeDateEnd: [this.data.activeDateEnd, []],
        lemma: [this.data.lemma, []],
        lemmaIri: [this.data.lemmaIri, []],
        weblink: [this.data.weblink, []],
      });

    });
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.filename = file.name;
      const formData = new FormData();
      formData.append('file', file);
      this.http.post('https://iiif.test.dasch.swiss/upload?token=' + encodeURIComponent(this.knoraService.token || ''),
        formData).subscribe((x: any) => {
          this.temporaryUrl = x.uploadedFiles[0].temporaryUrl + '/full/^!256,256/0/default.jpg';
          this.form.value.imageid = x.uploadedFiles[0].internalFilename;
          this.form.controls.imageid.setValue(x.uploadedFiles[0].internalFilename);
          this.valIds.imageid.changed = true;
        });
    }
  }

  onChange = (_: any) => {
  }

  onTouched = () => {
  }

  _handleLinkInput(what: string): void {
    console.log('this.form.value.lemma=', this.form.value.lemma);
    this.knoraService.getResourcesByLabel(this.form.value.lemma, this.knoraService.mlsOntology + 'Lemma').subscribe(
      res => {
        console.log('RES=', res);
        this.options = res;
        this.form.value.lemma = res[0].label;
        this.form.value.lemmaIri = res[0].id;
        this.onChange(this.form.value);
        this.valIds.lemma.changed = true;
      }
    );
  }

  _optionSelected(val): void {
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    this.value = new News(
      this.form.value.label,
      this.form.value.title,
      this.form.value.imageid,
      this.form.value.text,
      this.form.value.activeDateStart,
      this.form.value.activeDateEnd,
      res[0].label, // lemma
      res[0].id,    // lemmaIri
      this.form.value.weblink,
    );
  }

  _handleInput(what: string): void {
    this.onChange(this.form.value);
    switch (what) {
      case 'label':
        this.valIds.label.changed = true;
        break;
      case 'title':
        this.valIds.title.changed = true;
        break;
      case 'imageid':
        this.valIds.imageid.changed = true;
        break;
      case 'text':
        this.valIds.text.changed = true;
        break;
      case 'activeDate':
        this.valIds.activeDate.changed = true;
        break;
      case 'lemma':
        this.valIds.lemma.changed = true;
        break;
      case 'weblink':
        this.valIds.weblink.changed = true;
        break;
    }
  }

  _handleDelete(what: string): void {
    switch (what) {
      case 'lemma':
        if (this.valIds.lemma.id !== undefined) {
          this.valIds.lemma.toBeDeleted = !this.valIds.lemma.toBeDeleted;
        }
        break;
      case 'weblink':
        if (this.valIds.weblink.id !== undefined) {
          this.valIds.weblink.toBeDeleted = !this.valIds.weblink.toBeDeleted;
        }
        break;
    }
  }

  _handleUndo(what: string) {
    switch (what) {
      case 'label':
        this.form.controls.label.setValue(this.data.label);
        this.valIds.label.changed = false;
        break;
      case 'title':
        this.form.controls.title.setValue(this.data.title);
        this.valIds.title.changed = false;
        break;
      case 'imageid': // ToDo: proper processing!!!!!!!!!
        this.form.controls.imageid.setValue(this.data.imageid);
        this.data.imageid = this.data.imageid;
        this.valIds.imageid.changed = false;
        this.fileUpload.nativeElement.value = null;
        this.filename = undefined;
        this.temporaryUrl = '/assets/dummy-256x256.jpg';
        break;
      case 'text':
        this.form.controls.text.setValue(this.data.text);
        this.valIds.text.changed = false;
        break;
      case 'activeDate':
        this.form.controls.activeDateStart.setValue(this.data.activeDateStart);
        this.form.controls.activeDateEnd.setValue(this.data.activeDateEnd);
        this.valIds.activeDate.changed = false;
        break;
      case 'lemma':
        this.form.controls.lemma.setValue(this.data.lemma);
        this.form.controls.lemmairi.setValue(this.data.lemmaIri);
        this.valIds.lemma.changed = false;
        break;
      case 'weblink':
        this.form.controls.weblink.setValue(this.data.weblink);
        this.valIds.weblink.changed = false;
        break;
    }
  }

  save() {
    console.log(this.form.value);
  }

}
