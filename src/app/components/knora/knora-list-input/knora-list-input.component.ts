import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from "@angular/material/form-field";
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from "@angular/forms";
import {FocusMonitor} from "@angular/cdk/a11y";
import {Observable, Subject} from "rxjs";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {KnoraService} from "../../../services/knora.service";
import {concat} from "rxjs";
import {FullList, ListInfo, FullListNode} from "@knora/api";


// tslint:disable-next-line:component-class-suffix
export class KnoraListVal {
  constructor(public nodeIri: string, public comment: string) {}
}

interface DispNode {
  id: string;
  label: string;
  children?: Array<DispNode>;
}

@Component({
  selector: 'knora-list-input',
  template: `
    <div [formGroup]="parts" class="knora-string-input-container">
      <table class="knora-input-table">
        <tr>
          <td class="knora-input-table-label-cell">{{valueLabel}}:</td>
          <td>
            <mat-select class="knora-list-input-element klie-val"
                        formControlName="nodeIri"
                        aria-label="Value"
                        (selectionChange)="_handleInput()">
              <mat-option *ngFor="let dispNode of dispNodes" [value]="dispNode.id">{{dispNode.label}}</mat-option>
            </mat-select>
          </td>
        </tr>
        <tr>
          <td class="knora-input-table-label-cell">{{commentLabel}}:</td>
          <td>
            <input class="knora-list-input-element klie-com" formControlName="comment" aria-label="Comment" (input)="_handleInput()">
          </td>
        </tr>
      </table>
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: KnoraListInputComponent}],
  styles: [
    '.knora-input-table {width: 100%;}',
    '.knora-input-table-label-cell {float: right;}',
    '.knora-list-input-element { width: 100%; background: none; padding: 2px; outline: none; font: inherit; text-align: left; }',
    '.example-tel-input-spacer { opacity: 0; transition: opacity 200ms; }',
    ':host.example-floating .example-tel-input-spacer { opacity: 1; }',
    '.bg {background-color: lightgrey;}'
  ]
})
export class KnoraListInputComponent
  implements ControlValueAccessor, MatFormFieldControl<KnoraListVal>, OnDestroy, OnInit {

  @Input()
  valueLabel: string;

  @Input()
  commentLabel: string;

  static nextId = 0;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-list-input';
  id = `knora-list-input-${KnoraListInputComponent.nextId++}`;
  describedBy = '';

  private dispNodes: Array<DispNode>;
  private selected: string;

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {nodeIri, comment}} = this.parts;
    return !nodeIri && !comment;
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
  get value(): KnoraListVal | null {
    const {value: {nodeIri, comment}} = this.parts;
    return new KnoraListVal(nodeIri, comment);
  }
  set value(knoraVal: KnoraListVal | null) {
    console.log('SETTING VALUE....');
    const {nodeIri, comment} = knoraVal || new KnoraListVal('', '');
    this.parts.setValue({nodeIri, comment});
    this.selected = nodeIri;
    this.stateChanges.next();
  }

  constructor(formBuilder: FormBuilder,
              private knoraService: KnoraService,
              private _focusMonitor: FocusMonitor,
              private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl) {
    this.dispNodes = [];
    this.parts = formBuilder.group({
      nodeIri: '',
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
    if (this.value) {
      this.knoraService.getListNode(this.value.nodeIri).subscribe( node => {
        this.knoraService.getFullList(node.hasRootNode || '').subscribe(
          (fulllist: FullList) => {
            this.dispNodes = fulllist.children.map(
              (nd: FullListNode) => {
                return {id: nd.id, label: nd.name || 'NAME'};
              }
            );
          });
      });
    }
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

  writeValue(knoraVal: KnoraListVal | null): void {
    this.value = knoraVal;
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.remove('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.remove('bg');
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.add('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.add('bg');
    }
  }

  _handleInput(): void {
    console.log('------------------->', this.selected);
    console.log('===================>', this.parts.value);
    this.onChange(this.parts.value);
  }

}
