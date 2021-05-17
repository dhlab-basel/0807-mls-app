import {Component, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewChild} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {KnoraService, ArticleData, ResourceData, IntPropertyData} from '../../services/knora.service';
import {CKEditorComponent} from '@ckeditor/ckeditor5-angular';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EditResourceComponent} from '../knora/edit-resource/edit-resource.component';
import {ActivatedRoute} from '@angular/router';
import {LemmataComponent} from '../lemmata/lemmata.component';
import {LemmaselectComponent} from '../lemmaselect/lemmaselect.component';
import {concatMap, map} from 'rxjs/operators';
import {Constants, DeleteValue, ReadResourceSequence, UpdateResource, UpdateResourceMetadata} from '@dasch-swiss/dsp-js';
import {forkJoin, from, Observable, Subject} from 'rxjs';
import {KnoraLinkVal} from '../knora/knora-link-input/knora-link-input.component';
import {MatIconModule} from '@angular/material/icon';

interface Lexica {
  iri: string;
  name: string;
}

interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}


class ArticleIds {
  public label: ValInfo;
  public lemma: ValInfo;
  public lexicon: ValInfo;
  public article: ValInfo;
  public pages: ValInfo;
  public fonoteca: ValInfo;
  public hls: ValInfo;
  public oem: ValInfo;
  public theatre: ValInfo;
  public ticino: ValInfo;
  public web: ValInfo;

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.lemma = {id: undefined, changed: false, toBeDeleted: false};
    this.lexicon = {id: undefined, changed: false, toBeDeleted: false};
    this.article = {id: undefined, changed: false, toBeDeleted: false};
    this.pages = {id: undefined, changed: false, toBeDeleted: false};
    this.fonoteca = {id: undefined, changed: false, toBeDeleted: false};
    this.hls = {id: undefined, changed: false, toBeDeleted: false};
    this.oem = {id: undefined, changed: false, toBeDeleted: false};
    this.theatre = {id: undefined, changed: false, toBeDeleted: false};
    this.ticino = {id: undefined, changed: false, toBeDeleted: false};
    this.web = {id: undefined, changed: false, toBeDeleted: false};

  }

}

@Component({
  selector: 'app-editart',
  template: `
    <mat-dialog-content>
     <mat-card class="maxw" xmlns="http://www.w3.org/1999/html">
      <mat-card-title>
        Artikel-Editor
      </mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Label"
                 formControlName="label"
                 (input)="_handleInput('label')">
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('label')"><mat-icon color="warn">cached</mat-icon></button>
        <br/>

        <mat-form-field *ngIf="inData.lemmaIri === undefined" [style.width.px]=400>
          <input matInput [matAutocomplete]="auto"
                 required
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
                 required
                 placeholder="Lemma"
                 formControlName="lemma"
                 aria-label="Value">
        </mat-form-field>
        <br/>

        <mat-form-field *ngIf="inData.articleIri === undefined" [style.width.px]=400>
          <mat-select matInput required
                      placeholder="Select lexicon"
                      formControlName="lexiconIri"
                      (selectionChange)="_handleInput('lexicon')">
            <mat-option *ngFor="let lex of lexica" [value]="lex.iri">
              {{lex.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field *ngIf="inData.articleIri !== undefined" [style.width.px]=400>
          <input matInput
                 placeholder="Lexicon"
                 formControlName="lexiconIri"
                 aria-label="Value">
        </mat-form-field>
        <button *ngIf="valIds.lexicon.changed" mat-mini-fab (click)="_handleUndo('lexicon')"><mat-icon color="warn">cached</mat-icon></button>
        <br/>

        <ckeditor matInput #editor [editor]="Editor" formControlName="article" (change)="_handleInput('article')"></ckeditor>
        <br/>
        <button *ngIf="valIds.article.changed" mat-mini-fab (click)="_handleUndo('article')"><mat-icon color="warn">cached</mat-icon></button>
        <button *ngIf="valIds.article.id !== undefined" mat-mini-fab (click)="_handleDelete('article')">
          <mat-icon *ngIf="!valIds.article.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.article.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>
        <mat-divider></mat-divider>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Pages(s)"
                 formControlName="pages"
                 (change)="_handleInput('pages')"
                 (input)="_handleInput('pages')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.pages.changed" mat-mini-fab (click)="_handleUndo('pages')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.pages.id !== undefined" mat-mini-fab (click)="_handleDelete('pages')">
          <mat-icon *ngIf="!valIds.pages.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.pages.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Fonoteca code"
                 formControlName="fonoteca"
                 (input)="_handleInput('fonoteca')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.fonoteca.changed" mat-mini-fab (click)="_handleUndo('fonoteca')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.fonoteca.id !== undefined" mat-mini-fab (click)="_handleDelete('fonoteca')">
          <mat-icon *ngIf="!valIds.fonoteca.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.fonoteca.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="HLS code"
                 formControlName="hls"
                 (input)="_handleInput('hls')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.hls.changed" mat-mini-fab (click)="_handleUndo('hls')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.hls.id !== undefined" mat-mini-fab (click)="_handleDelete('hls')">
          <mat-icon *ngIf="!valIds.hls.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.hls.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="OEM code"
                 formControlName="oem"
                 (input)="_handleInput('oem')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.oem.changed" mat-mini-fab (click)="_handleUndo('oem')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.oem.id !== undefined" mat-mini-fab (click)="_handleDelete('oem')">
          <mat-icon *ngIf="!valIds.oem.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.oem.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Theatrelexicon code"
                 formControlName="theatre"
                 (input)="_handleInput('theatre')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.theatre.changed" mat-mini-fab (click)="_handleUndo('theatre')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.theatre.id !== undefined" mat-mini-fab (click)="_handleDelete('theatre')">
          <mat-icon *ngIf="!valIds.theatre.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.theatre.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="Ticinolexcon code"
                 formControlName="ticino"
                 (input)="_handleInput('ticino')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.ticino.changed" mat-mini-fab (click)="_handleUndo('ticino')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.ticino.id !== undefined" mat-mini-fab (click)="_handleDelete('ticino')">
          <mat-icon *ngIf="!valIds.ticino.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.ticino.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput class="full-width"
                 placeholder="WEB code"
                 formControlName="web"
                 (input)="_handleInput('web')">
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.web.changed" mat-mini-fab (click)="_handleUndo('web')"><mat-icon color="warn">cached</mat-icon></button>
        &nbsp;
        <button *ngIf="valIds.web.id !== undefined" mat-mini-fab (click)="_handleDelete('web')">
          <mat-icon *ngIf="!valIds.web.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.web.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-dialog-actions>
          <button class="mat-raised-button" (click)="cancel()">Cancel</button>
          <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
        </mat-dialog-actions>
      </mat-card-content>
    </mat-card>
    </mat-dialog-content>

  `,
  styles: [
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
  ]
})

