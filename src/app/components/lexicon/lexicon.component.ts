import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnoraApiService } from '../../services/knora-api.service';

@Component({
  selector: 'app-lexicon',
  template: `
      <h2>
          {{ lexiconTitle }}
      </h2>
      <table mat-table [dataSource]="lexicon" class="mat-elevation-z8">
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

  lexicon: Array<{[index: string]: string}> = [];
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  lexiconTitle: string = '';

  labeltable: {[index: string]: string} = {
    'mls:hasShortname': 'Name',
    'mls:hasCitationForm': 'Zitierform',
    'mls:hasYear': 'Jahr',
    'mls:hasLexiconComment': 'Kommentar',
    'mls:hasLexiconWeblink': 'Weblink',
    'mls:hasLibrary': 'Bibliothek',
  };

  constructor(private route: ActivatedRoute,
              private knoraApiService: KnoraApiService) {}

  getLexicon() {
    this.route.params.subscribe(params => {
      if  (params.hasOwnProperty('iri')) {
        console.log(params.iri);
        this.lexiconIri = params.iri;
      }
      this.knoraApiService.getResource(this.lexiconIri, this.labeltable).subscribe((data) => {
        console.log("---------------------------------->");
        console.log(data);
        const lexicondata: Array<{ label: string, values: string }> = [];
        for (const propname in data) {
          if (data.hasOwnProperty(propname)) {
            if (propname === 'mls:hasShortname') {
              this.lexiconTitle = data[propname].propvalues[0];
            }
            lexicondata.push({label: data[propname].proplabel, values: data[propname].propvalues});
          }
        }
        this.lexicon = lexicondata;
      });
    });
  }

  ngOnInit() {
    this.getLexicon();
  }

}
