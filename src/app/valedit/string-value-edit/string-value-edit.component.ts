import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UpdateResource, UpdateTextValueAsString, UpdateValue} from "@knora/api";
import {KnoraService} from "../../services/knora.service";

export interface ValueData {
  resourceType: string;
  resourceId: string;
  property: string;
  label: string;
  values: Array<{value: string, id: string}>;
}

@Component({
  selector: 'app-string-value-edit',
  template: `
    <form [formGroup]="inputForm">
      <mat-form-field style="width: 100%"
                      appearance="outline"
                      *ngFor="let value of valueData.values; let i = index">
        <mat-label>{{ valueData.label }}</mat-label>
        <input matInput
               [value]="value.value"
               [formControlName]="'textval' + i.toString()">
        <button *ngIf="editButtonVisible[i]"
                mat-mini-fab
                matSuffix
                (click)="enableEdit(i);">
          <mat-icon>edit</mat-icon>
        </button>
        <button *ngIf="saveButtonVisible[i]"
                mat-mini-fab
                matSuffix
                (click)="saveEdit(i);">
          <mat-icon>save</mat-icon>
        </button>
        <button *ngIf="cancelButtonVisible[i]"
                mat-mini-fab
                matSuffix
                (click)="cancelEdit(i);">
          <mat-icon>cancel</mat-icon>
        </button>
        <button *ngIf="deleteButtonVisible[i]"
                mat-mini-fab
                matSuffix>
          <mat-icon>remove</mat-icon>
        </button>
      </mat-form-field>
    </form>
  `,
  styles: [
    'knora {display: inline-block}',
    'fullwidth {width: 100%}'
  ]
})
export class StringValueEditComponent implements OnInit {
  @Input()
  valueData: ValueData;

  inputControl: Array<FormControl>;
  inputForm: FormGroup;
  editButtonVisible: Array<boolean>;
  saveButtonVisible: Array<boolean>;
  cancelButtonVisible: Array<boolean>;
  deleteButtonVisible: Array<boolean>;

  constructor(private knoraService: KnoraService) {
    this.inputControl = [];
    this.inputForm  = new FormGroup({});
    this.editButtonVisible = [];
    this.saveButtonVisible = [];
    this.cancelButtonVisible = [];
    this.deleteButtonVisible = [];
  }

  ngOnInit() {
    console.log(this.valueData.values);
    for (let i = 0; i < this.valueData.values.length; i++) {
      this.inputForm.addControl('textval' + i.toString(), new FormControl({value: '', disabled: true}));
      this.editButtonVisible.push(true);
      this.saveButtonVisible.push(false);
      this.cancelButtonVisible.push(false);
      this.deleteButtonVisible.push(true);
    }
    console.log('===  ngOnInit() FINISHED  ===');
  }

  enableEdit(index) {
    this.inputForm.controls['textval' + index.toString()].enable()
    this.editButtonVisible[index] = false;
    this.saveButtonVisible[index] = true;
    this.cancelButtonVisible[index] = true;
    this.deleteButtonVisible[index] = false;
  }

  saveEdit(index) {
    this.inputForm.controls['textval' + index.toString()].disable();
    this.editButtonVisible[index] = true;
    this.saveButtonVisible[index] = false;
    this.cancelButtonVisible[index] = false;
    this.deleteButtonVisible[index] = true;
    console.log(this.inputForm.value['textval' + index.toString()]);

    const updateTextVal = new UpdateTextValueAsString();
    updateTextVal.id = this.valueData.values[index].id;
    updateTextVal.text = this.inputForm.value['textval' + index.toString()];

    const updateResource = new UpdateResource<UpdateValue>();
    updateResource.id = this.valueData.resourceId;
    updateResource.type = this.valueData.resourceType;
    updateResource.property = this.valueData.property;

    updateResource.value = updateTextVal;

    console.log('BEFORE UPDATE:', updateResource);
    this.knoraService.knoraApiConnection.v2.values.updateValue(updateResource).subscribe(res => console.log('RESULT:', res));
  }

  cancelEdit(index) {
    this.inputForm.controls['textval' + index.toString()].disable();
    this.editButtonVisible[index] = true;
    this.saveButtonVisible[index] = false;
    this.cancelButtonVisible[index] = false;
    this.deleteButtonVisible[index] = true;
  }

}
