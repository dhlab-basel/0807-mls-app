import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {KnoraService} from '../../../services/knora.service';

// tslint:disable-next-line:component-class-suffix
export class KnoraLinkVal {
  constructor(public label: string, public resourceIri: string, public comment: string) {}
}

export class SearchResultItem {
  constructor(public resourceIri: string, public label: string) {}
}

@Component({
  selector: 'knora-link-input',
  template: `
    <div [formGroup]="parts" class="knora-string-input-container">
      <table class="knora-input-table">
        <tr>
          <td class="knora-input-table-label-cell">{{valueLabel}}:</td>
          <td>
            <input [matAutocomplete]="auto"
                   class="knora-link-input-element klnkie-val"
                   formControlName="label"
                   aria-label="Value"
                   (input)="_handleLinkInput()">
            <input style="width: 100%" formControlName="resourceIri">
            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="_optionSelected($event.option.value)">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </td>
        </tr>
        <tr>
          <td class="knora-input-table-label-cell">{{commentLabel}}:</td>
          <td>
            <input class="knora-link-input-element klnkie-com" formControlName="comment" aria-label="Comment" (input)="_handleInput()">
        </td>
        </tr>
      </table>
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: KnoraLinkInputComponent}],
  styles: [
    //'.knora-string-input-container { display: flex; }',
    '.knora-input-table {width: 100%;}',
    '.knora-input-table-label-cell {float: right;}',
    '.knora-link-input-element { width: 100%; background: none; padding: 2px; outline: none; font: inherit; text-align: left; }',
    '.example-tel-input-spacer { opacity: 0; transition: opacity 200ms; }',
    ':host.example-floating .example-tel-input-spacer { opacity: 1; }',
    '.bg {background-color: lightgrey;}'
  ]
})

export class KnoraLinkInputComponent
  implements ControlValueAccessor, MatFormFieldControl<KnoraLinkVal>, OnDestroy, OnInit {

  static nextId = 0;

  @Input()
  valueLabel: string;

  @Input()
  commentLabel: string;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-link-input';
  id = `knora-link-input-${KnoraLinkInputComponent.nextId++}`;
  describedBy = '';

  options: Array<{id: string, label: string}> = [];

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {label, resourceIri, comment}} = this.parts;
    return !label && !resourceIri && !comment;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  @Input()
  get value(): KnoraLinkVal | null {
    const {value: {label, resourceIri, comment}} = this.parts;
    return new KnoraLinkVal(label, resourceIri, comment);
  }
  set value(knoraVal: KnoraLinkVal | null) {
    const {label, resourceIri, comment} = knoraVal || new KnoraLinkVal('', '', '');
    this.parts.setValue({label, resourceIri, comment});
    this.stateChanges.next();
  }

  constructor(formBuilder: FormBuilder,
              private _focusMonitor: FocusMonitor,
              private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl,
              public knoraService: KnoraService) {

    this.parts = formBuilder.group({
      label: '',
      resourceIri: '',
      comment: ''
    });

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (!this.valueLabel) { this.valueLabel = 'Value'; }
    if (!this.commentLabel) { this.commentLabel = 'Comment'; }
    this.parts.valueChanges.pipe(
      map(data => console.log(data))
    );
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  writeValue(knoraVal: KnoraLinkVal | null): void {
    this.value = knoraVal;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klnkie-val')!.classList.remove('bg');
      this._elementRef.nativeElement.querySelector('.klnkie-com')!.classList.remove('bg');
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klnkie-val')!.classList.add('bg');
      this._elementRef.nativeElement.querySelector('.klnkie-com')!.classList.add('bg');
    }
    console.log('setDisabledState');
  }

  _handleLinkInput(): void {
    this.knoraService.getResourcesByLabel(this.parts.value.label).subscribe(
      res => {
        console.log('_handleLinkInput:', res);
        this.options = res;
        this.parts.value.label = res[0].label;
        this.parts.value.resourceIri = res[0].id;
        this.onChange(this.parts.value);
      }
    );
  }

  _optionSelected(val): void {
    console.log('_optionSelected(1):', val);
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    this.value = new KnoraLinkVal(res[0].label, res[0].id, this.parts.value.comment);
  }

  _handleInput(): void {
    console.log('_handleInput:');
    this.onChange(this.parts.value);
  }

}



