import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {
  UpdateResource,
  UpdateTextValueAsString,
  CreateTextValueAsString,
  UpdateValue,
  CreateValue,
  WriteValueResponse
} from "@knora/api";
import { KnoraService } from "../../services/knora.service";

export interface ValueData {
  resourceType: string;
  resourceId: string;
  property: string;
  label: string;
  cardinality: string;
  values: Array<{value: string, id: string}>;
}

@Component({
  selector: 'app-string-value-edit',
  template: `
    <form [formGroup]="inputForm">
      <mat-form-field class="fullwidth"
                      appearance="outline"
                      *ngFor="let value of valueData.values; let i = index; let last = last">
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
          <mat-icon>delete</mat-icon>
        </button>
        <button *ngIf="last && addButtonVisible"
                mat-mini-fab
                matSuffix
                (click)="addField()">
          <mat-icon>add</mat-icon>
        </button>
      </mat-form-field>
      <div *ngIf="valueData.values.length === 0"
                      class="fullwidth normalheight outline"
                      appearance="outline">
        {{ valueData.label }}
        <button class="toright"
                mat-mini-fab
                matSuffix
                (click)="addField()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
     </form>
  `,
  styles: [
    '.knora {display: inline-block}',
    '.fullwidth {width: 100%}',
    '.toright {float: right}',
    '.toleft {float: left}',
    '.normalheight {height: 45px; }',
    '.outline {padding: 10px; border-radius: 5px; border-width: 1px; border-style: solid; border-color: grey;}'
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
  deleteButtonEnabled: Array<boolean>;
  isNew: Array<boolean>;
  addButtonVisible: boolean;

  constructor(private knoraService: KnoraService) {
    this.inputControl = [];
    this.inputForm  = new FormGroup({});
    this.editButtonVisible = [];
    this.saveButtonVisible = [];
    this.cancelButtonVisible = [];
    this.deleteButtonVisible = [];
    this.isNew = [];
  }

  ngOnInit() {
    console.log('valueData:', this.valueData);
    for (let i = 0; i < this.valueData.values.length; i++) {
      this.inputForm.addControl('textval' + i.toString(), new FormControl({value: '', disabled: true}));
      this.editButtonVisible.push(true);
      this.saveButtonVisible.push(false);
      this.cancelButtonVisible.push(false);
      this.deleteButtonVisible.push(true);
      if ((this.valueData.values.length === 0)
        || ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '0-n')))) {
        this.addButtonVisible = true;  // ToDo: add dependency of cardinality
      } else {
        this.addButtonVisible = false;
      }
      this.isNew.push(false);
    }
    if (this.valueData.values.length === 0) {
      this.inputForm.addControl('addbutton', new FormControl({value: '', disabled: false}));
    }
  }

  enableEdit(index) {
    this.inputForm.controls['textval' + index.toString()].enable()
    this.editButtonVisible[index] = false;
    this.saveButtonVisible[index] = true;
    this.cancelButtonVisible[index] = true;
    this.deleteButtonVisible[index] = false;
    this.addButtonVisible = false;
  }

  saveEdit(index) {
    this.inputForm.controls['textval' + index.toString()].disable();
    this.editButtonVisible[index] = true;
    this.saveButtonVisible[index] = false;
    this.cancelButtonVisible[index] = false;
    this.deleteButtonVisible[index] = true;
    if ((this.valueData.values.length === 0)
      || ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '0-n')))) {
      this.addButtonVisible = true;  // ToDo: add dependency of cardinality
    } else {
      this.addButtonVisible = false;
    }
    console.log(this.inputForm.value['textval' + index.toString()]);

    if (this.valueData.values[index].id) {
      const updateTextVal = new UpdateTextValueAsString();
      updateTextVal.id = this.valueData.values[index].id;
      updateTextVal.text = this.inputForm.value['textval' + index.toString()];

      const updateResource = new UpdateResource<UpdateValue>();
      updateResource.id = this.valueData.resourceId;
      updateResource.type = this.valueData.resourceType;
      updateResource.property = this.valueData.property;

      updateResource.value = updateTextVal;
      this.knoraService.knoraApiConnection.v2.values.updateValue(updateResource).subscribe(res => console.log('RESULT:', res));
    } else {
      const updateTextVal = new CreateTextValueAsString();
      updateTextVal.text = this.inputForm.value['textval' + index.toString()];

      const createResource = new UpdateResource<CreateValue>();
      createResource.id = this.valueData.resourceId;
      createResource.type = this.valueData.resourceType;
      createResource.property = this.valueData.property;
      createResource.value = updateTextVal;

      this.knoraService.knoraApiConnection.v2.values.createValue(createResource).subscribe(
        (res: WriteValueResponse) => console.log(res));
    }
  }

  cancelEdit(index) {
    if (this.isNew[index]) {
      this.inputForm.removeControl('textval' + index.toString());
      this.editButtonVisible.pop();
      this.saveButtonVisible.pop();
      this.cancelButtonVisible.pop();
      this.deleteButtonVisible.pop();
      this.isNew.pop();
      this.valueData.values.pop()
      if ((this.valueData.values.length === 0)
        || ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '0-n')))) {
        this.addButtonVisible = true;  // ToDo: add dependency of cardinality
      } else {
        this.addButtonVisible = false;
      }
      console.log('DELETING NEWEST ELEMENT!', index);
      return;
    }
    this.inputForm.controls['textval' + index.toString()].disable();
    this.editButtonVisible[index] = true;
    this.saveButtonVisible[index] = false;
    this.cancelButtonVisible[index] = false;
    this.deleteButtonVisible[index] = true;
    this.addButtonVisible = true; // ToDo: add dependency of cardinality
  }

  addField() {
    const i = this.valueData.values.length;
    this.inputForm.addControl('textval' + i.toString(), new FormControl({value: '', enabled: true}));
    this.editButtonVisible.push(false);
    this.saveButtonVisible.push(true);
    this.cancelButtonVisible.push(true);
    this.deleteButtonVisible.push(false);
    this.valueData.values.push({value: '', id: ''});
    this.addButtonVisible = false; // ToDo: add dependency of cardinality
    this.isNew.push(true);
  }

}
