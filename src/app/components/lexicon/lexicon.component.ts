import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnoraApiService } from '../../services/knora-api.service';
import { GetLexiconService } from '../../services/get-lexicon.service';

@Component({
  selector: 'app-lexicon',
  template: `
      <h2>
          {{ lexiconTitle }}
      </h2>
      <table mat-table [dataSource]="lexicon" class="mat-elevation-z8">
          <ng-container matColumnDef="KEY">
              <th mat-header-cell *matHeaderCellDef> Feld </th>
              <td mat-cell *matCellDef="let element"> {{element.propname}}: </td>
          </ng-container>
          <ng-container matColumnDef="VALUE">
              <th mat-header-cell *matHeaderCellDef> Wert </th>
              <td mat-cell *matCellDef="let element"> {{element.propvalue}} </td>
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
  lexiconIri: string;
  lexicon: Array<{[index: string]: string}> = [];
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  lexiconTitle: string = '';

  labeltable: {[index: string]: string} = {
    lexiconShortname: 'Name',
    lexiconCitation: 'Zitierform',
    lexiconYear: 'Jahr',
    lexiconComment: 'Kommentar',
    lexiconWeblink: 'Weblink',
    lexiconLibrary: 'Bibliothek',
  };

  constructor(private getLexiconService: GetLexiconService,
              private route: ActivatedRoute,
              private knoraApiService: KnoraApiService) {}

  getLexicon() {
    this.route.params.subscribe(params => {
      this.lexiconIri = params.iri;
      this.getLexiconService.getLexicon(params.iri).subscribe((data) => {
        const tmp: Array<{ [index: string]: string }> = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            tmp.push({propname: this.labeltable[key], propvalue: data[key]});
          }
        }
        this.lexicon = tmp;
        this.lexiconTitle = data.lexiconShortname;
        console.log(data);
      });
    });
  }

  ngOnInit() {
    this.getLexicon();
  }

}