export class EditartComponent implements ControlValueAccessor, OnInit {
  controlType = 'editart';
  inData: any;

  public Editor = ClassicEditor;
  form: FormGroup;
  options: Array<{id: string, label: string}> = [];
  public lexica: Lexica[] = [];

  data: ArticleData = new ArticleData('', '', '', '', '');

  resId: string;
  lastmod: string;
  public valIds: ArticleIds = new ArticleIds();

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              private dialogRef: MatDialogRef<EditartComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = data;
    this.resId = '';
  }

  @Input()
  get value(): ArticleData | null {
    const {value: {label, lemma, lemmaIri, lexiconIri, article, pages, fonoteca, hls, oem, theatre, ticino, web}} = this.form;
    return new ArticleData(label, lemma, lemmaIri, lexiconIri, article, pages, fonoteca, hls, oem, theatre, ticino, web);
  }
  set value(knoraVal: ArticleData | null) {
    const {label, lemma, lemmaIri, lexiconIri, article, pages, fonoteca, hls, oem, theatre, ticino, web}
      = knoraVal || new ArticleData('', '', '', '', '');
    this.form.setValue({label, lemma, lemmaIri, lexiconIri, article, pages, fonoteca, hls, oem, theatre, ticino, web});
  }

  ngOnInit(): void {
    if (this.inData.lemmaIri !== undefined) {
      this.data.lemma = this.inData.lemmaLabel;
      this.data.lemmaIri = this.inData.lemmaIri;
    }

    if (this.inData.articleIri !== undefined) {
      this.knoraService.getResource(this.inData.articleIri).subscribe((data) => {
        this.resId = data.id;
        this.lastmod = data.lastmod;
        this.form.controls.label.setValue(data.label);
        this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
        this.data.label = data.label;
        for (const ele of data.properties) {
          switch (ele.propname) {
            case this.knoraService.mlsOntology + 'hasALinkToLemmaValue': {
              this.form.controls.lemma.setValue(ele.values[0]);
              this.form.controls.lemma.disable();
              this.valIds.lemma = {id: ele.ids[0], changed: false, toBeDeleted: false};
              break;
            }
            case this.knoraService.mlsOntology + 'hasALinkToLexiconValue': {
              this.form.controls.lexiconIri.setValue(ele.values[0]);
              this.form.controls.lexiconIri.disable();
              this.valIds.lexicon = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.lexiconIri = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasArticleText': {
              this.form.controls.article.setValue(ele.values[0]);
              this.valIds.article = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.article = ele.values[0];
              break;
            }

            case this.knoraService.mlsOntology + 'hasPages': {
              this.form.controls.pages.setValue(ele.values[0]);
              this.valIds.pages = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.pages = ele.values[0];
              break;
            }

            case this.knoraService.mlsOntology + 'hasFonotecacode': {
              this.form.controls.fonoteca.setValue(ele.values[0]);
              this.valIds.fonoteca = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.fonoteca = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasHlsCcode': {
              this.form.controls.hls.setValue(ele.values[0]);
              this.valIds.hls = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.hls = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasOemlCode': {
              this.form.controls.oem.setValue(ele.values[0]);
              this.valIds.oem = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.oem = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasTheaterLexCode': {
              this.form.controls.theatre.setValue(ele.values[0]);
              this.valIds.theatre = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.theatre = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasTicinoLexCode': {
              this.form.controls.ticino.setValue(ele.values[0]);
              this.valIds.ticino = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.ticino = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasWebLink': {
              this.form.controls.web.setValue(ele.values[0]);
              this.valIds.web = {id: ele.ids[0], changed: false, toBeDeleted: false};
              this.data.web = ele.values[0];
              break;
            }
          }
        }
      });
    }

    this.form = this.fb.group({
      label: [this.data.label, []],
      lemma: [this.data.lemma, []],
      lemmaIri: [this.data.lemmaIri, []],
      lexiconIri: [this.data.lexiconIri, []],
      article: [this.data.article, []],
      pages: [this.data.pages, []],
      fonoteca: [this.data.fonoteca, []],
      hls: [this.data.hls, []],
      oem: [this.data.oem, []],
      theatre: [this.data.theatre, []],
      ticino: [this.data.ticino, []],
      web: [this.data.web, []],
    });

    if (this.inData.lemmaIri !== undefined) {
      this.form.controls.lemma.disable();
    }

    this.form.valueChanges.pipe(
      map(data => console.log(data))
    );
    this.getLexica();
  }

  onChange = (_: any) => {};

  onTouched = () => {};

  _handleLinkInput(what: string): void {
    this.knoraService.getResourcesByLabel(this.form.value.lemma, this.knoraService.mlsOntology + 'Lemma').subscribe(
      res => {
        this.options = res;
        this.form.value.lemma = res[0].label;
        this.form.value.lemmaIri = res[0].id;
        this.onChange(this.form.value);
      }
    );
  }

  _optionSelected(val): void {
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    this.value = new ArticleData(
      this.form.value.label,
      res[0].label, // lemma
      res[0].id,    // lemmaIri
      this.form.value.lexiconIri,
      this.form.value.article,
      this.form.value.pages,
      this.form.value.fonoteca,
      this.form.value.hls,
      this.form.value.oem,
      this.form.value.theatre,
      this.form.value.ticino,
      this.form.value.web
    );
  }

  _handleInput(what: string): void {
    this.onChange(this.form.value);
    switch (what) {
      case 'label':
        this.valIds.label.changed = true;
        break;
      case 'lemma':
        this.valIds.lemma.changed = true;
        break;
      case 'lexicon':
        this.valIds.lexicon.changed = true;
        break;
      case 'article':
        this.valIds.article.changed = true;
        break;
      case 'pages':
        this.valIds.pages.changed = true;
        break;
      case 'fonoteca':
        this.valIds.fonoteca.changed = true;
        break;
      case 'hls':
        this.valIds.hls.changed = true;
        break;
      case 'oem':
        this.valIds.oem.changed = true;
        break;
      case 'theatre':
        this.valIds.theatre.changed = true;
        break;
      case 'ticino':
        this.valIds.ticino.changed = true;
        break;
      case 'web':
        this.valIds.web.changed = true;
        break;
    }
  }

  _handleDelete(what: string): void {
    switch (what) {
      case 'pages': {
        if (this.valIds.pages.id !== undefined) {
          this.valIds.pages.toBeDeleted = !this.valIds.pages.toBeDeleted;
          this.valIds = this.valIds;
        }
        break;
      }
      case 'fonoteca': {
        if (this.valIds.fonoteca.id !== undefined) {
          this.valIds.fonoteca.toBeDeleted = !this.valIds.fonoteca.toBeDeleted;
        }
        break;
      }
      case 'hls': {
        if (this.valIds.hls.id !== undefined) {
          this.valIds.hls.toBeDeleted = !this.valIds.hls.toBeDeleted;
        }
        break;
      }
      case 'oem': {
        if (this.valIds.oem.id !== undefined) {
          this.valIds.oem.toBeDeleted = !this.valIds.oem.toBeDeleted;
        }
        break;
      }
      case 'theatre': {
        if (this.valIds.theatre.id !== undefined) {
          this.valIds.theatre.toBeDeleted = !this.valIds.theatre.toBeDeleted;
        }
        break;
      }
      case 'ticino': {
        if (this.valIds.ticino.id !== undefined) {
          this.valIds.ticino.toBeDeleted = !this.valIds.ticino.toBeDeleted;
        }
        break;
      }
      case 'web': {
        if (this.valIds.web.id !== undefined) {
          this.valIds.web.toBeDeleted = !this.valIds.web.toBeDeleted;
        }
        break;
      }
    }
  }

  _handleUndo(what: string) {
    switch (what) {
      case 'label': {
        this.form.controls.label.setValue(this.data.label);
        this.valIds.label.changed = false;
        break;
      }
      case 'article': {
        this.form.controls.article.setValue(this.data.article);
        this.valIds.article.changed = false;
        break;
      }
      case 'lexicon': {
        this.form.controls.lexiconIri.setValue(this.data.lexiconIri);
        this.valIds.lexicon.changed = false;
        break;
      }
      case 'pages': {
        this.form.controls.pages.setValue(this.data.pages);
        this.valIds.pages.changed = false;
        break;
      }
      case 'fonoteca': {
        this.form.controls.fonoteca.setValue(this.data.fonoteca);
        this.valIds.fonoteca.changed = false;
        break;
      }
      case 'hls': {
        this.form.controls.hls.setValue(this.data.hls);
        this.valIds.hls.changed = false;
        break;
      }
      case 'oem': {
        this.form.controls.oem.setValue(this.data.oem);
        this.valIds.oem.changed = false;
        break;
      }
      case 'theatre': {
        this.form.controls.theatre.setValue(this.data.theatre);
        this.valIds.theatre.changed = false;
        break;
      }
      case 'ticino': {
        this.form.controls.ticino.setValue(this.data.ticino);
        this.valIds.ticino.changed = false;
        break;
      }
      case 'web': {
        this.form.controls.web.setValue(this.data.web);
        this.valIds.web.changed = false;
        break;
      }
    }
  }


  writeValue(knoraVal: ArticleData | null): void {
    this.value = knoraVal;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  save() {
    let reload = false;
    if (this.inData.articleIri === undefined) {
      //
      // we create a new article
      //
      this.knoraService.createArticle(this.form.value).subscribe(
        res => {
          console.log('CREATE_RESULT:', res);
        },
      );
      reload = true;
    } else {
      //
      // we edit an existing article, update/create only changed fields
      //
      const obs: Array<Observable<string>> = [];

      if (this.valIds.label.changed) {
        const gaga: Observable<string> = this.knoraService.updateLabel(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.lastmod,
          this.form.value.label);
        obs.push(gaga);
      }

      if (this.valIds.article.toBeDeleted && this.valIds.article.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.article.id as string,
          this.knoraService.mlsOntology + 'hasArticleText');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.article.changed) {
        let gaga: Observable<string>;
        if (this.valIds.article.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasArticleText',
            this.form.value.article);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.article.id as string,
            this.knoraService.mlsOntology + 'hasArticleText',
            this.form.value.article);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.pages.toBeDeleted && this.valIds.pages.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.pages.id as string,
          this.knoraService.mlsOntology + 'hasPages');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.pages.changed) {
        let gaga: Observable<string>;
        if (this.valIds.pages.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasPages',
            this.form.value.pages);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.pages.id as string,
            this.knoraService.mlsOntology + 'hasPages',
            this.form.value.pages);
        }
        reload = true;
        obs.push(gaga);
      }

      if (this.valIds.fonoteca.toBeDeleted && this.valIds.fonoteca.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.fonoteca.id as string,
          this.knoraService.mlsOntology + 'hasFonotecacode');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.fonoteca.changed) {
        let gaga: Observable<string>;
        if (this.valIds.fonoteca.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasFonotecacode',
            this.form.value.fonoteca);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.fonoteca.id as string,
            this.knoraService.mlsOntology + 'hasFonotecacode',
            this.form.value.fonoteca);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.hls.toBeDeleted && this.valIds.hls.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.hls.id as string,
          this.knoraService.mlsOntology + 'hasHlsCcode');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.hls.changed) {
        let gaga: Observable<string>;
        if (this.valIds.hls.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasHlsCcode',
            this.form.value.hls);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.hls.id as string,
            this.knoraService.mlsOntology + 'hasHlsCcode',
            this.form.value.hls);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.oem.toBeDeleted && this.valIds.oem.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.oem.id as string,
          this.knoraService.mlsOntology + 'hasOemlCode');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.oem.changed) {
        let gaga: Observable<string>;
        if (this.valIds.oem.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasOemlCode',
            this.form.value.oem);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.oem.id as string,
            this.knoraService.mlsOntology + 'hasOemlCode',
            this.form.value.oem);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.theatre.toBeDeleted && this.valIds.theatre.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.theatre.id as string,
          this.knoraService.mlsOntology + 'hasTheaterLexCode');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.theatre.changed) {
        let gaga: Observable<string>;
        if (this.valIds.theatre.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasTheaterLexCode',
            this.form.value.theatre);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.theatre.id as string,
            this.knoraService.mlsOntology + 'hasTheaterLexCode',
            this.form.value.theatre);
        }
        reload = true;
        obs.push(gaga);
      }

      if (this.valIds.ticino.toBeDeleted && this.valIds.ticino.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.ticino.id as string,
          this.knoraService.mlsOntology + 'hasTicinoLexCode');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.ticino.changed) {
        let gaga: Observable<string>;
        if (this.valIds.ticino.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasTicinoLexCode',
            this.form.value.ticino);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.ticino.id as string,
            this.knoraService.mlsOntology + 'hasTicinoLexCode',
            this.form.value.ticino);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.web.toBeDeleted && this.valIds.web.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Article',
          this.valIds.web.id as string,
          this.knoraService.mlsOntology + 'hasWebLink');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.web.changed) {
        let gaga: Observable<string>;
        if (this.valIds.web.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.knoraService.mlsOntology + 'hasWebLink',
            this.form.value.web);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Article',
            this.valIds.web.id as string,
            this.knoraService.mlsOntology + 'hasWebLink',
            this.form.value.web);
        }
        obs.push(gaga);
        reload = true;
      }

      forkJoin(obs).subscribe(res => {
        console.log('forkJoin:', res);
      });
    }
    this.dialogRef.close(reload);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getLexica(): void {
    //
    // get all lexica. We will exclude form the list lexica which do already have an artilce
    //
    this.lexica = [];

    const params = {
      page: '0',
      start: 'A'
    };
    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasShortname',
    ];
    this.knoraService.gravsearchQuery('lexica_query', params, fields).subscribe(data => {
      //
      // get all lexica existing
      //
      if (this.inData.lemmaIri !== undefined) {
        //
        // we have a given Lemma
        //
        const paramsB = {
          lemma_iri: this.inData.lemmaIri
        };
        const fieldsB: Array<string> = [
          'id',
          this.knoraService.mlsOntology + 'hasShortname',
        ];
        //
        // now get all lexica which already have an article for the given lemma
        //
        this.knoraService.gravsearchQuery('lexica_from_lemma_query', paramsB, fieldsB).subscribe(
          (dataB) => {
            const dataC = dataB.map(x => x[0]); // get the IRI's only
            for (const d in data) {
              if (data[d] !== undefined) {
                // check if the IRI is in the list of the article-IRI's that have been found
                if (dataC.indexOf(data[d][0]) < 0) {
                  this.lexica.push({iri: data[d][0], name: data[d][1]});
                }
              }
            }
          }
        );
      } else {
        for (const d in data) {
          if (data[d] !== undefined) {
            this.lexica.push({iri: data[d][0], name: data[d][1]});
          }
        }
      }
    });
  }

  getArticle() {
    this.route.params.subscribe(params => {
      // this.articleIri = params.iri;
      this.knoraService.getResource(params.iri).subscribe((data) => {
        const articledata: {[index: string]: string} = {};
        for (const ele of data.properties) {
          switch (ele.propname) {
            case this.knoraService.mlsOntology + 'hasArticleText': {
              articledata.arttext = ele.values[0].replace(/\\n/g, '<br />');
              break;
            }
            case this.knoraService.mlsOntology + 'hasPages': {
              articledata.npages = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasFonotecacode': {
              articledata.fonotecacode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasHlsCcode': {
              articledata.hlscode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasTheaterLexCode': {
              articledata.theaterlexcode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasWebLink': {
              articledata.weblink = ele.values[0];
              break;
            }
          }
        }
        // this.article = articledata;
      });
    });
  }


}
