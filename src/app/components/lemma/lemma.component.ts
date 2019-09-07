import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import { KnoraApiService } from '../../services/knora-api.service';
import { Observable } from 'rxjs';
import { GetLemmaService } from '../../services/get-lemma.service';
import { GetLemmataService} from '../../services/get-lemmata.service';
import { map, mergeMap, concatMap, take} from 'rxjs/operators';


@Component({
  selector: 'app-lemma',
  template: `
    <h2>
        {{ lemmaTitle }}
    </h2>
     <table mat-table [dataSource]="lemma" class="mat-elevation-z8">
        <ng-container matColumnDef="KEY">
            <th mat-header-cell *matHeaderCellDef> Feld </th>
            <td mat-cell *matCellDef="let element"> {{element.propname}}: </td>
        </ng-container>
        <ng-container matColumnDef="VALUE">
            <th mat-header-cell *matHeaderCellDef> Wert </th>
            <td mat-cell *matCellDef="let element"> {{element.propvalue}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsToDisplay;"></tr>
    </table>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})

export class LemmaComponent implements OnInit {
  lemmaIri;
  lemma: Array<{[index: string]: string}> = [];
  lemmaTitle: string = 'GAGA';
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  labeltable: {[index: string]: string} = {
    lemmaText: 'Lemma',
    lemmaStart: 'Von',
    lemmaEnd: 'Bis',
    lemmaFamilyName: 'Nachname',
    lemmaGivenName: 'Vorname',
    lemmaDeceased: 'Gestorben',
    lemmaType: 'Lamma-Typ',
    lemmaSex: 'Geschlecht',
    lemmaRelevanceValue: 'Relevant'
  };

  constructor(private getLemmaService: GetLemmaService,
              private route: ActivatedRoute,
              private knoraApiService: KnoraApiService) {}

  getLemma() {
    this.route.params.subscribe(params => {
      this.lemmaIri = params.iri;
      this.getLemmaService.getFullLemma(params.iri).subscribe((data) => {
        const tmp: Array<{[index: string]: string}> = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            tmp.push({propname: this.labeltable[key], propvalue: data[key]});
          }
        }
        this.lemma = tmp;
        this.lemmaTitle = data.lemmaText;
        console.log(data);
      });
    });

  }

  ngOnInit() {
    this.getLemma();
  }
}
