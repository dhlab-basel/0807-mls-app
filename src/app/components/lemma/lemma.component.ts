import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {KnoraService, ResourceData, LemmaData} from "../../services/knora.service";


@Component({
  selector: 'app-lemma',
  template: `
    <mat-card>
      <mat-card-title>
        {{ lemma.label }} <span *ngIf="lemma.properties[hasDeceasedValue] && (lemma.properties[hasDeceasedValue].values[0] == 'Ja')">†</span>
      </mat-card-title>
      <div  *ngIf="lemma.properties[hasVariants]">
        {{ lemma.properties[hasVariants].label }}:
        <span *ngFor="let val of lemma.properties[hasVariants].values">{{ val }}</span>
      </div>
      <div *ngIf="lemma.properties[hasPseudonym]">
        {{ lemma.properties[hasPseudonym].label }}:
        <span *ngFor="let val of lemma.properties[hasPseudonym].values">{{ val }}</span>
      </div>
      <div>
        <span *ngIf="lemma.properties[hasStartDateInfo]">{{ lemma.properties[hasStartDateInfo].values[0] }}</span>
        <span *ngIf="lemma.properties[hasStartDate]"> {{ lemma.properties[hasStartDate].values[0] }}</span>
        <span *ngIf="lemma.properties[hasEndDateInfo]">, {{ lemma.properties[hasEndDateInfo].values[0] }}</span>
        <span *ngIf="lemma.properties[hasEndDate]"> {{ lemma.properties[hasEndDate].values[0] }}</span>
      </div>
      <div *ngIf="lemma.properties[hasViaf]">
        {{lemma.properties[hasViaf].label}}: <a href="http://viaf.org/viaf/{{ lemma.properties[hasViaf].values[0] }}">{{ lemma.properties[hasViaf].values[0] }}</a>
      </div>
      <div *ngIf="lemma.properties[hasGnd]">
        {{lemma.properties[hasGnd].label}}: <a href="http://d-nb.info/gnd/{{ lemma.properties[hasGnd].values[0] }}">{{ lemma.properties[hasGnd].values[0] }}</a> }}
      </div>
    </mat-card>
   <!--<mat-card>
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
    </mat-card>-->
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
  lemma: LemmaData;
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  hasLemmaDescription = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasLemmaDescription';
  hasLemmaComment = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasLemmaComment';
  hasDeceasedValue = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasDeceasedValue';
  hasEndDate = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasEndDate';
  hasEndDateInfo = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasEndDateInfo';
  hasFamilyName = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasFamilyName';
  hasGivenName = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasGivenName';
  hasLemmaText = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasLemmaText';
  hasLemmaType = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasLemmaType';
  hasStartDate = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasStartDate';
  hasStartDateInfo = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasStartDateInfo';
  hasViaf = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasViaf';
  hasGnd = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasGnd'
  hasVariants = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasVariants';
  hasPseudonym = 'http://0.0.0.0:3333/ontology/0807/mls/v2#hasPseudonym';




  constructor(private route: ActivatedRoute,
              private knoraService: KnoraService) {
    this.lemma = {id: '', label: '', properties: {}};
  }

  getLemma() {
    this.route.params.subscribe(params => {
      this.lemmaIri = params.iri;
      this.knoraService.getLemma(params.iri).subscribe((data) => {
        console.log(data)
        this.lemma = data;
      });
    });
  }

  ngOnInit() {
    this.getLemma();
  }
}
