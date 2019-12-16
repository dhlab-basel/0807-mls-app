import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import {KnoraService, ListPropertyData} from "../../../services/knora.service";
import {map} from "rxjs/operators";
import {forkJoin} from "rxjs";
import {ValueData} from "../string-value-edit/value-edit.component";
import {KnoraStringVal} from "../knora-string-input/knora-string-input.component";
import {KnoraListVal} from "../knora-list-input/knora-list-input.component";
import {Constants} from "@knora/api";

@Component({
  selector: 'app-edit-resource',
  template: `
    <h1 mat-dialog-title>Edit</h1>
    <mat-dialog-content>
      <div *ngFor="let arrayItem of arrayItems; let i=index">
        <app-string-value-edit
                [valueData]="arrayItem">
        </app-string-value-edit>
        <mat-divider></mat-divider>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
       <button class="mat-raised-button mat-primary" (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class EditResourceComponent implements OnInit {

  arrayItems: Array<ValueData>;

  inData: any;

  resourceId: string;
  resourceType: string;

  constructor(private dialogRef: MatDialogRef<EditResourceComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private knoraService: KnoraService) {
    this.inData = data;
  }

  ngOnInit() {
    const resinfoObs = this.knoraService.getResinfo(this.knoraService.mlsOntology.slice(0, -1), this.inData.resClassIri).pipe(map(
      data => {
        console.log('RAW RESINFO: ', data);
        const items: Array<{id: string, label: string, cardinality: string, propertyType?: string}> = [];
        for (const p in data.properties) {
          if (data.properties.hasOwnProperty(p)) {
            items.push({
              id: p,
              label: data.properties[p].label ? data.properties[p].label as string : '?',
              cardinality: data.properties[p].cardinality,
              propertyType: data.properties[p].objectType
            });
          }
        }
        return {id: data.id, items};
      }
    ));

    const resDataObs = this.knoraService.getResource(this.inData.resIri).pipe(map(
      data => data
    ));

    forkJoin({
      resInfo: resinfoObs,
      resData: resDataObs
    }).subscribe(data => {
      console.log('RAW RESDATA: ', data.resData);
      this.resourceId = data.resData.id;
      this.resourceType = data.resInfo.id;

      const tmpmap: {[index: string]: number} = {};
      let i = 0;
      for (const tmp of data.resData.properties) {
        tmpmap[tmp.propname] = i;
        i++;
      }

      this.arrayItems = [];
      for (const tmp of data.resInfo.items) {
        if (tmpmap.hasOwnProperty(tmp.id)) {
          const dataIndex = tmpmap[tmp.id];
          this.arrayItems.push({
            resourceType: this.resourceType,
            resourceId: this.resourceId,
            propertyType: tmp.propertyType,
            property: tmp.id,
            label: tmp.label,
            cardinality: tmp.cardinality,
            values: data.resData.properties[dataIndex].values.map((value, idx) => {
              switch (tmp.propertyType) {
                case Constants.TextValue: {
                  const pd = data.resData.properties[dataIndex];
                  return {
                    stringValue: new KnoraStringVal(value, pd.comments[idx] ||''),
                    id: pd.ids[idx]
                  };
                }
                case Constants.ListValue: {
                  const pd = data.resData.properties[dataIndex] as ListPropertyData;
                  return {
                    listValue: new KnoraListVal(pd.nodeIris[idx], pd.comments[idx] || ''),
                    id: pd.ids[idx]
                  };
                }
                default: {
                  const pd = data.resData.properties[dataIndex];
                  return {
                    stringValue: new KnoraStringVal(value, pd.comments[idx] || ''),
                    id: pd.ids[idx]
                  };
                }
              }
            })
          });
        } else {
          this.arrayItems.push({
            resourceType: this.resourceType,
            resourceId: this.resourceId,
            propertyType: tmp.propertyType,
            property: tmp.id,
            label: tmp.label,
            cardinality: tmp.cardinality,
            values: [],
          });
        }
      }
    });

  }

  close() {
    this.dialogRef.close();
  }

}
