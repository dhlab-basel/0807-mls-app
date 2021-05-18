import {Component, ElementRef, OnInit, ViewChild, Inject} from '@angular/core';
import {KnoraService} from "../../services/knora.service";
import {MatRadioModule} from '@angular/material/radio';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-lemmaselect',
  template: `
    <mat-card>
      <mat-card-title>
        Stichwort
      </mat-card-title>
      <mat-card-subtitle>
        Suche und wähle das Stichwort, zu dem ein neuer Artikel erstellt werden soll
      </mat-card-subtitle>
      <mat-card-content>
        <input #searchField
               name="searchterm"
               [value]="searchterm"
               matInput
               type="search"
               placeholder="Suche nach..." />
        <button mat-raised-button (click)="searchEvent($event)">Search</button>
        <div *ngFor="let row = index; let lemma of lemmata" (click)="gaga(row)">{{lemma}}</div>
      </mat-card-content>
  `,
  styles: [
    '.example-radio-group { display: flex; flex-direction: column; margin: 15px 0; }',
    '.example-radio-button { margin: 5px; }'
  ]
})
export class LemmaselectComponent implements OnInit {
  @ViewChild('searchField')
  private searchField: ElementRef;

  searchterm: string = '';
  lemmata: Array<string> = [];
  season: string;

  constructor(private knoraService: KnoraService,
              public dialogRef: MatDialogRef<LemmaselectComponent> /*,
              @Inject(MAT_DIALOG_DATA) public data: DialogData*/) {

  }

  ngOnInit(): void {
  }

  searchEvent(event): boolean {
    this.searchterm = this.searchField.nativeElement.value;
    //this.page = 0;
    this.getLemmata();
    return false;
  }

  getLemmata(): void {
    const params: {[index: string]: string} = {
      page: '0',
      searchterm: this.searchterm
    };
    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasLemmaText',
    ];
    this.knoraService.gravsearchQuery('lemmata_search', params, fields)
      .subscribe(data => {
        //this.lemmata = data;

        for (let i in data) {
          this.lemmata[i] = data[i][1]
        }
        console.log(this.lemmata);
        //this.showProgbar = false;
      });
  }
  gaga(event): void {
    console.log(event);
  }

  }
