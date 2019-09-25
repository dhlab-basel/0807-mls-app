import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {KnoraService, ResourceData} from "../../services/knora.service";

@Component({
  selector: 'app-lexicon',
  template: `
      <h2>
          {{ lexiconTitle }}
      </h2>
      <table mat-table [dataSource]="lexicon.properties" class="mat-elevation-z8">
          <ng-container matColumnDef="KEY">
              <th mat-header-cell *matHeaderCellDef> Feld </th>
              <td mat-cell *matCellDef="let element"> {{element.label}}: </td>
          </ng-container>
          <ng-container matColumnDef="VALUE">
              <th mat-header-cell *matHeaderCellDef> Wert </th>
              <td mat-cell *matCellDef="let element">
                  <div *ngFor="let val of element.values">{{ val }}</div>
              </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" ></tr>
      </table>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})
export class LexiconComponent implements OnInit {
  @Input()
  lexiconIri: string;

  //lexicon: Array<{[index: string]: string}> = [];
  lexicon: ResourceData;
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  lexiconTitle: string = '';


  constructor(private route: ActivatedRoute,
              private knoraService: KnoraService) {}

  getLexicon() {
    this.route.params.subscribe(params => {
      if  (params.hasOwnProperty('iri')) {
        console.log(params.iri);
        this.lexiconIri = params.iri;
      }
      this.knoraService.getResource(this.lexiconIri).subscribe(data => {
        this.lexicon = data;
        for (const ele of data.properties) {
          if (ele.label === 'Kürzel') {
            this.lexiconTitle = ele.values[0];
          }
        }
      });
    });
  }

  ngOnInit() {
    this.getLexicon();
  }

}
