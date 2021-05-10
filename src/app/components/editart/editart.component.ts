import {Component, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewChild} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {KnoraService, ArticleData, ResourceData} from '../../services/knora.service';
import {CKEditorComponent} from "@ckeditor/ckeditor5-angular";
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EditResourceComponent} from "../knora/edit-resource/edit-resource.component";
import {ActivatedRoute} from "@angular/router";
import {LemmataComponent} from "../lemmata/lemmata.component";
import {LemmaselectComponent} from "../lemmaselect/lemmaselect.component";
import {map} from "rxjs/operators";
import {Constants, ReadResourceSequence} from '@dasch-swiss/dsp-js';
import {Subject} from "rxjs";
import {KnoraLinkVal} from "../knora/knora-link-input/knora-link-input.component";


interface Lexica {
  iri: string;
  name: string;
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
        <mat-form-field>
          <input matInput required
                 class="full-width"
                 placeholder="Label"
                 formControlName="label">
        </mat-form-field>
        <br/>
        <mat-form-field *ngIf="inData.lemmaIri === undefined">
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
        <mat-form-field *ngIf="inData.lemmaIri !== undefined">
          <input matInput
                 placeholder="Lemma"
                 formControlName="lemma"
                 aria-label="Value">
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

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              private dialogRef: MatDialogRef<EditartComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = data;
    console.log('inData=', this.inData);
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
    if (this.inData.lemmaIri !== undefined) {
      this.data.lemma = this.inData.lemmaLabel;
      this.data.lemmaIri = this.inData.lemmaIri;
    }

    if (this.inData.articleIri !== undefined) {
      this.knoraService.getResource(this.inData.articleIri).subscribe((data) => {
        console.log('=====================================');
        console.log(data);
        console.log('-------------------------------------');
        this.form.controls.label.setValue(data.label);
        for (const ele of data.properties) {
          switch (ele.propname) {
            case this.knoraService.mlsOntology + 'hasALinkToLemmaValue': {
              this.form.controls.lemma.setValue(ele.values[0]);
              this.form.controls.lemma.disable();
              break;
            }
            case this.knoraService.mlsOntology + 'hasArticleText': {
              this.form.controls.article.setValue(ele.values[0]);
              break;
            }
            /*
            case this.knoraService.mlsOntology + 'hasPages': {
              articledata.npages = ele.values[0];
              break;
            }
             */
            case this.knoraService.mlsOntology + 'hasFonotecacode': {
              this.form.controls.fonoteca.setValue(ele.values[0]);
              break;
            }
            case this.knoraService.mlsOntology + 'hasHlsCcode': {
              this.form.controls.hls.setValue(ele.values[0]);
              break;
            }
            case this.knoraService.mlsOntology + 'hasOemlCode': {
              this.form.controls.oem.setValue(ele.values[0]);
              break;
            }
            case this.knoraService.mlsOntology + 'hasTheaterLexCode': {
              this.form.controls.theatre.setValue(ele.values[0]);
              break;
            }
            case this.knoraService.mlsOntology + 'hasTicinoLexCode': {
              this.form.controls.ticino.setValue(ele.values[0]);
              break;
            }
            case this.knoraService.mlsOntology + 'hasWebLink': {
              this.form.controls.web.setValue(ele.values[0]);
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
      },
    );
  }

  cancel() {
    // this.dialogRef.close();
    console.log(this.form.value);
    this.dialogRef.close();

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
