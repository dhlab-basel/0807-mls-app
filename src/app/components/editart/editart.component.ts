import {Component, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewChild} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {KnoraService, ArticleData} from "../../services/knora.service";
import {CKEditorComponent} from "@ckeditor/ckeditor5-angular";
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditResourceComponent} from "../knora/edit-resource/edit-resource.component";
import {ActivatedRoute} from "@angular/router";
import {LemmataComponent} from "../lemmata/lemmata.component";
import {LemmaselectComponent} from "../lemmaselect/lemmaselect.component";
import {map} from "rxjs/operators";
import {ReadResourceSequence} from "@dasch-swiss/dsp-js";
import {Subject} from "rxjs";
import {KnoraLinkVal} from "../knora/knora-link-input/knora-link-input.component";


interface Lexica {
  iri: string;
  name: string;
}

@Component({
  selector: 'app-editart',
  template: `
    <div class="content" width="100%">
     <mat-card class="maxw" xmlns="http://www.w3.org/1999/html">
      <mat-card-title>
        Artikel-Editor
      </mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field>
          <input matInput required
                 class="full-width"
                 placeholder="Label"
                 formControlName="label">
        </mat-form-field>
        <br/>
        <mat-form-field>
          <input matInput [matAutocomplete]="auto"
                 required
                 class="knora-link-input-element klnkie-val"
                 placeholder="Lemma"
                 formControlName="lemma"
                 aria-label="Value"
                 (input)="_handleLinkInput()">
          <input matInput style="width: 100%" [hidden]="true" formControlName="lemmaIri">
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="_optionSelected($event.option.value)">
            <mat-option *ngFor="let option of options" [value]="option.label">
              {{ option.label }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <br/>

        <mat-form-field>
          <mat-select matInput required
                      placeholder="Select lexicon"
                      formControlName="lexiconIri">
            <mat-option *ngFor="let lex of lexica" [value]="lex.iri">
              {{lex.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <br/>

        <ckeditor matInput #editor [editor]="Editor" formControlName="article"></ckeditor><br/>

        <mat-form-field>
          <input matInput class="full-width"
                 placeholder="Fonoteca code"
                 formControlName="fonoteca">
        </mat-form-field>
        <br/>

        <mat-form-field>
          <input matInput class="full-width"
                 placeholder="HLS code"
                 formControlName="hls">
        </mat-form-field>
        <br/>

        <mat-form-field>
          <input matInput class="full-width"
                 placeholder="OEM code"
                 formControlName="oem">
        </mat-form-field>
        <br/>

        <mat-form-field>
          <input matInput class="full-width"
                 placeholder="Theatrelexicon code"
                 formControlName="theatre">
        </mat-form-field>
        <br/>

        <mat-form-field>
          <input matInput class="full-width"
                 placeholder="Ticinolexcon code"
                 formControlName="ticino">
        </mat-form-field>
        <br/>

        <mat-form-field>
          <input matInput class="full-width"
                 placeholder="WEB code"
                 formControlName="web">
        </mat-form-field>
        <br/>

        <mat-dialog-actions>
          <button class="mat-raised-button" (click)="cancel()">Cancel</button>
          <button class="mat-raised-button mat-primary" (click)="save()">Save</button>
        </mat-dialog-actions>
      </mat-card-content>
    </mat-card>
        </div>
  `,
  styles: [
    '.maxw { min-width=500; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
  ]
})

export class EditartComponent implements ControlValueAccessor, OnInit {
  controlType = 'editqart';

  public Editor = ClassicEditor;

  form: FormGroup;

  options: Array<{id: string, label: string}> = [];

  public lexica: Lexica[] = [];


  data: ArticleData = new ArticleData('', '', '', '', '');

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              @Optional() @Self() public ngControl: NgControl) {

  }

  @Input()
  get value(): ArticleData | null {
    const {value: {label, lemma, lemmaIri, lexiconIri, article, fonoteca, hls, oem, theatre, ticino, web}} = this.form;
    return new ArticleData(label, lemma, lemmaIri, lexiconIri, article, fonoteca, hls, oem, theatre, ticino, web);
  }
  set value(knoraVal: ArticleData | null) {
    const {label, lemma, lemmaIri, lexiconIri, article, fonoteca, hls, oem, theatre, ticino, web} = knoraVal || new ArticleData('', '', '', '', '', '');
    this.form.setValue({label, lemma, lemmaIri, lexiconIri, article, fonoteca, hls, oem, theatre, ticino, web});
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label, []],
      lemma: [this.data.lemma, []],
      lemmaIri: [this.data.lemmaIri, []],
      // lexicon: [this.data.lexicon, []],
      lexiconIri: [this.data.lexiconIri, []],
      article: [this.data.article, []],
      fonoteca: [this.data.fonoteca, []],
      hls: [this.data.hls, []],
      oem: [this.data.oem, []],
      theatre: [this.data.theatre, []],
      ticino: [this.data.ticino, []],
      web: [this.data.web, []],
    });
    this.form.valueChanges.pipe(
      map(data => console.log(data))
    );
    this.getLexica();

  }

  onChange = (_: any) => {};
  onTouched = () => {};

  _handleLinkInput(): void {
    console.log('this.lemma=', this.form.value.lemma);
    this.knoraService.getResourcesByLabel(this.form.value.lemma, this.knoraService.mlsOntology + 'Lemma').subscribe(
      res => {
        console.log('_handleLinkInput:', res);
        this.options = res;
        this.form.value.lemma = res[0].label;
        this.form.value.lemmaIri = res[0].id;
        this.onChange(this.form.value);
      }
    );
  }

  _optionSelected(val): void {
    console.log('_optionSelected(1):', val);
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    console.log('****>', res);
    this.value = new ArticleData(
      this.form.value.label,
      res[0].label,
      res[0].id,
      this.form.value.lexiconIri,
      this.form.value.article,
      this.form.value.fonoteca,
      this.form.value.hls,
      this.form.value.oem,
      this.form.value.theatre,
      this.form.value.ticino,
      this.form.value.web
    );
    /*
    this.form.value.lemma = res[0].label;
    this.form.value.lemmaIri = res[0].id;
    this.data.lemma = res[0].label;
    this.data.lemmaIri =  res[0].id;
     */
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
    console.log(this.form.value);

    this.knoraService.createArticle(this.form.value).subscribe(
      res => {
        console.log('CREATE_RESULT:', res);
      }
    );
  }

  cancel() {
    // this.dialogRef.close();
    console.log(this.form.value);
  }

  getLexica(): void {
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
        for (const d in data) {
          if (data[d] !== undefined) {
            this.lexica.push({iri: data[d][0], name: data[d][1]});
          }
        }
      });
  }

}
