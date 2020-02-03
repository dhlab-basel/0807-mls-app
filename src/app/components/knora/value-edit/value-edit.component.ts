import { ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {
  UpdateResource,
  UpdateTextValueAsString,
  CreateTextValueAsString,
  UpdateValue,
  CreateValue,
  WriteValueResponse,
  DeleteValue,
  DeleteValueResponse,
  Constants, UpdateListValue, UpdateLinkValue
} from "@knora/api";

import {KnoraStringVal} from "../knora-string-input/knora-string-input.component";
import {KnoraListVal} from "../knora-list-input/knora-list-input.component";
import {KnoraLinkVal} from "../knora-link-input/knora-link-input.component";
import {KnoraService} from "../../../services/knora.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel, ConfirmDialogResult} from "../confirm-dialog/confirm-dialog.component";

export interface ValueData {
  resourceType: string;
  resourceId: string;
  propertyType?: string;
  guiElement?: string;
  property: string;
  label: string;
  cardinality: string;
  permission: string;
  values: Array<{
    id: string,
    permission: string,
    stringValue?: KnoraStringVal,
    listValue?: KnoraListVal,
    linkValue?: KnoraLinkVal
  }>;
}

@Component({
  selector: 'knora-value-edit',
  template: `
    <form [formGroup]="inputForm">
      <hr/>
      <mat-form-field class="fullwidth"
                      appearance="outline"
                      *ngFor="let value of valueData.values; let i = index; let last = last">
        <mat-label>{{ valueData.label }}</mat-label>
        <knora-string-input *ngIf="valueData.propertyType == TextValue && valueData.guiElement == GuiSimpleText" [formControlName]="valueControlTable[i]"
                          placeholder="StringValue"
                          [value]="value.stringValue">
        </knora-string-input>
        <knora-text-input *ngIf="valueData.propertyType == TextValue && valueData.guiElement == GuiTextarea" [formControlName]="valueControlTable[i]"
                            placeholder="StringValue"
                            [value]="value.stringValue">
        </knora-text-input>
        <knora-list-input *ngIf="valueData.propertyType == ListValue" [formControlName]="valueControlTable[i]"
                            placeholder="ListValue"
                            [value]="value.listValue">
        </knora-list-input>
        <knora-link-input *ngIf="valueData.propertyType == LinkValue" [formControlName]="valueControlTable[i]"
                          placeholder="LinkValue"
                          [value]="value.linkValue">
        </knora-link-input>
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
                matSuffix
                (click)="deleteValue(i)">
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
           class="outline fullwidth normalheight"
           appearance="outline">
        <span class="addlabel">{{ valueData.label }}</span>
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
    '.normalheight {height: 50px; }',
    '.outline {padding: 5px; left-margin: 0px; top-margin: 5px; bottom-margin: 5px; right-margin: 30px; border-color: lightgray; border-radius: 5px; border-width: 1px; border-style: solid;}',
    '.addlabel {color: lightgrey; }',
    '.inputoutline { margin: 2px; padding: 2px; border-color: lightgray; border-radius: 2px; border-width: 1px; border-style: solid;}',
    '.commentlabel { color: lightgrey; font-size: 0.75em; }'
  ]
})
export class ValueEditComponent implements OnInit {
  @Input()
  valueData: ValueData;

  inputControl: Array<FormControl>;
  inputForm: FormGroup;
  valueControlTable: Array<string>;
  valueControlIndex: number;
  editButtonVisible: Array<boolean>;
  saveButtonVisible: Array<boolean>;
  cancelButtonVisible: Array<boolean>;
  deleteButtonVisible: Array<boolean>;
  isNew: Array<boolean>;
  addButtonVisible: boolean;

  TextValue = Constants.TextValue;
  ListValue = Constants.ListValue;
  LinkValue = Constants.LinkValue;

  GuiSimpleText = "http://api.knora.org/ontology/salsah-gui/v2#SimpleText";
  GuiTextarea = "http://api.knora.org/ontology/salsah-gui/v2#Textarea";



  constructor(private changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog,
              private knoraService: KnoraService) {
    this.inputControl = [];
    this.inputForm  = new FormGroup({});
    this.valueControlTable = [];
    this.valueControlIndex = 0;
    this.editButtonVisible = [];
    this.saveButtonVisible = [];
    this.cancelButtonVisible = [];
    this.deleteButtonVisible = [];
    this.isNew = [];
  }

  private setAddButtonVisibility() {
    if ((this.valueData.values.length === 0)
      || ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '1-n')))) {
      this.addButtonVisible = true;  // ToDo: add dependency of cardinality
    } else {
      this.addButtonVisible = false;
    }
  }

  private setDeleteButtonVisibility(index: number) {
    if ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '0-1'))) {
      this.deleteButtonVisible[index] = true;
    } else {
      this.deleteButtonVisible[index] = false;
    }
  }

  ngOnInit() {
    for (let i = 0; i < this.valueData.values.length; i++) {
      this.inputForm.addControl('textval' + this.valueControlIndex.toString(), new FormControl({value: '', disabled: true}));
      this.valueControlTable.push('textval' + this.valueControlIndex.toString());
      this.valueControlIndex++;

      this.editButtonVisible.push(
        this.valueData.values[i].permission === 'CR' ||
        this.valueData.values[i].permission === 'D' ||
        this.valueData.values[i].permission === 'M'
      );
      this.saveButtonVisible.push(false);
      this.cancelButtonVisible.push(false);
      if ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '0-1'))) {
        this.deleteButtonVisible.push(
          this.valueData.values[i].permission === 'CR' ||
          this.valueData.values[i].permission === 'D'
        );
      } else {
        this.deleteButtonVisible.push(false); // Cardinality doesn't allow deleting
      }

      this.setAddButtonVisibility();
      this.isNew.push(false);
    }
    if (this.valueData.values.length === 0) {
      this.inputForm.addControl('addbutton', new FormControl({value: '', disabled: false}));
    }
  }

  enableEdit(index) {
    console.log('enableEdit: ', index);
    this.inputForm.controls[this.valueControlTable[index]].enable()
    this.editButtonVisible[index] = false;
    this.saveButtonVisible[index] = true;
    this.cancelButtonVisible[index] = true;
    this.deleteButtonVisible[index] = false;
    this.addButtonVisible = false;
  }

  saveEdit(index) {
    console.log('saveEdit: ', index);
    this.inputForm.controls[this.valueControlTable[index]].disable();
    this.editButtonVisible[index] = true;
    this.saveButtonVisible[index] = false;
    this.cancelButtonVisible[index] = false;
    this.setAddButtonVisibility();
    this.setDeleteButtonVisibility(index);

    if (this.valueData.values[index].id) { // update value
      let newval: UpdateValue;
      switch (this.valueData.propertyType) {
        case Constants.TextValue: {
          const updateTextVal = new UpdateTextValueAsString();
          updateTextVal.id = this.valueData.values[index].id;
          updateTextVal.text = this.inputForm.controls[this.valueControlTable[index]].value.value;
          if (this.inputForm.controls[this.valueControlTable[index]].value.comment) {
            updateTextVal.valueHasComment = this.inputForm.controls[this.valueControlTable[index]].value.comment;
          }
          newval = updateTextVal;
          break;
        }
        case Constants.ListValue: {
          const updateListVal = new UpdateListValue();
          updateListVal.id = this.valueData.values[index].id;
          updateListVal.listNode = this.inputForm.controls[this.valueControlTable[index]].value.nodeIri;
          if (this.inputForm.controls[this.valueControlTable[index]].value.comment) {
            updateListVal.valueHasComment = this.inputForm.controls[this.valueControlTable[index]].value.comment;
          }
          newval = updateListVal;
          break;
        }
        case Constants.LinkValue: {
          const updateLinkVal = new UpdateLinkValue();
          updateLinkVal.id = this.valueData.values[index].id;
          updateLinkVal.linkedResourceIri = this.inputForm.controls[this.valueControlTable[index]].value.resourceIri;
          if (this.inputForm.controls[this.valueControlTable[index]].value.comment) {
            updateLinkVal.valueHasComment = this.inputForm.controls[this.valueControlTable[index]].value.comment;
          }
          newval = updateLinkVal;
          break;
        }
        default: {
          const updateTextVal = new UpdateTextValueAsString();
          updateTextVal.id = this.valueData.values[index].id;
          updateTextVal.text = this.inputForm.controls[this.valueControlTable[index]].value.value;
          if (this.inputForm.controls[this.valueControlTable[index]].value.comment) {
            updateTextVal.valueHasComment = this.inputForm.controls[this.valueControlTable[index]].value.comment;
          }
          newval = updateTextVal;
          break;
          // ToDo: good handling of default case!!!
        }
      }

      const updateResource = new UpdateResource<UpdateValue>();
      updateResource.id = this.valueData.resourceId;
      updateResource.type = this.valueData.resourceType;
      updateResource.property = this.valueData.property;

      updateResource.value = newval;
      console.log(newval);
      this.knoraService.knoraApiConnection.v2.values.updateValue(updateResource).subscribe(res => console.log('RESULT:', res));
    } else { // create value
      const createTextVal = new CreateTextValueAsString();
      createTextVal.text = this.inputForm.controls[this.valueControlTable[index]].value.value;
      if (this.inputForm.controls[this.valueControlTable[index]].value.comment) {
        createTextVal.valueHasComment = this.inputForm.controls[this.valueControlTable[index]].value.comment;
      }

      const createResource = new UpdateResource<CreateValue>();
      createResource.id = this.valueData.resourceId;
      createResource.type = this.valueData.resourceType;
      createResource.property = this.valueData.property;
      createResource.value = createTextVal;

      this.knoraService.knoraApiConnection.v2.values.createValue(createResource).subscribe(
        (res: WriteValueResponse) => console.log(res));
    }
  }

  cancelEdit(index) {
    console.log('cancelEdit: ', index);
    if (this.isNew[index]) { // we cancel an edit of a field just added by the (+) button
      this.inputForm.removeControl(this.valueControlTable[index]);
      this.valueControlTable.pop();

      this.editButtonVisible.pop();
      this.saveButtonVisible.pop();
      this.cancelButtonVisible.pop();
      this.deleteButtonVisible.pop();
      this.isNew.pop();
      this.valueData.values.pop();
      this.setDeleteButtonVisibility(index);
      this.setAddButtonVisibility();
      console.log('DELETING NEWEST ELEMENT!', index);
      return;
    }
    this.inputForm.controls[this.valueControlTable[index]].disable();
    this.editButtonVisible[index] = true;
    this.saveButtonVisible[index] = false;
    this.cancelButtonVisible[index] = false;
    this.setDeleteButtonVisibility(index);
    this.setAddButtonVisibility();
  }

  deleteValue(index: number) {
    console.log('deleteValue: ', index);
    console.log('valueData.values[index]: ', this.valueData.values[index]);

    const dialogData = new ConfirmDialogModel(
      "Löschen bestätigen",
      'Diesen Wert löschen?',
      'Löschkommentar'
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;

      if (result.status) {
        const deleteVal = new DeleteValue();

        deleteVal.id = this.valueData.values[index].id;
        deleteVal.type = this.valueData.propertyType ? this.valueData.propertyType as string : ''; // ToDo: why is the type necessary?
        if (result.comment) {
          deleteVal.deleteComment = result.value.comment;
        }

        const updateResource = new UpdateResource<DeleteValue>();

        updateResource.id = this.valueData.resourceId;;
        updateResource.type = this.valueData.resourceType;
        updateResource.property = this.valueData.property;

        updateResource.value = deleteVal;
        console.log(updateResource);

        this.knoraService.knoraApiConnection.v2.values.deleteValue(updateResource).subscribe(
          (res: DeleteValueResponse) => console.log(res)
        );

        this.inputForm.removeControl(this.valueControlTable[index]);
        for (let i = this.valueData.values.length - 2; i >= index; i--) {
          this.valueData.values[i] = this.valueData.values[i + 1];
          this.valueControlTable[i] = this.valueControlTable[i + 1];
          this.editButtonVisible[i] = this.editButtonVisible[i + 1];
          this.saveButtonVisible[i] = this.saveButtonVisible[i + 1];
          this.cancelButtonVisible[i] = this.cancelButtonVisible[i + 1];
          this.deleteButtonVisible[i] = this.deleteButtonVisible[i + 1];

          this.isNew[i] = this.isNew[i + 1];
        }
        this.valueData.values.pop();
        this.editButtonVisible.pop();
        this.saveButtonVisible.pop();
        this.cancelButtonVisible.pop();
        this.valueControlTable.pop();
        this.isNew.pop();
        // re-adjust the delete button visibility
        /*
        if ((this.valueData.values.length > 0) && ((this.valueData.cardinality === '0-n') || (this.valueData.cardinality === '0-1'))) {
          this.deleteButtonVisible[i] = this.valueData.values[i].permission === 'CR' || this.valueData.values[i].permission === 'D';
        } else {
          this.deleteButtonVisible.push(false); // Cardinality doesn't allow deleting
        }
         */
      }
    });
  }

  addField() {
    //
    // prepare next control
    //
    this.inputForm.addControl('textval' + this.valueControlIndex.toString(), new FormControl({value: '', disabled: false}));
    this.valueControlTable.push('textval' + this.valueControlIndex.toString());
    this.valueControlIndex++;

    this.editButtonVisible.push(false);
    this.saveButtonVisible.push(true);
    this.cancelButtonVisible.push(true);
    this.deleteButtonVisible.push(false);
    switch (this.valueData.propertyType) {
      case Constants.TextValue: {
        this.valueData.values.push({id: '', permission: '', stringValue: new KnoraStringVal('', '')});
        break;
      }
      case Constants.ListValue: {
        this.valueData.values.push({id: '', permission: '', listValue: new KnoraListVal('', '')});
        break;
      }
      case Constants.LinkValue: {
        this.valueData.values.push({id: '', permission: '', linkValue: new KnoraLinkVal('', '', '')});
        break;
      }
    }
    this.addButtonVisible = false;
    this.isNew.push(true);
  }

}
