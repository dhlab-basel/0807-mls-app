import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>
      {{title}}
    </h1>

    <div mat-dialog-content>
      <p>{{message}}</p>
    </div>

    <mat-dialog-content [formGroup]="form">
      <mat-form-field>
        <input matInput
               [placeholder]="label"
               formControlName="comment">
      </mat-form-field>
    </mat-dialog-content>

    <div mat-dialog-actions>
      <button mat-button (click)="onDismiss()">No</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">Yes</button>
    </div>
  `,
  styles: []
})
export class ConfirmDialogComponent implements OnInit {
  form: FormGroup;
  comment: string;
  title: string;
  message: string;
  label: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.label = data.label;
  }

  ngOnInit() {
    this.form = this.fb.group({
      comment: [this.comment, []],
    });
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(new ConfirmDialogResult(true, this.form.value));
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(new ConfirmDialogResult(true));
  }

}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {

  constructor(public title: string, public message: string, public label: string) {
  }
}

export class ConfirmDialogResult {

  constructor(public status: boolean, public value?: string) {
  }
}
