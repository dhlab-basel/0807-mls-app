import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import { KnoraApiService } from '../../services/knora-api.service';
import { Observable } from 'rxjs';
import { map, mergeMap, concatMap, take} from 'rxjs/operators';


@Component({
  selector: 'app-lemma',
  template: `
    <mat-card>
        <mat-card-title>
            {{ lemmaTitle }}
        </mat-card-title>
        <table mat-table [dataSource]="lemma" class="mat-elevation-z8">
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
            <tr mat-row *matRowDef="let row; columns: columnsToDisplay;"></tr>
        </table>
    </mat-card>
    <mat-card>
        <mat-card-title>
            In Lexika:
        </mat-card-title>
        <app-lex-from-lemma [lemmaIri]="lemmaIri">
        </app-lex-from-lemma>
    </mat-card>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})

export class LemmaComponent implements OnInit {
  lemmaIri: string;
  lemma: Array<{[index: string]: string}> = [];
  lemmaTitle: string = '';
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  labeltable: {[index: string]: string} = {
    'mls:hasLemmaText': 'Lemma',
    'mls:hasVariants': 'Varianten',
    'mls:hasPseudonym': 'Pseudnyme',
    'mls:hasStartDate': 'Von',
    'mls:hasStartDateInfo': 'Info zu Beginn',
    'mls:hasEndDate': 'Bis',
    'mls:hasEndDateInfo': 'Info zu Ende',
    'mls:hasCentury': 'Jahrhundert',
    'mls:hasFamilyName': 'Nachname',
    'mls:hasGivenName': 'Vorname',
    'mls:hasDeceasedValue': 'Gestorben',
    'mls:hasLemmaType': 'Lamma-Typ',
    'mls:hasSex': 'Geschlecht',
    'mls:hasRelevanceValue': 'Relevant',
    'mls:hasLemmaDescription': 'Beschreibung',
    'mls:hasLemmaComment': 'Kommentar',
    'mls:hasGnd': 'GND',
    'mls:hasViaf': 'VIAF',

  };

  constructor(private route: ActivatedRoute,
              private knoraApiService: KnoraApiService) {}

  getLemma() {
    this.route.params.subscribe(params => {
      this.lemmaIri = params.iri;
      this.knoraApiService.getResource(params.iri, this.labeltable).subscribe((data) => {
        console.log(data);
        const lemmadata: Array<{label: string, values: string}> = [];
        for (const propname in data) {
          if (data.hasOwnProperty(propname)) {
            if (propname === 'mls:hasLemmaText') {
              this.lemmaTitle = data[propname].propvalues[0];
            }
            lemmadata.push({label: data[propname].proplabel, values: data[propname].propvalues});
          }
        }
        this.lemma = lemmadata;
      });
    });

  }

  ngOnInit() {
    this.getLemma();
  }
}
