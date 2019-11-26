import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import {KnoraService} from "../../services/knora.service";
import {map} from "rxjs/operators";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-edit-lemma',
  template: `
    <h1 mat-dialog-title>Edit</h1>
    <mat-dialog-content>
      <div *ngFor="let arrayItem of arrayItems; let i=index">
        <app-string-value-edit
                [label]="arrayItem.title"
                [values]="arrayItem.values">
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

  arrayItems: Array<{id: string, title: string, values: Array<string>}> ;

  inData: any;

  constructor(private dialogRef: MatDialogRef<EditLemmaComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private knoraService: KnoraService) {
    this.inData = data;
  }

  ngOnInit() {
    const resClassIri = this.knoraService.mlsOntology + 'Lemma';

    const resinfoObs = this.knoraService.getResinfo(this.knoraService.mlsOntology.slice(0, -1), resClassIri).pipe(map(
      data => {
        console.log(data);
        const items: Array<{id: string, title: string}> = [];
        for (const p in data.properties) {
          if (data.properties.hasOwnProperty(p)) {
            items.push({
              id: p,
              title: data.properties[p].label ? data.properties[p].label as string : '?'
            });
          }
        }
        return items;
      }
    ));

    const resDataObs = this.knoraService.getResource(this.inData.resIri).pipe(map(
      data => data
    ));

    forkJoin({
      resInfo: resinfoObs,
      resData: resDataObs
    }).subscribe(data => {
      console.log(data.resData);
/*
properties: Array (13)
0 {propname: "http://0.0.0.0:3333/ontology/0807/mls/v2#hasCentury", label: "Jahrhundertangabe", values: ["16._Jh."]}
1 {propname: "http://0.0.0.0:3333/ontology/0807/mls/v2#hasDeceasedValue", label: "Verstorben", values: ["Ja"]}
 */
      //console.log(data.resInfo);
      const tmpmap: {[index: string]: number} = {};
      let i = 0;
      for (const tmp of data.resData.properties) {
        tmpmap[tmp.propname] = i;
        i++;
      }

      this.arrayItems = [];
      for (const tmp of data.resInfo) {
        if (tmpmap.hasOwnProperty(tmp.id)) {
          const dataIndex = tmpmap[tmp.id];
          this.arrayItems.push({id: tmp.id, title: tmp.title, values: data.resData.properties[dataIndex].values});
        } else {
          this.arrayItems.push({id: tmp.id, title: tmp.title, values: ['']});
        }
      }
    });

    //this.knoraForm.addControl('a', new FormControl(({value: '--AAA--', disabled: true})));
    //this.knoraForm.addControl('b', new FormControl(({value: '--BB--', disabled: true})));
    this.arrayItems = [];
    console.log('=== End ngOnInit ===============');

  }

  save() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
