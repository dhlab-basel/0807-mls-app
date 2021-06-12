import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild} from '@angular/core';

@Component({
  selector: 'app-aindex',
  template: `
    <mat-button-toggle-group #aindexGroup="matButtonToggleGroup" name="aIndex" aria-label="Alpha Index">
        <mat-button-toggle *ngFor="let c of chars" value="{{c}}" (change)="charClicked($event)">{{c}}</mat-button-toggle>
    </mat-button-toggle-group>
  `,
  styles: [
    'mat-button-toggle {width: 25px;}'
  ]
})

export class AindexComponent implements OnInit {
  chars: Array<string>;

  @ViewChild('aindexGroup')
  private aindexGroup: ElementRef;

  @Input()
  activeChar: string;

  @Output()
  charChange = new EventEmitter();

  constructor() {
    this.chars = AindexComponent.charRange('A', 'Z');

  }

  static charRange(start: string, end: string): Array<string> {
    const result: Array<string> = [];
    let i = start.charCodeAt(0);
    while (i <= end.charCodeAt(0)) {
      result.push(String.fromCharCode(i));
      i++;
    }
    return result;
  }

  charClicked(event): void {
    this.charChange.emit(event.value);
  }

  ngOnInit() {
  }

}
