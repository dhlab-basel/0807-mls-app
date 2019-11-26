import { Component, Input, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-string-value-edit',
  template: `
    <div>
      <mat-form-field appearance="outline"
                      #inele *ngFor="let value of values">
        <mat-label>{{ label }}</mat-label>
        <input  matInput [value]="value" [formControl]="inputControl">
        <!-- <button matSuffix (click)="logit(inele);"> -->
        <button *ngIf="editButtonVisible"
                mat-mini-fab
                matSuffix
                (click)="enableEdit();">
          <mat-icon>edit</mat-icon>
        </button>
        <button *ngIf="saveButtonVisible"
                mat-mini-fab
                matSuffix
                (click)="saveEdit();">
          <mat-icon>save</mat-icon>
        </button>
        <button *ngIf="cancelButtonVisible"
                mat-mini-fab
                matSuffix
                (click)="cancelEdit();">
          <mat-icon>cancel</mat-icon>
        </button>
      </mat-form-field>
    </div>
  `,
  styles: []
})
export class StringValueEditComponent implements OnInit {
  @Input()
  values: Array<string>;

  @Input()
  label: string;

  inputControl: FormControl;
  editButtonVisible: boolean;
  saveButtonVisible: boolean;
  cancelButtonVisible: boolean;

  constructor() {
    this.inputControl = new FormControl({value: '', disabled: true});
    this.editButtonVisible = true;
    this.saveButtonVisible = false;
    this.cancelButtonVisible = false;
  }

  ngOnInit() {
  }

  logit(ele) {
    console.log(ele);
  }

  enableEdit() {
    this.inputControl.enable();
    this.editButtonVisible = false;
    this.saveButtonVisible = true;
    this.cancelButtonVisible = true;
  }

  saveEdit() {
    this.inputControl.disable();
    this.editButtonVisible = true;
    this.saveButtonVisible = false;
    this.cancelButtonVisible = false;
  }

  cancelEdit() {
    this.inputControl.disable();
    this.editButtonVisible = true;
    this.saveButtonVisible = false;
    this.cancelButtonVisible = false;
  }

}
