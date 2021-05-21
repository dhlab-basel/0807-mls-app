import {Component, Inject, Input, OnInit, Optional, Self} from '@angular/core';
import {ArticleData, KnoraService, Lemma, ListData, ListPropertyData, OptionType} from '../../services/knora.service';
import {FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {Location} from '@angular/common';


interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class LemmaIds {
  public label: ValInfo;
  public lemma: ValInfo;
  public text: ValInfo;
  public type: ValInfo;
  public familyName: ValInfo;
  public givenName: ValInfo;
  public pseudonym: ValInfo;
  public variants: ValInfo;
  public century: ValInfo;
  public deceased: ValInfo;
  public startDate: ValInfo;
  public startDateInfo: ValInfo;
  public endDate: ValInfo;
  public endDateInfo: ValInfo;
  public sex: ValInfo;
  public relevance: ValInfo;
  public viaf: ValInfo;
  public gnd: ValInfo;
  public comment: ValInfo;

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.lemma = {id: undefined, changed: false, toBeDeleted: false};
    this.text = {id: undefined, changed: false, toBeDeleted: false};
    this.type = {id: undefined, changed: false, toBeDeleted: false};
    this.familyName = {id: undefined, changed: false, toBeDeleted: false};
    this.givenName = {id: undefined, changed: false, toBeDeleted: false};
    this.pseudonym = {id: undefined, changed: false, toBeDeleted: false};
    this.variants = {id: undefined, changed: false, toBeDeleted: false};
    this.century = {id: undefined, changed: false, toBeDeleted: false};
    this.deceased = {id: undefined, changed: false, toBeDeleted: false};
    this.startDate = {id: undefined, changed: false, toBeDeleted: false};
    this.startDateInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.endDate = {id: undefined, changed: false, toBeDeleted: false};
    this.endDateInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.sex = {id: undefined, changed: false, toBeDeleted: false};
    this.relevance = {id: undefined, changed: false, toBeDeleted: false};
    this.viaf = {id: undefined, changed: false, toBeDeleted: false};
    this.gnd = {id: undefined, changed: false, toBeDeleted: false};
    this.comment = {id: undefined, changed: false, toBeDeleted: false};
  }
}

