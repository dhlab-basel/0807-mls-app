import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {KnoraService, ResourceData} from "../../services/knora.service";


@Component({
  selector: 'app-lemma',
  template: `
    <mat-card>
        <mat-card-title>
            {{ lemma.label }}
        </mat-card-title>
        <table mat-table [dataSource]="lemma.properties" class="mat-elevation-z8">
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
  lemma: ResourceData;
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];

  constructor(private route: ActivatedRoute,
              private knoraService: KnoraService) {
    this.lemma = {id: '', label: '', properties: []};
  }

  getLemma() {
    this.route.params.subscribe(params => {
      this.lemmaIri = params.iri;
      this.knoraService.getResource(params.iri).subscribe((data) => {
        this.lemma = data;
      });
    });
  }

  ngOnInit() {
    this.getLemma();
  }
}
