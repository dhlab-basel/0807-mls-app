import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-aindex',
  template: `
    <p>
      <span *ngFor="let c of chars">
        <button (click)="charClicked(c)">{{c}}</button>
      </span>
    </p>
  `,
  styles: []
})
export class AindexComponent implements OnInit {
  private chars: Array<string>;
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
      result.push(String.fromCharCode(i))
      i++;
    }
    return result;
  }

  charClicked(c: string): void {
    this.charChange.emit(c);
  }

  ngOnInit() {

  }

}
