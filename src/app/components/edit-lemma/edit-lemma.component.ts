import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import {KnoraService} from "../../services/knora.service";
import {map} from "rxjs/operators";
import {forkJoin} from "rxjs";
import {ValueData} from "../../valedit/string-value-edit/string-value-edit.component";

@Component({
  selector: 'app-edit-lemma',
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
      <button class="mat-raised-button" (click)="close()">Cancel</button>
      <button class="mat-raised-button mat-primary" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class EditLemmaComponent implements OnInit {

  arrayItems: Array<ValueData>; //Array<{id: string, title: string, values: Array<string>, ids: Array<string>}> ;

  inData: any;

  resourceId: string;
  resourceType: string;

  constructor(private dialogRef: MatDialogRef<EditLemmaComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private knoraService: KnoraService) {
    this.inData = data;
  }

  ngOnInit() {
    const resClassIri = this.knoraService.mlsOntology + 'Lemma';

    const resinfoObs = this.knoraService.getResinfo(this.knoraService.mlsOntology.slice(0, -1), resClassIri).pipe(map(
      data => {
        console.log('RAW RESINFO: ', data);
        const items: Array<{id: string, label: string, cardinality: string}> = [];
        for (const p in data.properties) {
          if (data.properties.hasOwnProperty(p)) {
            items.push({
              id: p,
              label: data.properties[p].label ? data.properties[p].label as string : '?',
              cardinality: data.properties[p].cardinality
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
            property: tmp.id,
            label: tmp.label,
            cardinality: tmp.cardinality,
            values: data.resData.properties[dataIndex].values.map((value, idx) => {
              return {value, id: data.resData.properties[dataIndex].ids[idx]};
            })
          });
        } else {
          this.arrayItems.push({
            resourceType: this.resourceType,
            resourceId: this.resourceId,
            property: tmp.id,
            label: tmp.label,
            cardinality: tmp.cardinality,
            values: [],
          });
        }
      }
    });

  }

  save() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