@Component({
  selector: 'app-editlem',
  template: `
    <mat-card class="maxw" xmlns="http://www.w3.org/1999/html">
      <mat-card-title>
        Lemma-Editor
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
          <input matInput required
                 class="full-width"
                 placeholder="Lemma"
                 formControlName="text"
                 (input)="_handleInput('text')">
        </mat-form-field>
        <button *ngIf="valIds.text.changed" mat-mini-fab (click)="_handleUndo('text')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <mat-select matInput required
                      placeholder="Lemmatyp"
                      formControlName="typeIri"
                      (selectionChange)="_handleInput('type')">
            <mat-option *ngFor="let lt of lemmaTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.type.changed" mat-mini-fab (click)="_handleUndo('type')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>


        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Vorname"
                 formControlName="givenName"
                 (input)="_handleInput('givenName')">
        </mat-form-field>
        <button *ngIf="valIds.givenName.changed" mat-mini-fab (click)="_handleUndo('givenName')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Nachname"
                 formControlName="familyName"
                 (input)="_handleInput('familyName')">
        </mat-form-field>
        <button *ngIf="valIds.familyName.changed" mat-mini-fab (click)="_handleUndo('familyName')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <mat-select matInput
                      placeholder="Deceased"
                      formControlName="deceasedIri"
                      (selectionChange)="_handleInput('deceased')">
            <mat-option *ngFor="let lt of deceasedTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.deceased.changed" mat-mini-fab (click)="_handleUndo('deceased')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.deceased.id !== undefined" mat-mini-fab (click)="_handleDelete('deceased')">
          <mat-icon *ngIf="!valIds.deceased.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.deceased.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Anfangsdatum"
                 formControlName="startDate"
                 (input)="_handleInput('startDate')">
        </mat-form-field>
        <button *ngIf="valIds.startDate.changed" mat-mini-fab (click)="_handleUndo('startDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.startDate.id !== undefined" mat-mini-fab (click)="_handleDelete('startDate')">
          <mat-icon *ngIf="!valIds.startDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.startDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Anfangsdatum Infos"
                 formControlName="startDateInfo"
                 (input)="_handleInput('startDateInfo')">
        </mat-form-field>
        <button *ngIf="valIds.startDateInfo.changed" mat-mini-fab (click)="_handleUndo('startDateInfo')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.startDateInfo.id !== undefined" mat-mini-fab (click)="_handleDelete('startDateInfo')">
          <mat-icon *ngIf="!valIds.startDateInfo.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.startDateInfo.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Enddatum"
                 formControlName="endDate"
                 (input)="_handleInput('endDate')">
        </mat-form-field>
        <button *ngIf="valIds.endDate.changed" mat-mini-fab (click)="_handleUndo('endDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.endDate.id !== undefined" mat-mini-fab (click)="_handleDelete('endDate')">
          <mat-icon *ngIf="!valIds.endDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.endDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Enddatum Info"
                 formControlName="endDateInfo"
                 (input)="_handleInput('endDateInfo')">
        </mat-form-field>
        <button *ngIf="valIds.endDateInfo.changed" mat-mini-fab (click)="_handleUndo('endDateInfo')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.endDateInfo.id !== undefined" mat-mini-fab (click)="_handleDelete('endDateInfo')">
          <mat-icon *ngIf="!valIds.endDateInfo.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.endDateInfo.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Jahrhundert"
                 formControlName="century"
                 (input)="_handleInput('century')">
        </mat-form-field>
        <button *ngIf="valIds.century.changed" mat-mini-fab (click)="_handleUndo('century')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.century.id !== undefined" mat-mini-fab (click)="_handleDelete('century')">
          <mat-icon *ngIf="!valIds.century.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.century.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <mat-select matInput
                      placeholder="Geschlecht"
                      formControlName="sexIri"
                      (selectionChange)="_handleInput('sex')">
            <mat-option *ngFor="let lt of sexTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.sex.changed" mat-mini-fab (click)="_handleUndo('sex')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.sex.id !== undefined" mat-mini-fab (click)="_handleDelete('sex')">
          <mat-icon *ngIf="!valIds.sex.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.sex.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <mat-select matInput
                      placeholder="Relevantes Lemma"
                      formControlName="relevanceIri"
                      (selectionChange)="_handleInput('relevance')">
            <mat-option *ngFor="let lt of relevanceTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.relevance.changed" mat-mini-fab (click)="_handleUndo('relevance')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.relevance.id !== undefined" mat-mini-fab (click)="_handleDelete('relevance')">
          <mat-icon *ngIf="!valIds.relevance.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.relevance.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="VIAF"
                 formControlName="viaf"
                 (input)="_handleInput('viaf')">
        </mat-form-field>
        <button *ngIf="valIds.viaf.changed" mat-mini-fab (click)="_handleUndo('viaf')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.viaf.id !== undefined" mat-mini-fab (click)="_handleDelete('viaf')">
          <mat-icon *ngIf="!valIds.viaf.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.viaf.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="GND"
                 formControlName="gnd"
                 (input)="_handleInput('gnd')">
        </mat-form-field>
        <button *ngIf="valIds.gnd.changed" mat-mini-fab (click)="_handleUndo('gnd')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.gnd.id !== undefined" mat-mini-fab (click)="_handleDelete('gnd')">
          <mat-icon *ngIf="!valIds.gnd.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.gnd.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
            <textarea matInput rows="5"
                      class="full-width"
                      placeholder="Kommentar"
                      formControlName="comment"
                      (input)="_handleInput('comment')"></textarea>
        </mat-form-field>
        <button *ngIf="valIds.comment.changed" mat-mini-fab (click)="_handleUndo('comment')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.comment.id !== undefined" mat-mini-fab (click)="_handleDelete('comment')">
          <mat-icon *ngIf="!valIds.comment.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.comment.toBeDeleted" color="warn">delete</mat-icon>
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
    '.full-width { width: 100%; }',
  ]
})
export class EditlemComponent implements OnInit {
  controlType = 'editart';
  inData: any;

  form: FormGroup;

  data: Lemma = new Lemma('', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '');

  resId: string;
  lastmod: string;
  public valIds: LemmaIds = new LemmaIds();
  lists: Array<ListData>;

  public lemmaTypes: Array<OptionType>;
  public deceasedTypes: Array<OptionType>;
  public sexTypes: Array<OptionType>;
  public relevanceTypes: Array<OptionType>;


  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              private location: Location,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.lemmaTypes = knoraService.lemmaTypes;
    this.deceasedTypes = knoraService.deceasedTypes;
    this.sexTypes = knoraService.sexTypes;
    this.relevanceTypes = knoraService.relevanceTypes;
  }

  @Input()
  get value(): Lemma | null {
    const {value: {label, text, type, typeIri, givenName, familyName, pseudonym, variants, century, deceased,
    deceasedIri, startDate, startDateInfo, endDate, endDateInfo, sex, sexIri, relevance, relevanceIri, gnd, viaf, comment}} = this.form;
    return new Lemma(label, text, type, typeIri, givenName, familyName, pseudonym, variants, century, deceased,
      deceasedIri, startDate, startDateInfo, endDate, endDateInfo, sex, sexIri, relevance, relevanceIri, gnd, viaf, comment);
  }
  set value(knoraVal: Lemma | null) {
    const {label, text, type, typeIri, givenName, familyName, pseudonym, variants, century, deceased,
      deceasedIri, startDate, startDateInfo, endDate, endDateInfo, sex, sexIri, relevance, relevanceIri, gnd, viaf, comment}
      = knoraVal || new Lemma('', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '');
    this.form.setValue({label, text, type, typeIri, givenName, familyName, pseudonym, variants, century, deceased,
      deceasedIri, startDate, startDateInfo, endDate, endDateInfo, sex, sexIri, relevance, relevanceIri, gnd, viaf, comment});
  }


  ngOnInit(): void {
    combineLatest([this.route.params]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.lemmaIri = arr[0].iri;
        this.knoraService.getResource(this.inData.lemmaIri).subscribe((data) => {
          this.resId = data.id;
          this.lastmod = data.lastmod;
          this.form.controls.label.setValue(data.label);
          this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
          this.data.label = data.label;
          for (const ele of data.properties) {
            switch (ele.propname) {
              case this.knoraService.mlsOntology + 'hasLemmaText': {
                this.form.controls.text.setValue(ele.values[0]);
                this.valIds.text = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.text = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasLemmaType': {
                const tmp = ele as ListPropertyData;
                this.form.controls.typeIri.setValue(tmp.nodeIris[0]);
                this.valIds.type = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                this.data.typeIri = tmp.nodeIris[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasGivenName': {
                this.form.controls.givenName.setValue(ele.values[0]);
                this.valIds.givenName = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.givenName = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasFamilyName': {
                this.form.controls.familyName.setValue(ele.values[0]);
                this.valIds.familyName = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.familyName = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasPseudonym': {
                this.form.controls.pseudonym.setValue(ele.values[0]);
                this.valIds.pseudonym = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.pseudonym = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasCentury': {
                this.form.controls.century.setValue(ele.values[0]);
                this.valIds.century = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.century = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasDeceasedValue': {
                const tmp = ele as ListPropertyData;
                this.form.controls.deceasedIri.setValue(tmp.nodeIris[0]);
                this.valIds.deceased = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                this.data.deceasedIri = tmp.nodeIris[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasStartDate': {
                this.form.controls.startDate.setValue(ele.values[0]);
                this.valIds.startDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.startDate = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasStartDateInfo': {
                this.form.controls.startDateInfo.setValue(ele.values[0]);
                this.valIds.startDateInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.startDateInfo = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasEndDate': {
                this.form.controls.endDate.setValue(ele.values[0]);
                this.valIds.endDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.endDate = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasEndDateInfo': {
                this.form.controls.endDateInfo.setValue(ele.values[0]);
                this.valIds.endDateInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.endDateInfo = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasSex': {
                const tmp = ele as ListPropertyData;
                this.form.controls.sexIri.setValue(tmp.nodeIris[0]);
                this.valIds.sex = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                this.data.sexIri = tmp.nodeIris[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasRelevanceValue': {
                const tmp = ele as ListPropertyData;
                this.form.controls.relevanceIri.setValue(tmp.nodeIris[0]);
                this.valIds.relevance = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                this.data.relevanceIri = tmp.nodeIris[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasViaf': {
                this.form.controls.viaf.setValue(ele.values[0]);
                this.valIds.viaf = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.viaf = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasGnd': {
                this.form.controls.gnd.setValue(ele.values[0]);
                this.valIds.gnd = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.gnd = ele.values[0];
                break;
              }
              case this.knoraService.mlsOntology + 'hasLemmaComment': {
                this.form.controls.comment.setValue(ele.values[0]);
                this.valIds.comment = {id: ele.ids[0], changed: false, toBeDeleted: false};
                this.data.comment = ele.values[0];
                break;
              }

            }
          }
        });
      }

      this.form = this.fb.group({
        label: [this.data.label, []],
        text: [this.data.text, []],
        typeIri: [this.data.typeIri, []],
        givenName: [this.data.givenName, []],
        familyName: [this.data.familyName, []],
        pseudonym: [this.data.pseudonym, []],
        century: [this.data.century, []],
        deceasedIri: [this.data.deceasedIri, []],
        startDate: [this.data.startDate, []],
        startDateInfo: [this.data.startDateInfo, []],
        endDate: [this.data.endDate, []],
        endDateInfo: [this.data.endDateInfo, []],
        sexIri: [this.data.sexIri, []],
        relevanceIri: [this.data.relevanceIri, []],
        viaf: [this.data.viaf, []],
        gnd: [this.data.gnd, []],
        comment: [this.data.comment, []],
      });
    });
  }

  onChange = (_: any) => {
  }

  onTouched = () => {
  }

  _handleInput(what: string): void {
    this.onChange(this.form.value);
    switch (what) {
      case 'label':
        this.valIds.label.changed = true;
        break;
      case 'text':
        this.valIds.text.changed = true;
        break;
      case 'type':
        this.valIds.type.changed = true;
        break;
      case 'givenName':
        this.valIds.givenName.changed = true;
        break;
      case 'familyName':
        this.valIds.familyName.changed = true;
        break;
      case 'deceased':
        this.valIds.deceased.changed = true;
        break;
      case 'startDate':
        this.valIds.startDate.changed = true;
        break;
      case 'startDateInfo':
        this.valIds.startDateInfo.changed = true;
        break;
      case 'endDate':
        this.valIds.endDate.changed = true;
        break;
      case 'endDateInfo':
        this.valIds.endDateInfo.changed = true;
        break;
      case 'sex':
        this.valIds.sex.changed = true;
        break;
      case 'century':
        this.valIds.century.changed = true;
        break;
      case 'relevance':
        this.valIds.relevance.changed = true;
        break;
      case 'viaf':
        this.valIds.viaf.changed = true;
        break;
      case 'gnd':
        this.valIds.gnd.changed = true;
        break;
      case 'comment':
        this.valIds.comment.changed = true;
        break;
    }
  }

  _handleDelete(what: string): void {
    switch (what) {
      case 'label':
        if (this.valIds.label.id !== undefined) {
          this.valIds.label.toBeDeleted = !this.valIds.label.toBeDeleted;
        }
        break;
      case 'text':
        if (this.valIds.text.id !== undefined) {
          this.valIds.text.toBeDeleted = !this.valIds.text.toBeDeleted;
        }
        break;
      case 'type':
        if (this.valIds.type.id !== undefined) {
          this.valIds.type.toBeDeleted = !this.valIds.type.toBeDeleted;
        }
        break;
      case 'givenName':
        if (this.valIds.givenName.id !== undefined) {
          this.valIds.givenName.toBeDeleted = !this.valIds.givenName.toBeDeleted;
        }
        break;
      case 'familyName':
        if (this.valIds.familyName.id !== undefined) {
          this.valIds.familyName.toBeDeleted = !this.valIds.familyName.toBeDeleted;
        }
        break;
      case 'deceased':
        if (this.valIds.deceased.id !== undefined) {
          this.valIds.deceased.toBeDeleted = !this.valIds.deceased.toBeDeleted;
        }
        break;
      case 'startDate':
        if (this.valIds.startDate.id !== undefined) {
          this.valIds.startDate.toBeDeleted = !this.valIds.startDate.toBeDeleted;
        }
        break;
      case 'startDateInfo':
        if (this.valIds.startDateInfo.id !== undefined) {
          this.valIds.startDateInfo.toBeDeleted = !this.valIds.startDateInfo.toBeDeleted;
        }
        break;
      case 'endDate':
        if (this.valIds.endDate.id !== undefined) {
          this.valIds.endDate.toBeDeleted = !this.valIds.endDate.toBeDeleted;
        }
        break;
      case 'endDateInfo':
        if (this.valIds.endDateInfo.id !== undefined) {
          this.valIds.endDateInfo.toBeDeleted = !this.valIds.endDateInfo.toBeDeleted;
        }
        break;
      case 'sex':
        if (this.valIds.sex.id !== undefined) {
          this.valIds.sex.toBeDeleted = !this.valIds.sex.toBeDeleted;
        }
        break;
      case 'century':
        if (this.valIds.century.id !== undefined) {
          this.valIds.century.toBeDeleted = !this.valIds.century.toBeDeleted;
        }
        break;
      case 'relevance':
        if (this.valIds.relevance.id !== undefined) {
          this.valIds.relevance.toBeDeleted = !this.valIds.relevance.toBeDeleted;
        }
        break;
      case 'viaf':
        if (this.valIds.viaf.id !== undefined) {
          this.valIds.viaf.toBeDeleted = !this.valIds.viaf.toBeDeleted;
        }
        break;
      case 'gnd':
        if (this.valIds.gnd.id !== undefined) {
          this.valIds.gnd.toBeDeleted = !this.valIds.gnd.toBeDeleted;
        }
        break;
      case 'comment':
        if (this.valIds.comment.id !== undefined) {
          this.valIds.comment.toBeDeleted = !this.valIds.comment.toBeDeleted;
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
      case 'text':
        this.form.controls.text.setValue(this.data.text);
        this.valIds.text.changed = false;
        break;
      case 'type':
        this.form.controls.typeIri.setValue(this.data.typeIri);
        this.valIds.type.changed = false;
        break;
      case 'givenName':
        this.form.controls.givenName.setValue(this.data.givenName);
        this.valIds.givenName.changed = false;
        break;
      case 'familyName':
        this.form.controls.familyName.setValue(this.data.familyName);
        this.valIds.familyName.changed = false;
        break;
      case 'deceased':
        this.form.controls.deceasedIri.setValue(this.data.deceasedIri);
        this.valIds.deceased.changed = false;
        break;
      case 'startDate':
        this.form.controls.startDate.setValue(this.data.startDate);
        this.valIds.startDate.changed = false;
        break;
      case 'startDateInfo':
        this.form.controls.startDateInfo.setValue(this.data.startDateInfo);
        this.valIds.startDateInfo.changed = false;
        break;
      case 'endDate':
        this.form.controls.endDate.setValue(this.data.endDate);
        this.valIds.endDate.changed = false;
        break;
      case 'endDateInfo':
        this.form.controls.endDateInfo.setValue(this.data.endDateInfo);
        this.valIds.endDateInfo.changed = false;
        break;
      case 'century':
        this.form.controls.century.setValue(this.data.century);
        this.valIds.century.changed = false;
        break;
      case 'sex':
        this.form.controls.sexIri.setValue(this.data.sexIri);
        this.valIds.sex.changed = false;
        break;
      case 'relevance':
        this.form.controls.relevanceIri.setValue(this.data.relevanceIri);
        this.valIds.relevance.changed = false;
        break;
      case 'gnd':
        this.form.controls.gnd.setValue(this.data.gnd);
        this.valIds.gnd.changed = false;
        break;
      case 'comment':
        this.form.controls.comment.setValue(this.data.comment);
        this.valIds.comment.changed = false;
        break;
    }
  }

  save() {
    let reload = false;
    if (this.inData.lemmaIri === undefined) {
      //
      // we create a new Lemma
      //
      this.knoraService.createLemma(this.form.value).subscribe(
        res => {
          console.log('CREATE_RESULT:', res);
        },
      );
      reload = true;
    } else {
      //
      // we edit an existing Lemma, update/create only changed fields
      //
      const obs: Array<Observable<string>> = [];

      if (this.valIds.label.changed) {
        const gaga: Observable<string> = this.knoraService.updateLabel(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.lastmod,
          this.form.value.label);
        obs.push(gaga);
      }

      if (this.valIds.text.toBeDeleted && this.valIds.text.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.text.id as string,
          this.knoraService.mlsOntology + 'hasLemmaText');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.text.changed) {
        let gaga: Observable<string>;
        if (this.valIds.text.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasLemmaText',
            this.form.value.article);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.text.id as string,
            this.knoraService.mlsOntology + 'hasLemmaText',
            this.form.value.article);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.type.toBeDeleted && this.valIds.type.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteListValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.type.id as string,
          this.knoraService.mlsOntology + 'hasLemmaType');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.type.changed) {
        let gaga: Observable<string>;
        if (this.valIds.type.id === undefined) {
          gaga = this.knoraService.createListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasLemmaType',
            this.form.value.typeIri);
        } else {
          gaga = this.knoraService.updateListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.type.id as string,
            this.knoraService.mlsOntology + 'hasLemmaType',
            this.form.value.typeIri);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.givenName.toBeDeleted && this.valIds.givenName.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.givenName.id as string,
          this.knoraService.mlsOntology + 'hasGivenName');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.givenName.changed) {
        let gaga: Observable<string>;
        if (this.valIds.givenName.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasGivenName',
            this.form.value.givenName);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.givenName.id as string,
            this.knoraService.mlsOntology + 'hasGivenName',
            this.form.value.givenName);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.familyName.toBeDeleted && this.valIds.familyName.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.familyName.id as string,
          this.knoraService.mlsOntology + 'hasFamilyName');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.familyName.changed) {
        let gaga: Observable<string>;
        if (this.valIds.familyName.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasFamilyName',
            this.form.value.familyName);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.familyName.id as string,
            this.knoraService.mlsOntology + 'hasFamilyName',
            this.form.value.familyName);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.pseudonym.toBeDeleted && this.valIds.pseudonym.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.pseudonym.id as string,
          this.knoraService.mlsOntology + 'hasPseudonym');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.pseudonym.changed) {
        let gaga: Observable<string>;
        if (this.valIds.pseudonym.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasPseudonym',
            this.form.value.pseudonym);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.pseudonym.id as string,
            this.knoraService.mlsOntology + 'hasPseudonym',
            this.form.value.pseudonym);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.variants.toBeDeleted && this.valIds.variants.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.variants.id as string,
          this.knoraService.mlsOntology + 'hasVariants');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.variants.changed) {
        let gaga: Observable<string>;
        if (this.valIds.variants.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasVariants',
            this.form.value.variants);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.variants.id as string,
            this.knoraService.mlsOntology + 'hasVariants',
            this.form.value.variants);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.century.toBeDeleted && this.valIds.century.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.century.id as string,
          this.knoraService.mlsOntology + 'hasCentury');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.century.changed) {
        let gaga: Observable<string>;
        if (this.valIds.century.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasCentury',
            this.form.value.century);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.century.id as string,
            this.knoraService.mlsOntology + 'hasCentury',
            this.form.value.century);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.deceased.toBeDeleted && this.valIds.deceased.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteListValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.deceased.id as string,
          this.knoraService.mlsOntology + 'hasDeceasedValue');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.deceased.changed) {
        let gaga: Observable<string>;
        if (this.valIds.deceased.id === undefined) {
          gaga = this.knoraService.createListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasDeceasedValue',
            this.form.value.deceasedIri);
        } else {
          gaga = this.knoraService.updateListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.deceased.id as string,
            this.knoraService.mlsOntology + 'hasDeceasedValue',
            this.form.value.deceasedIri);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.startDate.toBeDeleted && this.valIds.startDate.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.startDate.id as string,
          this.knoraService.mlsOntology + 'hasStartDate');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.startDate.changed) {
        let gaga: Observable<string>;
        if (this.valIds.startDate.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasStartDate',
            this.form.value.startDate);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.startDate.id as string,
            this.knoraService.mlsOntology + 'hasStartDate',
            this.form.value.startDate);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.startDateInfo.toBeDeleted && this.valIds.startDateInfo.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.startDateInfo.id as string,
          this.knoraService.mlsOntology + 'hasStartDateInfo');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.startDateInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.startDateInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasStartDateInfo',
            this.form.value.startDateInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.startDateInfo.id as string,
            this.knoraService.mlsOntology + 'hasStartDateInfo',
            this.form.value.startDateInfo);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.endDate.toBeDeleted && this.valIds.endDate.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.endDate.id as string,
          this.knoraService.mlsOntology + 'hasEndDate');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.endDate.changed) {
        let gaga: Observable<string>;
        if (this.valIds.endDate.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasEndDate',
            this.form.value.endDate);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.endDate.id as string,
            this.knoraService.mlsOntology + 'hasEndDate',
            this.form.value.endDate);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.endDateInfo.toBeDeleted && this.valIds.endDateInfo.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.endDateInfo.id as string,
          this.knoraService.mlsOntology + 'hasEndDateInfo');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.endDateInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.endDateInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasEndDateInfo',
            this.form.value.endDateInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.endDateInfo.id as string,
            this.knoraService.mlsOntology + 'hasEndDateInfo',
            this.form.value.endDateInfo);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.sex.toBeDeleted && this.valIds.sex.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteListValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.sex.id as string,
          this.knoraService.mlsOntology + 'hasSex');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.sex.changed) {
        let gaga: Observable<string>;
        if (this.valIds.sex.id === undefined) {
          gaga = this.knoraService.createListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasSex',
            this.form.value.sexIri);
        } else {
          gaga = this.knoraService.updateListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.sex.id as string,
            this.knoraService.mlsOntology + 'hasSex',
            this.form.value.sexIri);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.relevance.toBeDeleted && this.valIds.relevance.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteListValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.relevance.id as string,
          this.knoraService.mlsOntology + 'hasRelevanceValue');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.relevance.changed) {
        let gaga: Observable<string>;
        if (this.valIds.relevance.id === undefined) {
          gaga = this.knoraService.createListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasRelevanceValue',
            this.form.value.relevanceIri);
        } else {
          gaga = this.knoraService.updateListValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.relevance.id as string,
            this.knoraService.mlsOntology + 'hasRelevanceValue',
            this.form.value.relevanceIri);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.gnd.toBeDeleted && this.valIds.gnd.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.gnd.id as string,
          this.knoraService.mlsOntology + 'hasGnd');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.gnd.changed) {
        let gaga: Observable<string>;
        if (this.valIds.gnd.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasGnd',
            this.form.value.gnd);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.gnd.id as string,
            this.knoraService.mlsOntology + 'hasGnd',
            this.form.value.gnd);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.viaf.toBeDeleted && this.valIds.viaf.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.viaf.id as string,
          this.knoraService.mlsOntology + 'hasViaf');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.viaf.changed) {
        let gaga: Observable<string>;
        if (this.valIds.viaf.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasViaf',
            this.form.value.viaf);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.viaf.id as string,
            this.knoraService.mlsOntology + 'hasViaf',
            this.form.value.viaf);
        }
        obs.push(gaga);
        reload = true;
      }

      if (this.valIds.comment.toBeDeleted && this.valIds.comment.id !== undefined) {
        let gaga: Observable<string>;
        gaga = this.knoraService.deleteTextValue(
          this.resId,
          this.knoraService.mlsOntology + 'Lemma',
          this.valIds.comment.id as string,
          this.knoraService.mlsOntology + 'hasLemmaComment');
        obs.push(gaga);
        reload = true;
      } else if (this.valIds.comment.changed) {
        let gaga: Observable<string>;
        if (this.valIds.comment.id === undefined) {
          gaga = this.knoraService.createTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.knoraService.mlsOntology + 'hasLemmaComment',
            this.form.value.comment);
        } else {
          gaga = this.knoraService.updateTextValue(
            this.resId,
            this.knoraService.mlsOntology + 'Lemma',
            this.valIds.comment.id as string,
            this.knoraService.mlsOntology + 'hasLemmaComment',
            this.form.value.comment);
        }
        obs.push(gaga);
        reload = true;
      }
      forkJoin(obs).subscribe(res => {
        console.log('forkJoin:', res);
      });
      this.location.back();

    }
  }



}
