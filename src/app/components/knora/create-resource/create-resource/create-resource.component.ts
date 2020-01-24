import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KnoraService, ResInfo} from "../../../../services/knora.service";
import {Constants} from "@knora/api";
import {map} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";

class PropInfo {
  public id: string;
  public cardinality: string;
  public valtype: string;
  public label?: string;
  public guielement?: string;
  public listIri?: string;

  constructor(id: string, cardinality: string, valtype: string, label?: string, guielement?: string, listIri?: string) {
    this.id = id;
    this.label = label;
    this.cardinality = cardinality;
    this.valtype = valtype;
    this.guielement = guielement;
    this.listIri = listIri;
  }
}

@Component({
  selector: 'app-create-resource',
  template: `
    <mat-dialog-content appearance="outline">
      <h2>{{ reslabel }}</h2>
      <div *ngFor="let prop of props;">
        <form [formGroup]="inputForms[prop.id]">
          <mat-label>{{ prop.label }}</mat-label>
          <mat-form-field  class="fullwidth"
                           appearance="outline">
            <div [ngSwitch]="prop.valtype">
              <knora-string-input *ngSwitchCase="'TextValue'"
                                  [formControlName]="valueControlTable[prop.id][0]"
                                  [valueLabel]="prop.label">
              </knora-string-input>
              <knora-list-input *ngSwitchCase="'ListValue'"
                                [formControlName]="valueControlTable[prop.id][0]"
                                [valueLabel]="prop.label"
                                [listIri]="prop.listIri">
              </knora-list-input>
              <knora-link-input *ngSwitchCase="'LinkValue'"
                                [formControlName]="valueControlTable[prop.id][0]"
                                [valueLabel]="prop.label">
              </knora-link-input>
              <knora-string-input *ngSwitchDefault
                                  [formControlName]="valueControlTable[prop.id][0]"
                                  [valueLabel]="prop.label">
              </knora-string-input>
              <button *ngIf="addButtonVisible[prop.id]"
                      mat-mini-fab
                      matSuffix
                      (click)="addField(prop.id)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <mat-divider></mat-divider>
          </mat-form-field>
        </form>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button class="mat-raised-button mat-primary" (click)="close()">Close</button>
    </mat-dialog-actions>

  `,
  styles: [
    '.fullwidth {width: 100%}'
  ]
})
export class CreateResourceComponent implements OnInit {

  inData: any;
  inputForms: {[index: string]: FormGroup};

  reslabel: string;
  props: Array<PropInfo>;

  valueControlTable: {[index: string]: Array<string>};
  valueControlIndex: {[index: string]: number};
  addButtonVisible: {[index: string]: boolean};

  constructor(private dialogRef: MatDialogRef<CreateResourceComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private knoraService: KnoraService) {
    this.inData = data;
    this.reslabel = '';
    this.props = [];

    this.valueControlIndex = {};
    this.inputForms = {};
    this.valueControlTable = {};
    this.addButtonVisible = {};
  }

  ngOnInit() {
    this.knoraService.getResinfo(this.knoraService.mlsOntology.slice(0, -1), this.inData.resClassIri).subscribe((resinfo: ResInfo) => {
      this.reslabel = resinfo.label;
      let i = 0;
      // tslint:disable-next-line:forin
      for (const key in resinfo.properties) {
        this.valueControlIndex[key] = 0;
        this.inputForms[key] = new FormGroup({});
        this.inputForms[key].addControl('val' + this.valueControlIndex[key].toString(), new FormControl({value: '', disabled: false}));
        this.valueControlTable[key] = [];
        this.valueControlTable[key].push('val' + this.valueControlIndex[key].toString());
        this.valueControlIndex[key]++;

        console.log('********* ', resinfo.properties[key].cardinality);
        this.addButtonVisible[key] = ((resinfo.properties[key].cardinality === '1-n') || (resinfo.properties[key].cardinality === '0-n'));

        let ot: string;
        let listIri: string | undefined;
        switch (resinfo.properties[key].objectType) {
          case Constants.TextValue: ot = 'TextValue'; break;
          case Constants.ListValue: {
            ot = 'ListValue';
            const gaga = resinfo.properties[key].guiAttributes;
            if (gaga) {
              for (const tmp of gaga) {
                const parts = tmp.split("=");
                if ((parts.length === 2) && (parts[0] === "hlist")) {
                  listIri = parts[1].slice(1, -1);
                }
              }
            }
            break;
          }
          case Constants.LinkValue: ot = 'LinkValue'; break;
          default: ot = 'TextValue';
        }
        const p = new PropInfo(
          key,
          resinfo.properties[key].cardinality,
          ot,
          resinfo.properties[key].label,
          resinfo.properties[key].guiElement,
          listIri
        );
        this.props.push(p);
        i++;
      }
    });
  }

  addField(key) {
    console.log('--==>>', key);
    this.inputForms[key].addControl('val' + this.valueControlIndex[key].toString(), new FormControl({value: '', disabled: false}));
  }

  close() {
    this.dialogRef.close();
  }

}
