import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {KnoraService} from "../../services/knora.service";
import {KnoraLinkVal} from "../knora/knora-link-input/knora-link-input.component";
import {CKEditorComponent} from "@ckeditor/ckeditor5-angular";



@Component({
  selector: 'app-editart',
  template: `
    <mat-card class="maxw" xmlns="http://www.w3.org/1999/html">
      <mat-card-title>
        Artikel-Editor
      </mat-card-title>
      <mat-card-content>
        <form class="article-form">
          <mat-form-field class="full-width">
            <mat-label>Lemma</mat-label>
            <input matInput placeholder="Lemma" [value]="lemma">
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Lexicon</mat-label>
            <input matInput placeholder="Lexicon" [value]="lexicon">
          </mat-form-field>

          <ckeditor #editor [editor]="Editor" [data]="article"></ckeditor>

          <mat-form-field class="full-width">
            <mat-label>Fonoteca code</mat-label>
            <input matInput placeholder="Fonoteca" [value]="fonoteca">
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>HLS code</mat-label>
            <input matInput placeholder="HLS code" [value]="hls">
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>OEM code</mat-label>
            <input matInput placeholder="OEM code" [value]="oem">
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Theaterlexicon code</mat-label>
            <input matInput placeholder="Theaterlexicon code" [value]="theatre">
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Ticinolexicon code</mat-label>
            <input matInput placeholder="Ticinolexicon code" [value]="ticino">
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Weblink</mat-label>
            <input matInput placeholder="Weblink" type="url" [value]="web">
          </mat-form-field>
          <button (click)="saveEvent($event)">Save</button>
        </form>
      </mat-card-content>
  `,
  styles: [
    '.maxw { max-width: 500px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
  ]
})

export class EditartComponent implements OnInit {
  @ViewChild( 'editor' ) editorComponent: CKEditorComponent;

  public Editor = ClassicEditor;

  public lemma: string = 'a lemma';
  public lexicon: string = 'a lexicon';
  public article: string = 'a <em>article</em> text';
  public fonoteca: string = 'a fonoteca code';
  public hls: string = 'a hls code';
  public oem: string = 'a oem code';
  public theatre: string = 'a theatrelexicon code';
  public ticino: string = 'a ticinolexicon code';
  public web: string = 'a web link';


  constructor(public knoraService: KnoraService) {

  }

  ngOnInit(): void {
  }

  public getEditor() {
    // Warning: This may return "undefined" if the editor is hidden behind the `*ngIf` directive or
    // if the editor is not fully initialised yet.
    return this.editorComponent.editorInstance;
  }

  saveEvent(event): void {
    const data = this.getEditor().getData();
    console.log(data);
  }

  cancelEvent(event): void {
    console.log('CANCEL')
  }


  _handleLinkInput(): void {
    this.knoraService.getResourcesByLabel(this.parts.value.label).subscribe(
      res => {
        console.log('_handleLinkInput:', res);
        //this.options = res;
        //this.parts.value.label = res[0].label;
        //this.parts.value.resourceIri = res[0].id;
        //this.onChange(this.parts.value);
      }
    );
  }

  _optionSelected(val): void {
    console.log('_optionSelected(1):', val);
    //const res = this.options.filter(tmp => tmp.label === val);
    //if (res.length !== 1) {
    //  console.log('BIG ERROR...');
    //}
    //this.value = new KnoraLinkVal(res[0].label, res[0].id, this.parts.value.comment);
  }


}
