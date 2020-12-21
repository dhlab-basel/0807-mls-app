import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Subject} from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

// tslint:disable-next-line:component-class-suffix
export class KnoraStringVal {
  constructor(public value: string, public comment: string) {}
}

@Component({
  selector: 'knora-string-input',
  template: `
    <div [formGroup]="parts" class="knora-string-input-container">
      <table class="knora-input-table">
        <tr>
          <td class="knora-input-table-label-cell">{{valueLabel}}:</td>
          <td>
            <input class="knora-string-input-element ksie-val" formControlName="value" aria-label="Value" (input)="_handleInput()">
          </td>
        </tr>
        <tr>
          <td class="knora-input-table-label-cell">{{commentLabel}}:</td>
          <td>
            <input class="knora-string-input-element ksie-com" formControlName="comment" aria-label="Comment" (input)="_handleInput()">
        </td>
        </tr>
      </table>
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: KnoraStringInputComponent}],
  styles: [
    //'.knora-string-input-container { display: flex; }',
    '.knora-input-table {width: 100%;}',
    '.knora-input-table-label-cell {float: right;}',
    '.knora-string-input-element { width: 100%; background: none; padding: 2px; outline: none; font: inherit; text-align: left; }',
    '.example-tel-input-spacer { opacity: 0; transition: opacity 200ms; }',
    ':host.example-floating .example-tel-input-spacer { opacity: 1; }',
    '.bg {background-color: lightgrey;}'
  ]
})

export class KnoraStringInputComponent
  implements ControlValueAccessor, MatFormFieldControl<KnoraStringVal>, OnDestroy, OnInit {

  @Input()
  valueLabel: string;

  @Input()
  commentLabel: string;

  static nextId = 0;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-string-input';
  id = `knora-string-input-${KnoraStringInputComponent.nextId++}`;
  describedBy = '';

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {value, comment}} = this.parts;
    return !value && !comment;
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
  get value(): KnoraStringVal | null {
    const {value: {value, comment}} = this.parts;
    return new KnoraStringVal(value, comment);
  }
  set value(knoraVal: KnoraStringVal | null) {
    const {value, comment} = knoraVal || new KnoraStringVal('', '');
    this.parts.setValue({value, comment});
    this.stateChanges.next();
  }

  constructor(formBuilder: FormBuilder,
              private _focusMonitor: FocusMonitor,
              private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl) {

    this.parts = formBuilder.group({
      value: '',
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

  writeValue(knoraVal: KnoraStringVal | null): void {
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
      this._elementRef.nativeElement.querySelector('.ksie-val')!.classList.remove('bg');
      this._elementRef.nativeElement.querySelector('.ksie-com')!.classList.remove('bg');
     } else {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.ksie-val')!.classList.add('bg');
      this._elementRef.nativeElement.querySelector('.ksie-com')!.classList.add('bg');
    }
    console.log('setDisabledState');
  }

  _handleInput(): void {
    this.onChange(this.parts.value);
  }

}



